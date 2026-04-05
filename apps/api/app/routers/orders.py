from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import datetime

from ..core.database import get_db
from ..core.security import get_current_user
from ..core.utils import generate_cuid
from ..core.logger import logger
from ..models.schemas import OrderCreate, OrderResponse, OrderItemResponse, OrderStatus

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=List[OrderResponse])
async def get_orders(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("""
                SELECT id, "userId", status, total, "createdAt"
                FROM "Order"
                WHERE "userId" = :userId
                ORDER BY "createdAt" DESC
            """),
            {"userId": current_user["user_id"]}
        )
        orders = result.fetchall()

        order_responses = []
        for order in orders:
            # Get order items
            items_result = db.execute(
                text("""
                    SELECT id, "productId", quantity, price
                    FROM "OrderItem"
                    WHERE "orderId" = :orderId
                """),
                {"orderId": order.id}
            )
            items = items_result.fetchall()

            order_responses.append(
                OrderResponse(
                    id=str(order.id),
                    userId=str(order.userId),
                    status=order.status,
                    total=float(order.total),
                    items=[
                        OrderItemResponse(
                            id=str(item.id),
                            productId=str(item.productId),
                            quantity=item.quantity,
                            price=float(item.price)
                        )
                        for item in items
                    ],
                    createdAt=order.createdAt
                )
            )

        return order_responses
    except Exception as e:
        logger.error(f"Error fetching orders for user {current_user['user_id']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate total
    total = sum(item.price * item.quantity for item in order_data.items)
    
    order_id = generate_cuid()
    created_at = datetime.now()

    try:
        # Create order
        db.execute(
            text("""
                INSERT INTO "Order" (id, "userId", status, total, "shippingAddressId", "createdAt", "updatedAt")
                VALUES (:id, :userId, :status, :total, :shippingAddressId, :createdAt, :updatedAt)
            """),
            {
                "id": order_id,
                "userId": current_user["user_id"],
                "status": OrderStatus.PENDING,
                "total": total,
                "shippingAddressId": order_data.shippingAddressId,
                "createdAt": created_at,
                "updatedAt": created_at
            }
        )

        # Create order items
        order_items = []
        for item in order_data.items:
            item_id = generate_cuid()
            db.execute(
                text("""
                    INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price)
                    VALUES (:id, :orderId, :productId, :quantity, :price)
                """),
                {
                    "id": item_id,
                    "orderId": order_id,
                    "productId": item.productId,
                    "quantity": item.quantity,
                    "price": item.price
                }
            )
            order_items.append({
                "id": item_id,
                "productId": item.productId,
                "quantity": item.quantity,
                "price": item.price
            })

        db.commit()
        logger.info(f"Order created: {order_id} by user {current_user['user_id']}")

        return OrderResponse(
            id=order_id,
            userId=current_user["user_id"],
            status=OrderStatus.PENDING,
            total=float(total),
            items=[
                OrderItemResponse(
                    id=str(item["id"]),
                    productId=str(item["productId"]),
                    quantity=item["quantity"],
                    price=float(item["price"])
                )
                for item in order_items
            ],
            createdAt=created_at
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create order for user {current_user['user_id']}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create order")


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT id, "userId", status, total, "createdAt"
            FROM "Order"
            WHERE id = :orderId AND "userId" = :userId
        """),
        {"orderId": order_id, "userId": current_user["user_id"]}
    )
    order = result.fetchone()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Get order items
    items_result = db.execute(
        text("""
            SELECT id, "productId", quantity, price
            FROM "OrderItem"
            WHERE "orderId" = :orderId
        """),
        {"orderId": order_id}
    )
    items = items_result.fetchall()

    return OrderResponse(
        id=str(order.id),
        userId=str(order.userId),
        status=order.status,
        total=float(order.total),
        items=[
            OrderItemResponse(
                id=str(item.id),
                productId=str(item.productId),
                quantity=item.quantity,
                price=float(item.price)
            )
            for item in items
        ],
        createdAt=order.createdAt
    )
