from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# ============================================
# Enums (Must match Prisma)
# ============================================

class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    ADMIN = "ADMIN"


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class PaymentStatus(str, Enum):
    PENDING = "PENDING"
    AUTHORIZED = "AUTHORIZED"
    CAPTURED = "CAPTURED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class QuoteStatus(str, Enum):
    PENDING = "PENDING"
    REVIEWING = "REVIEWING"
    QUOTED = "QUOTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


# ============================================
# User Schemas
# ============================================

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    image: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ============================================
# Address Schemas
# ============================================

class AddressBase(BaseModel):
    firstName: str
    lastName: str
    address: str
    apartment: Optional[str] = None
    city: str
    state: str
    zip: str
    country: str = "India"
    phone: Optional[str] = None
    label: Optional[str] = None
    type: str = "home"
    isDefault: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    label: Optional[str] = None
    type: Optional[str] = None
    isDefault: Optional[bool] = None


class AddressResponse(AddressBase):
    id: str
    userId: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


# ============================================
# Product Schemas
# ============================================

class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    shortDescription: Optional[str] = None
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    sortOrder: int = 0
    isActive: bool = True
    price: Optional[float] = None
    meshFileId: str


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    pageSize: int


# ============================================
# Order Schemas
# ============================================

class OrderItemCreate(BaseModel):
    productId: Optional[str] = None
    name: str
    slug: Optional[str] = None
    material: Optional[str] = None
    quantity: int
    unitPrice: float
    totalPrice: float


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    subtotal: float
    shippingCost: float
    tax: float
    total: float
    shippingMethod: str
    shippingAddress: Dict[str, Any]
    email: EmailStr
    phone: Optional[str] = None
    notes: Optional[str] = None
    paymentMethod: Optional[str] = "razorpay"


class OrderItemResponse(BaseModel):
    id: str
    productId: Optional[str]
    name: str
    slug: Optional[str]
    material: Optional[str]
    quantity: int
    unitPrice: float
    totalPrice: float
    createdAt: datetime

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    orderNumber: str
    userId: Optional[str]
    status: OrderStatus
    subtotal: float
    shippingCost: float
    tax: float
    total: float
    shippingMethod: str
    shippingAddress: Dict[str, Any]
    paymentMethod: Optional[str]
    paymentStatus: PaymentStatus
    razorpayOrderId: Optional[str]
    email: EmailStr
    phone: Optional[str]
    createdAt: datetime
    updatedAt: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


# ============================================
# Quote Schemas
# ============================================

class QuoteFileCreate(BaseModel):
    originalFilename: str
    storedFilename: str
    s3Key: str
    s3Bucket: str
    fileSize: int
    fileType: str


class QuoteCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    service: str
    material: str
    quantity: int
    notes: Optional[str] = None
    files: List[QuoteFileCreate]


class QuoteFileResponse(BaseModel):
    id: str
    originalFilename: str
    fileSize: int
    fileType: str
    uploadedAt: datetime

    class Config:
        from_attributes = True


class QuoteResponse(BaseModel):
    id: str
    quoteNumber: str
    userId: Optional[str]
    status: QuoteStatus
    name: str
    email: EmailStr
    service: str
    material: str
    quantity: int
    createdAt: datetime
    updatedAt: datetime
    quotedPrice: Optional[float] = None
    files: List[QuoteFileResponse]

    class Config:
        from_attributes = True


# ============================================
# Utility Schemas
# ============================================

class FileUploadResponse(BaseModel):
    url: str
    key: str
    filename: str


class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    redis: str


class ModelAnalysis(BaseModel):
    volume: float
    surfaceArea: float
    boundingBox: Dict[str, Any]
    triangleCount: int
    isWatertight: bool
    estimatedPrintTime: Optional[float] = None
    estimatedMaterial: Optional[float] = None
    estimatedPrice: Optional[float] = None
    currency: str = "INR"
