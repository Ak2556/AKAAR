from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class OrderStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class QuoteStatus(str, Enum):
    PENDING = "PENDING"
    REVIEWED = "REVIEWED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Product Schemas
class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    images: List[str] = []
    modelUrl: Optional[str] = None
    inStock: bool = True


class ProductCreate(ProductBase):
    categoryId: str


class ProductResponse(ProductBase):
    id: str
    categoryId: str
    createdAt: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    pageSize: int


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: str

    class Config:
        from_attributes = True


# Order Schemas
class OrderItemCreate(BaseModel):
    productId: str
    quantity: int
    price: float


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shippingAddressId: str
    paymentMethod: str = "razorpay"


class OrderItemResponse(BaseModel):
    id: str
    productId: str
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    userId: str
    status: OrderStatus
    total: float
    items: List[OrderItemResponse]
    createdAt: datetime

    class Config:
        from_attributes = True


# Quote Schemas
class QuoteItemCreate(BaseModel):
    description: str
    quantity: int
    fileUrl: Optional[str] = None


class QuoteCreate(BaseModel):
    items: List[QuoteItemCreate]
    notes: Optional[str] = None


class QuoteResponse(BaseModel):
    id: str
    userId: str
    status: QuoteStatus
    notes: Optional[str]
    createdAt: datetime

    class Config:
        from_attributes = True


# Address Schemas
class AddressBase(BaseModel):
    name: str
    phone: str
    street: str
    city: str
    state: str
    postalCode: str
    country: str = "India"
    isDefault: bool = False


class AddressCreate(AddressBase):
    pass


class AddressResponse(AddressBase):
    id: str
    userId: str

    class Config:
        from_attributes = True


# File Upload
class FileUploadResponse(BaseModel):
    url: str
    key: str
    filename: str


# Health Check
class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    redis: str


# 3D Model Analysis
class ModelAnalysis(BaseModel):
    volume: float
    surfaceArea: float
    boundingBox: dict
    triangleCount: int
    isWatertight: bool
    estimatedPrintTime: Optional[float] = None
    estimatedMaterial: Optional[float] = None
