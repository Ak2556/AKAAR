from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import datetime, timezone

from ..core.database import get_db
from ..core.security import get_current_user
from ..core.utils import generate_cuid
from ..core.logger import logger
from ..models.schemas import QuoteCreate, QuoteResponse, QuoteFileResponse, QuoteStatus

router = APIRouter(prefix="/quotes", tags=["Quotes"])


def _generate_quote_number() -> str:
    """Generate a sequential-style quote number using timestamp."""
    import time
    return f"QT-{int(time.time() * 1000) % 10_000_000:07d}"


@router.get("", response_model=List[QuoteResponse])
async def get_quotes(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("""
                SELECT q.id, q."quoteNumber", q."userId", q.status, q.name, q.email,
                       q.company, q.phone, q.service, q.material, q.quantity,
                       q.notes, q."quotedPrice", q."createdAt", q."updatedAt"
                FROM "Quote" q
                WHERE q."userId" = :userId
                ORDER BY q."createdAt" DESC
            """),
            {"userId": current_user["user_id"]}
        )
        quotes = result.fetchall()

        response = []
        for q in quotes:
            files_result = db.execute(
                text("""
                    SELECT id, "originalFilename", "fileSize", "fileType", "uploadedAt"
                    FROM "QuoteFile"
                    WHERE "quoteId" = :quoteId
                """),
                {"quoteId": q.id}
            )
            files = [
                QuoteFileResponse(
                    id=str(f.id),
                    originalFilename=f.originalFilename,
                    fileSize=f.fileSize,
                    fileType=f.fileType,
                    uploadedAt=f.uploadedAt
                )
                for f in files_result.fetchall()
            ]
            response.append(
                QuoteResponse(
                    id=str(q.id),
                    quoteNumber=q.quoteNumber,
                    userId=str(q.userId) if q.userId else None,
                    status=q.status,
                    name=q.name,
                    email=q.email,
                    service=q.service,
                    material=q.material,
                    quantity=q.quantity,
                    createdAt=q.createdAt,
                    updatedAt=q.updatedAt,
                    quotedPrice=q.quotedPrice,
                    files=files,
                )
            )
        return response
    except Exception as e:
        logger.error(f"Error fetching quotes for user {current_user['user_id']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch quotes")


@router.post("", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def create_quote(
    quote_data: QuoteCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quote_id = generate_cuid()
    quote_number = _generate_quote_number()
    now = datetime.now(timezone.utc)

    try:
        db.execute(
            text("""
                INSERT INTO "Quote" (
                    id, "quoteNumber", "userId", status, name, email,
                    company, phone, service, material, quantity,
                    notes, "createdAt", "updatedAt"
                ) VALUES (
                    :id, :quoteNumber, :userId, :status, :name, :email,
                    :company, :phone, :service, :material, :quantity,
                    :notes, :now, :now
                )
            """),
            {
                "id": quote_id,
                "quoteNumber": quote_number,
                "userId": current_user["user_id"],
                "status": QuoteStatus.PENDING,
                "name": quote_data.name,
                "email": str(quote_data.email),
                "company": quote_data.company,
                "phone": quote_data.phone,
                "service": quote_data.service,
                "material": quote_data.material,
                "quantity": quote_data.quantity,
                "notes": quote_data.notes,
                "now": now,
            }
        )

        file_responses = []
        for f in quote_data.files:
            file_id = generate_cuid()
            db.execute(
                text("""
                    INSERT INTO "QuoteFile" (
                        id, "quoteId", "originalFilename", "storedFilename",
                        "s3Key", "s3Bucket", "fileSize", "fileType", "uploadedAt"
                    ) VALUES (
                        :id, :quoteId, :originalFilename, :storedFilename,
                        :s3Key, :s3Bucket, :fileSize, :fileType, :uploadedAt
                    )
                """),
                {
                    "id": file_id,
                    "quoteId": quote_id,
                    "originalFilename": f.originalFilename,
                    "storedFilename": f.storedFilename,
                    "s3Key": f.s3Key,
                    "s3Bucket": f.s3Bucket,
                    "fileSize": f.fileSize,
                    "fileType": f.fileType,
                    "uploadedAt": now,
                }
            )
            file_responses.append(
                QuoteFileResponse(
                    id=file_id,
                    originalFilename=f.originalFilename,
                    fileSize=f.fileSize,
                    fileType=f.fileType,
                    uploadedAt=now,
                )
            )

        db.commit()
        logger.info(f"Quote created: {quote_id} ({quote_number}) by user {current_user['user_id']}")

        return QuoteResponse(
            id=quote_id,
            quoteNumber=quote_number,
            userId=current_user["user_id"],
            status=QuoteStatus.PENDING,
            name=quote_data.name,
            email=str(quote_data.email),
            service=quote_data.service,
            material=quote_data.material,
            quantity=quote_data.quantity,
            createdAt=now,
            updatedAt=now,
            quotedPrice=None,
            files=file_responses,
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create quote for user {current_user['user_id']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create quote")


@router.get("/{quote_id}", response_model=QuoteResponse)
async def get_quote(
    quote_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT id, "quoteNumber", "userId", status, name, email,
                   service, material, quantity, notes, "quotedPrice",
                   "createdAt", "updatedAt"
            FROM "Quote"
            WHERE id = :quoteId AND "userId" = :userId
        """),
        {"quoteId": quote_id, "userId": current_user["user_id"]}
    )
    quote = result.fetchone()

    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    files_result = db.execute(
        text("""
            SELECT id, "originalFilename", "fileSize", "fileType", "uploadedAt"
            FROM "QuoteFile"
            WHERE "quoteId" = :quoteId
        """),
        {"quoteId": quote_id}
    )
    files = [
        QuoteFileResponse(
            id=str(f.id),
            originalFilename=f.originalFilename,
            fileSize=f.fileSize,
            fileType=f.fileType,
            uploadedAt=f.uploadedAt
        )
        for f in files_result.fetchall()
    ]

    return QuoteResponse(
        id=str(quote.id),
        quoteNumber=quote.quoteNumber,
        userId=str(quote.userId) if quote.userId else None,
        status=quote.status,
        name=quote.name,
        email=str(quote.email),
        service=quote.service,
        material=quote.material,
        quantity=quote.quantity,
        createdAt=quote.createdAt,
        updatedAt=quote.updatedAt,
        quotedPrice=quote.quotedPrice,
        files=files,
    )
