from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.models.product import Product
from app.schemas.product import ProductOut
from app.auth import require_admin
from typing import List, Union, Optional
import os
import uuid
import cloudinary
import cloudinary.uploader

# Configuração SEGURA (Lê da Vercel)
cloudinary.config(
    cloud_name = os.getenv("Cloud_name"),
    api_key = os.getenv("API_key"),
    api_secret = os.getenv("API_secret"),
    secure=True
)

router = APIRouter(prefix="/products")

@router.get("/", response_model=List[ProductOut])
def get_products():
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

@router.post("/", response_model=dict)
def create_product(
        name: str = Form(...),
        description: str = Form(""),
        price: float = Form(...),
        stock: int = Form(0),
        gender: str = Form(""),
        category: str = Form(""),
        sizes: str = Form(""),
        available_sizes: str = Form(""),
        colors: str = Form(""),
        available_colors: str = Form(""),
        files: Union[UploadFile, list[UploadFile]] = File(default=[]),
        admin=Depends(require_admin)
):
    image_paths = []

    # Lógica de Upload CORRIGIDA
    if files:
        files_list = files if isinstance(files, list) else [files]
        for file in files_list:
            try:
                # Envia para o Cloudinary
                upload_result = cloudinary.uploader.upload(file.file, folder="mambini_products")
                image_paths.append(upload_result["secure_url"])
            except Exception as e:
                print(f"Erro no upload: {e}")
                raise HTTPException(status_code=500, detail="Upload image failed")

    product = Product(
        name=name,
        description=description,
        price=price,
        stock=stock,
        gender=gender,
        category=category,
        sizes=sizes.split(",") if sizes else [],
        available_sizes=available_sizes.split(",") if available_sizes else [],
        colors=colors.split(",") if colors else [],
        available_colors=available_colors.split(",") if available_colors else [],
        images=image_paths
    )
    product.save()
    return {"message": "Product created", "id": str(product.id)}

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str):
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductOut(
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

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
        product_id: str,
        name: str = Form(...),
        description: str = Form(""),
        price: float = Form(...),
        stock: int = Form(...),
        gender: str = Form(""),
        category: str = Form(""),
        sizes: str = Form(""),
        available_sizes: str = Form(""),
        colors: str = Form(""),
        available_colors: str = Form(""),
        files: Optional[List[UploadFile]] = File(default=None),
        admin=Depends(require_admin)
):
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    p.name = name
    p.description = description
    p.price = price
    p.stock = stock
    p.gender = gender
    p.category = category
    p.sizes = sizes.split(",") if sizes else []
    p.available_sizes = available_sizes.split(",") if available_sizes else []
    p.colors = colors.split(",") if colors else []
    p.available_colors = available_colors.split(",") if available_colors else []

    # Se houver novos ficheiros, fazemos upload para o Cloudinary e substituímos
    # Nota: Em produção idealmente não apagarias as antigas sem validar, mas para simplificar:
    if files:
        new_images = []
        # Upload das novas
        files_list = files if isinstance(files, list) else [files]
        for file in files_list:
            try:
                upload_result = cloudinary.uploader.upload(file.file, folder="mambini_products")
                new_images.append(upload_result["secure_url"])
            except Exception as e:
                print(f"Erro upload update: {e}")
                # Se falhar, mantemos as antigas ou lançamos erro

        # Só substitui se o upload correu bem
        if new_images:
            p.images = new_images

    p.save()

    return ProductOut(
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

@router.delete("/{product_id}")
def delete_product(product_id: str, admin=Depends(require_admin)):
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    # Nota: Não estamos a apagar do Cloudinary aqui para simplificar,
    # mas deverias usar cloudinary.uploader.destroy() futuramente.

    p.delete()
    return {"detail": "Product deleted"}