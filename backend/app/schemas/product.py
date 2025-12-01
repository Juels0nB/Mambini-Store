from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.models.product import Product
from app.schemas.product import ProductOut
from app.auth import require_admin
from typing import List, Union, Optional
import os
import cloudinary
import cloudinary.uploader

# Configuração Cloudinary
cloudinary.config(
    cloud_name = os.getenv("Cloud_name"),
    api_key = os.getenv("API_key"),
    api_secret = os.getenv("API_secret"),
    secure=True
)

# REMOVIDO: O bloco que criava pasta 'uploads' localmente.
# Na Vercel não se pode escrever no disco.

router = APIRouter(prefix="/products")

@router.get("/", response_model=List[ProductOut])
def get_products():
    # O teu código de get_products estava correto
    return [
        ProductOut(
            id=str(p.id),
            name=p.name,
            description=p.description,
            price=p.price,
            stock=p.stock,
            sizes=p.sizes,
            available_sizes=p.available_sizes,
            gender=p.gender,
            category=p.category,
            colors=p.colors,
            available_colors=p.available_colors,
            images=p.images,
            created_at=str(p.created_at)
        )
        for p in Product.objects()
    ]

# ... (Mantém o create_product, get_product, update e delete como estavam no teu último código CORRIGIDO,
