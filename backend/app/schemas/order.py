from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: str
    product_name: str
    price: float
    quantity: int
    size: Optional[str] = None
    color: Optional[str] = None
    image: Optional[str] = None

class OrderItemOut(OrderItemBase):
    pass

class ShippingInfo(BaseModel):
    address: str
    city: str
    postal_code: str
    country: str
    phone: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItemBase]
    shipping: ShippingInfo
    notes: Optional[str] = None
    payment_intent_id: Optional[str] = None  # ID do PaymentIntent do Stripe

class OrderOut(BaseModel):
    id: str
    user_id: str
    user_email: EmailStr
    user_name: Optional[str] = None
    items: List[OrderItemOut]
    total_amount: float
    status: str
    shipping_address: Optional[str] = None
    shipping_city: Optional[str] = None
    shipping_postal_code: Optional[str] = None
    shipping_country: Optional[str] = None
    shipping_phone: Optional[str] = None
    created_at: str
    updated_at: str
    notes: Optional[str] = None
    payment_intent_id: Optional[str] = None
    payment_status: Optional[str] = None

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

