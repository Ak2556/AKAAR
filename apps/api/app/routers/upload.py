from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..core.security import get_current_user
from ..core.config import settings
from ..models.schemas import FileUploadResponse
import boto3
from botocore.exceptions import ClientError
import uuid
import os

router = APIRouter(prefix="/upload", tags=["File Upload"])


def get_s3_client():
    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
        return None

    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION
    )


@router.post("/model", response_model=FileUploadResponse)
async def upload_model(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a 3D model file to S3"""
    allowed_extensions = [".stl", ".obj", ".ply", ".gltf", ".glb", ".step", ".stp", ".iges", ".igs"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )

    # Generate unique key
    file_id = str(uuid.uuid4())
    key = f"models/{current_user['user_id']}/{file_id}{file_ext}"

    s3 = get_s3_client()
    if not s3:
        # Return mock response if S3 not configured
        return FileUploadResponse(
            url=f"https://example.com/{key}",
            key=key,
            filename=file.filename
        )

    try:
        content = await file.read()
        s3.put_object(
            Bucket=settings.AWS_S3_BUCKET,
            Key=key,
            Body=content,
            ContentType=file.content_type
        )

        url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

        return FileUploadResponse(
            url=url,
            key=key,
            filename=file.filename
        )
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/image", response_model=FileUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload an image file to S3"""
    allowed_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )

    # Generate unique key
    file_id = str(uuid.uuid4())
    key = f"images/{current_user['user_id']}/{file_id}{file_ext}"

    s3 = get_s3_client()
    if not s3:
        return FileUploadResponse(
            url=f"https://example.com/{key}",
            key=key,
            filename=file.filename
        )

    try:
        content = await file.read()
        s3.put_object(
            Bucket=settings.AWS_S3_BUCKET,
            Key=key,
            Body=content,
            ContentType=file.content_type
        )

        url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

        return FileUploadResponse(
            url=url,
            key=key,
            filename=file.filename
        )
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.delete("/{key:path}")
async def delete_file(
    key: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a file from S3"""
    # Verify user owns the file
    if f"/{current_user['user_id']}/" not in key:
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")

    s3 = get_s3_client()
    if not s3:
        return {"message": "File deleted (mock)"}

    try:
        s3.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
        return {"message": "File deleted successfully"}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")
