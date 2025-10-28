from fastapi import APIRouter, Depends, HTTPException
from app.models.product import Product
from app.schemas.product import ProductBase, ProductOut
from app.auth import get_current_user, require_admin
from typing import List

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

@router.post("/", response_model=ProductOut)
def create_product(product: ProductBase, admin=Depends(require_admin)):
    p = Product(**product.dict())
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

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: str, product: ProductBase, admin=Depends(require_admin)):
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.update(**product.dict())
    p.reload()
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
    p.delete()
    return {"detail": "Product deleted"}