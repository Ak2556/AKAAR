from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import datetime

from ..core.database import get_db
from ..core.security import get_current_user
from ..core.utils import generate_cuid
from ..core.logger import logger
from ..models.schemas import QuoteCreate, QuoteResponse, QuoteStatus

router = APIRouter(prefix="/quotes", tags=["Quotes"])


@router.get("", response_model=List[QuoteResponse])
async def get_quotes(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("""
                SELECT id, "userId", status, notes, "createdAt"
                FROM "Quote"
                WHERE "userId" = :userId
                ORDER BY "createdAt" DESC
            """),
            {"userId": current_user["user_id"]}
        )
        quotes = result.fetchall()

        return [
            QuoteResponse(
                id=str(q.id),
                userId=str(q.userId),
                status=q.status,
                notes=q.notes,
                createdAt=q.createdAt
            )
            for q in quotes
        ]
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
    created_at = datetime.now()

    try:
        # Create quote
        db.execute(
            text("""
                INSERT INTO "Quote" (id, "userId", status, notes, "createdAt", "updatedAt")
                VALUES (:id, :userId, :status, :notes, :createdAt, :updatedAt)
            """),
            {
                "id": quote_id,
                "userId": current_user["user_id"],
                "status": QuoteStatus.PENDING,
                "notes": quote_data.notes,
                "createdAt": created_at,
                "updatedAt": created_at
            }
        )

        # Create quote items
        for item in quote_data.items:
            db.execute(
                text("""
                    INSERT INTO "QuoteItem" (id, "quoteId", description, quantity, "fileUrl")
                    VALUES (:id, :quoteId, :description, :quantity, :fileUrl)
                """),
                {
                    "id": generate_cuid(),
                    "quoteId": quote_id,
                    "description": item.description,
                    "quantity": item.quantity,
                    "fileUrl": item.fileUrl
                }
            )

        db.commit()
        logger.info(f"Quote created: {quote_id} by user {current_user['user_id']}")

        return QuoteResponse(
            id=quote_id,
            userId=current_user["user_id"],
            status=QuoteStatus.PENDING,
            notes=quote_data.notes,
            createdAt=created_at
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
            SELECT id, "userId", status, notes, "createdAt"
            FROM "Quote"
            WHERE id = :quoteId AND "userId" = :userId
        """),
        {"quoteId": quote_id, "userId": current_user["user_id"]}
    )
    quote = result.fetchone()

    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    return QuoteResponse(
        id=str(quote.id),
        userId=str(quote.userId),
        status=quote.status,
        notes=quote.notes,
        createdAt=quote.createdAt
    )
