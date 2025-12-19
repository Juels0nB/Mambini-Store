from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    email: EmailStr
    name: str
    password: Optional[str] = None
    role: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class UserOut(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    name: str
    role: str
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"