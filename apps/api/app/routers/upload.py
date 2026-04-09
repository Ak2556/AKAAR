from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from ..core.security import get_current_user
from ..core.config import settings
from ..core.logger import logger
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

    file_id = str(uuid.uuid4())
    key = f"models/{current_user['user_id']}/{file_id}{file_ext}"

    s3 = get_s3_client()
    if not s3:
        return FileUploadResponse(
            url=f"https://example.com/{key}",
            key=key,
            filename=file.filename
        )

    try:
        s3.upload_fileobj(
            file.file,
            settings.AWS_S3_BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type or "application/octet-stream"}
        )
        url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
        return FileUploadResponse(url=url, key=key, filename=file.filename)
    except ClientError as e:
        logger.error(f"S3 upload failed for model (user={current_user['user_id']}): {str(e)}")
        raise HTTPException(status_code=500, detail="Upload failed. Please try again.")


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
        s3.upload_fileobj(
            file.file,
            settings.AWS_S3_BUCKET,
            key,
            ExtraArgs={"ContentType": file.content_type or "image/jpeg"}
        )
        url = f"https://{settings.AWS_S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
        return FileUploadResponse(url=url, key=key, filename=file.filename)
    except ClientError as e:
        logger.error(f"S3 upload failed for image (user={current_user['user_id']}): {str(e)}")
        raise HTTPException(status_code=500, detail="Upload failed. Please try again.")


@router.delete("/{key:path}")
async def delete_file(
    key: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a file from S3"""
    if f"/{current_user['user_id']}/" not in key:
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")

    s3 = get_s3_client()
    if not s3:
        return {"message": "File deleted (mock)"}

    try:
        s3.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
        return {"message": "File deleted successfully"}
    except ClientError as e:
        logger.error(f"S3 delete failed for key={key}: {str(e)}")
        raise HTTPException(status_code=500, detail="Delete failed. Please try again.")
