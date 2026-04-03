from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.schemas import OrderCreate, OrderResponse, OrderItemResponse, OrderStatus

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=List[OrderResponse])
async def get_orders(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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


@router.post("", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate total
    total = sum(item.price * item.quantity for item in order_data.items)

    # Create order
    result = db.execute(
        text("""
            INSERT INTO "Order" (id, "userId", status, total, "shippingAddressId", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), :userId, :status, :total, :shippingAddressId, NOW(), NOW())
            RETURNING id, "userId", status, total, "createdAt"
        """),
        {
            "userId": current_user["user_id"],
            "status": OrderStatus.PENDING,
            "total": total,
            "shippingAddressId": order_data.shippingAddressId
        }
    )
    order = result.fetchone()

    # Create order items
    items = []
    for item in order_data.items:
        item_result = db.execute(
            text("""
                INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price)
                VALUES (gen_random_uuid(), :orderId, :productId, :quantity, :price)
                RETURNING id, "productId", quantity, price
            """),
            {
                "orderId": order.id,
                "productId": item.productId,
                "quantity": item.quantity,
                "price": item.price
            }
        )
        items.append(item_result.fetchone())

    db.commit()

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
