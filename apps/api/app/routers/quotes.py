from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.schemas import QuoteCreate, QuoteResponse, QuoteStatus

router = APIRouter(prefix="/quotes", tags=["Quotes"])


@router.get("", response_model=List[QuoteResponse])
async def get_quotes(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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


@router.post("", response_model=QuoteResponse)
async def create_quote(
    quote_data: QuoteCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create quote
    result = db.execute(
        text("""
            INSERT INTO "Quote" (id, "userId", status, notes, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), :userId, :status, :notes, NOW(), NOW())
            RETURNING id, "userId", status, notes, "createdAt"
        """),
        {
            "userId": current_user["user_id"],
            "status": QuoteStatus.PENDING,
            "notes": quote_data.notes
        }
    )
    quote = result.fetchone()

    # Create quote items
    for item in quote_data.items:
        db.execute(
            text("""
                INSERT INTO "QuoteItem" (id, "quoteId", description, quantity, "fileUrl")
                VALUES (gen_random_uuid(), :quoteId, :description, :quantity, :fileUrl)
            """),
            {
                "quoteId": quote.id,
                "description": item.description,
                "quantity": item.quantity,
                "fileUrl": item.fileUrl
            }
        )

    db.commit()

    return QuoteResponse(
        id=str(quote.id),
        userId=str(quote.userId),
        status=quote.status,
        notes=quote.notes,
        createdAt=quote.createdAt
    )


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
