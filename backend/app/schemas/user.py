from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: Optional[str] = None

class UserOut(BaseModel):
    email: EmailStr
    name: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"