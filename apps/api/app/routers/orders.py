from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from datetime import datetime, timezone
import json
import uuid

from ..core.database import get_db
from ..core.security import get_current_user
from ..core.utils import generate_cuid
from ..core.logger import logger
from ..models.schemas import OrderCreate, OrderResponse, OrderItemResponse, OrderStatus, PaymentStatus

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=List[OrderResponse])
async def get_orders(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = db.execute(
            text("""
                SELECT id, "orderNumber", "userId", status, subtotal, "shippingCost", 
                       tax, total, "shippingMethod", "shippingAddress", "paymentMethod", 
                       "paymentStatus", "razorpayOrderId", email, phone, "createdAt", "updatedAt"
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
                    SELECT id, "productId", name, slug, material, quantity, "unitPrice", "totalPrice", "createdAt"
                    FROM "OrderItem"
                    WHERE "orderId" = :orderId
                """),
                {"orderId": order.id}
            )
            items = items_result.fetchall()

            # Handle JSON parsing for shippingAddress if it's a string
            shipping_address = order.shippingAddress
            if isinstance(shipping_address, str):
                shipping_address = json.loads(shipping_address)

            order_responses.append(
                OrderResponse(
                    id=str(order.id),
                    orderNumber=order.orderNumber,
                    userId=str(order.userId),
                    status=order.status,
                    subtotal=float(order.subtotal),
                    shippingCost=float(order.shippingCost),
                    tax=float(order.tax),
                    total=float(order.total),
                    shippingMethod=order.shippingMethod,
                    shippingAddress=shipping_address,
                    paymentMethod=order.paymentMethod,
                    paymentStatus=order.paymentStatus,
                    razorpayOrderId=order.razorpayOrderId,
                    email=order.email,
                    phone=order.phone,
                    createdAt=order.createdAt,
                    updatedAt=order.updatedAt,
                    items=[
                        OrderItemResponse(
                            id=str(item.id),
                            productId=str(item.productId) if item.productId else None,
                            name=item.name,
                            slug=item.slug,
                            material=item.material,
                            quantity=item.quantity,
                            unitPrice=float(item.unitPrice),
                            totalPrice=float(item.totalPrice),
                            createdAt=item.createdAt
                        )
                        for item in items
                    ]
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
    order_id = generate_cuid()
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    now = datetime.now(timezone.utc)

    try:
        # Create order
        db.execute(
            text("""
                INSERT INTO "Order" (
                    id, "orderNumber", "userId", status, subtotal, "shippingCost", 
                    tax, total, "shippingMethod", "shippingAddress", "paymentMethod", 
                    "paymentStatus", email, phone, "createdAt", "updatedAt"
                ) VALUES (
                    :id, :orderNumber, :userId, :status, :subtotal, :shippingCost, 
                    :tax, :total, :shippingMethod, :shippingAddress, :paymentMethod, 
                    :paymentStatus, :email, :phone, :now, :now
                )
            """),
            {
                "id": order_id,
                "orderNumber": order_number,
                "userId": current_user["user_id"],
                "status": OrderStatus.PENDING,
                "subtotal": order_data.subtotal,
                "shippingCost": order_data.shippingCost,
                "tax": order_data.tax,
                "total": order_data.total,
                "shippingMethod": order_data.shippingMethod,
                "shippingAddress": json.dumps(order_data.shippingAddress),
                "paymentMethod": order_data.paymentMethod,
                "paymentStatus": PaymentStatus.PENDING,
                "email": order_data.email,
                "phone": order_data.phone,
                "now": now
            }
        )

        # Create order items
        created_items = []
        for item in order_data.items:
            item_id = generate_cuid()
            db.execute(
                text("""
                    INSERT INTO "OrderItem" (
                        id, "orderId", "productId", name, slug, material, 
                        quantity, "unitPrice", "totalPrice", "createdAt"
                    ) VALUES (
                        :id, :orderId, :productId, :name, :slug, :material, 
                        :quantity, :unitPrice, :totalPrice, :now
                    )
                """),
                {
                    "id": item_id,
                    "orderId": order_id,
                    "productId": item.productId,
                    "name": item.name,
                    "slug": item.slug,
                    "material": item.material,
                    "quantity": item.quantity,
                    "unitPrice": item.unitPrice,
                    "totalPrice": item.totalPrice,
                    "now": now
                }
            )
            created_items.append(
                OrderItemResponse(
                    id=item_id,
                    productId=item.productId,
                    name=item.name,
                    slug=item.slug,
                    material=item.material,
                    quantity=item.quantity,
                    unitPrice=item.unitPrice,
                    totalPrice=item.totalPrice,
                    createdAt=now
                )
            )

        db.commit()
        logger.info(f"Order {order_number} created for user {current_user['user_id']}")

        return OrderResponse(
            id=order_id,
            orderNumber=order_number,
            userId=current_user["user_id"],
            status=OrderStatus.PENDING,
            subtotal=order_data.subtotal,
            shippingCost=order_data.shippingCost,
            tax=order_data.tax,
            total=order_data.total,
            shippingMethod=order_data.shippingMethod,
            shippingAddress=order_data.shippingAddress,
            paymentMethod=order_data.paymentMethod,
            paymentStatus=PaymentStatus.PENDING,
            email=order_data.email,
            phone=order_data.phone,
            createdAt=now,
            updatedAt=now,
            items=created_items
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
    try:
        result = db.execute(
            text("""
                SELECT id, "orderNumber", "userId", status, subtotal, "shippingCost", 
                       tax, total, "shippingMethod", "shippingAddress", "paymentMethod", 
                       "paymentStatus", "razorpayOrderId", email, phone, "createdAt", "updatedAt"
                FROM "Order"
                WHERE id = :id AND "userId" = :userId
            """),
            {"id": order_id, "userId": current_user["user_id"]}
        ).fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Order not found or unauthorized")

        items_result = db.execute(
            text("""
                SELECT id, "productId", name, slug, material, quantity, "unitPrice", "totalPrice", "createdAt"
                FROM "OrderItem"
                WHERE "orderId" = :orderId
            """),
            {"orderId": order_id}
        ).fetchall()

        shipping_address = result.shippingAddress
        if isinstance(shipping_address, str):
            shipping_address = json.loads(shipping_address)

        return OrderResponse(
            id=str(result.id),
            orderNumber=result.orderNumber,
            userId=str(result.userId),
            status=result.status,
            subtotal=float(result.subtotal),
            shippingCost=float(result.shippingCost),
            tax=float(result.tax),
            total=float(result.total),
            shippingMethod=result.shippingMethod,
            shippingAddress=shipping_address,
            paymentMethod=result.paymentMethod,
            paymentStatus=result.paymentStatus,
            razorpayOrderId=result.razorpayOrderId,
            email=result.email,
            phone=result.phone,
            createdAt=result.createdAt,
            updatedAt=result.updatedAt,
            items=[
                OrderItemResponse(
                    id=str(item.id),
                    productId=str(item.productId) if item.productId else None,
                    name=item.name,
                    slug=item.slug,
                    material=item.material,
                    quantity=item.quantity,
                    unitPrice=float(item.unitPrice),
                    totalPrice=float(item.totalPrice),
                    createdAt=item.createdAt
                )
                for item in items_result
            ]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")
