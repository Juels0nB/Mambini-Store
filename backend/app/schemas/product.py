from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    sizes: Optional[List[str]] = []
    available_sizes: Optional[List[str]] = []
    gender: Optional[str] = None
    category: Optional[str] = None
    colors: Optional[List[str]] = []
    available_colors: Optional[List[str]] = []
    images: Optional[List[str]] = []
    visible_images: Optional[List[str]] = []

class ProductOut(ProductBase):
    id: str
    created_at: str