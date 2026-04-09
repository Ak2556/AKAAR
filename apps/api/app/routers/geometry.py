from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from ..models.schemas import ModelAnalysis
from ..core.config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address
import tempfile
import os
import trimesh

router = APIRouter(prefix="/geometry", tags=["3D Geometry"])
limiter = Limiter(key_func=get_remote_address)

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB

@router.post("/analyze", response_model=ModelAnalysis)
@limiter.limit("10/minute")
async def analyze_model(request: Request, file: UploadFile = File(...)):
    """
    Analyze a 3D model file (STL, OBJ, etc.)
    Returns volume, surface area, bounding box, and other metrics.
    """
    # Check file size if Content-Length header is provided
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")
        
    # Validate file type
    allowed_extensions = [".stl", ".obj", ".ply", ".off", ".gltf", ".glb"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            # Read in chunks to enforce size limit when Content-Length is absent/spoofed
            total_size = 0
            while chunk := await file.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE_BYTES:
                    os.unlink(tmp.name)
                    raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")
                tmp.write(chunk)
            tmp_path = tmp.name

        # Load and analyze mesh
        mesh = trimesh.load(tmp_path)

        # Clean up temp file
        os.unlink(tmp_path)

        # Handle scene vs mesh
        if isinstance(mesh, trimesh.Scene):
            if len(mesh.geometry) == 0:
                raise HTTPException(status_code=400, detail="Empty model")
            mesh = trimesh.util.concatenate(mesh.geometry.values())

        # Calculate metrics
        bounds = mesh.bounds.tolist()
        dimensions = (mesh.bounds[1] - mesh.bounds[0]).tolist()

        # Estimate print time (rough: 1 hour per 100 cm³)
        volume_cm3 = mesh.volume / 1000  # mm³ to cm³
        estimated_print_time = volume_cm3 / 100  # hours

        # Estimate material (PLA density ~1.25 g/cm³)
        estimated_material = volume_cm3 * 1.25  # grams

        # Calculate Costs
        material_cost = estimated_material * settings.COST_PLA_PER_GRAM
        machine_cost = estimated_print_time * settings.MACHINE_HOUR_RATE
        total_base_cost = material_cost + machine_cost
        
        # Apply Markup
        markup_amount = (total_base_cost * settings.MARKUP_PERCENTAGE) / 100
        final_price = round(total_base_cost + markup_amount, 2)

        return ModelAnalysis(
            volume=float(mesh.volume),
            surfaceArea=float(mesh.area),
            boundingBox={
                "min": bounds[0],
                "max": bounds[1],
                "dimensions": dimensions
            },
            triangleCount=len(mesh.faces),
            isWatertight=mesh.is_watertight,
            estimatedPrintTime=estimated_print_time,
            estimatedMaterial=estimated_material,
            estimatedPrice=final_price,
            currency="INR"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing model: {str(e)}")


@router.post("/validate")
@limiter.limit("20/minute")
async def validate_model(request: Request, file: UploadFile = File(...)):
    """
    Validate a 3D model for printability.
    Checks for common issues like non-manifold edges, holes, etc.
    """
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")

    allowed_extensions = [".stl", ".obj", ".ply"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            total_size = 0
            while chunk := await file.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE_BYTES:
                    os.unlink(tmp.name)
                    raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")
                tmp.write(chunk)
            tmp_path = tmp.name

        mesh = trimesh.load(tmp_path)
        os.unlink(tmp_path)

        if isinstance(mesh, trimesh.Scene):
            mesh = trimesh.util.concatenate(mesh.geometry.values())

        issues = []

        if not mesh.is_watertight:
            issues.append("Model is not watertight (has holes)")

        if not mesh.is_winding_consistent:
            issues.append("Inconsistent face winding")

        if len(mesh.faces) < 4:
            issues.append("Too few faces for a valid 3D model")

        # Check for degenerate faces
        degenerate = mesh.area_faces < 1e-8
        if degenerate.any():
            issues.append(f"Contains {degenerate.sum()} degenerate faces")

        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "triangleCount": len(mesh.faces),
            "isWatertight": mesh.is_watertight
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error validating model: {str(e)}")
