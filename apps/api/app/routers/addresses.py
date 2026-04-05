from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import datetime

from ..core.database import get_db
from ..core.security import get_current_user
from ..core.utils import generate_cuid
from ..core.logger import logger
from ..models.schemas import AddressCreate, AddressUpdate, AddressResponse

router = APIRouter(prefix="/addresses", tags=["User Addresses"])


@router.get("", response_model=List[AddressResponse])
async def get_addresses(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("""
                SELECT id, "userId", "firstName", "lastName", address, apartment, 
                       city, state, zip, country, phone, label, type, "isDefault", 
                       "createdAt", "updatedAt"
                FROM "Address"
                WHERE "userId" = :userId
                ORDER BY "isDefault" DESC, "createdAt" DESC
            """),
            {"userId": current_user["user_id"]}
        )
        return result.fetchall()
    except Exception as e:
        logger.error(f"Error fetching addresses for user {current_user['user_id']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch addresses")


@router.post("", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_address(
    address_data: AddressCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    address_id = generate_cuid()
    now = datetime.now()

    try:
        # If this is set as default, unset others
        if address_data.isDefault:
            db.execute(
                text("UPDATE \"Address\" SET \"isDefault\" = false WHERE \"userId\" = :userId"),
                {"userId": current_user["user_id"]}
            )

        db.execute(
            text("""
                INSERT INTO "Address" (
                    id, "userId", "firstName", "lastName", address, apartment, 
                    city, state, zip, country, phone, label, type, "isDefault", 
                    "createdAt", "updatedAt"
                ) VALUES (
                    :id, :userId, :firstName, :lastName, :address, :apartment, 
                    :city, :state, :zip, :country, :phone, :label, :type, :isDefault, 
                    :now, :now
                )
            """),
            {
                "id": address_id,
                "userId": current_user["user_id"],
                **address_data.model_dump(),
                "now": now
            }
        )
        db.commit()
        
        # Fetch the created address
        result = db.execute(
            text("SELECT * FROM \"Address\" WHERE id = :id"),
            {"id": address_id}
        )
        return result.fetchone()

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create address for user {current_user['user_id']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create address")


@router.patch("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: str,
    address_data: AddressUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Verify ownership
        check = db.execute(
            text("SELECT id FROM \"Address\" WHERE id = :id AND \"userId\" = :userId"),
            {"id": address_id, "userId": current_user["user_id"]}
        ).fetchone()
        
        if not check:
            raise HTTPException(status_code=404, detail="Address not found or unauthorized")

        # If setting as default, unset others
        if address_data.isDefault:
            db.execute(
                text("UPDATE \"Address\" SET \"isDefault\" = false WHERE \"userId\" = :userId"),
                {"userId": current_user["user_id"]}
            )

        # Build dynamic update query
        update_fields = address_data.model_dump(exclude_unset=True)
        update_fields["updatedAt"] = datetime.now()
        
        set_clause = ", ".join([f"\"{k}\" = :{k}" for k in update_fields.keys()])
        
        db.execute(
            text(f"UPDATE \"Address\" SET {set_clause} WHERE id = :id"),
            {**update_fields, "id": address_id}
        )
        db.commit()

        result = db.execute(
            text("SELECT * FROM \"Address\" WHERE id = :id"),
            {"id": address_id}
        )
        return result.fetchone()

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update address {address_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update address")


@router.delete("/{address_id}")
async def delete_address(
    address_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("DELETE FROM \"Address\" WHERE id = :id AND \"userId\" = :userId"),
            {"id": address_id, "userId": current_user["user_id"]}
        )
        db.commit()

        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Address not found or unauthorized")

        return {"message": "Address deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete address {address_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete address")
