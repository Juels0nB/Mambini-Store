from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Body
from pydantic import BaseModel
from app.models.product import Product
from app.schemas.product import ProductOut
from app.auth import require_admin
from typing import List, Union, Optional
import os
import cloudinary
import cloudinary.uploader

# Configuração SEGURA (Lê da Vercel)
cloudinary.config(
    cloud_name = os.getenv("Cloud_name"),
    api_key = os.getenv("API_key"),
    api_secret = os.getenv("API_secret"),
    secure=True
)

# ✅ REMOVIDO O OS.MAKEDIRS QUE DAVA ERRO

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
            visible_images=p.visible_images if hasattr(p, 'visible_images') else (p.images if p.images else []),
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
    # Validar stock não negativo
    if stock < 0:
        raise HTTPException(status_code=400, detail="Stock não pode ser negativo")
    
    # Validar preço não negativo
    if price < 0:
        raise HTTPException(status_code=400, detail="Preço não pode ser negativo")
    
    image_paths = []

    # Lógica de Upload Cloudinary
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
        images=image_paths,
        visible_images=image_paths  # Por padrão, todas as imagens são visíveis
    )
    product.save()
    return {"message": "Product created", "id": str(product.id)}

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str):
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    # Inicializar visible_images se não existir (para produtos antigos)
    if not hasattr(p, 'visible_images') or not p.visible_images:
        if p.images:
            p.visible_images = p.images
            p.save()
        else:
            p.visible_images = []

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
        visible_images=p.visible_images if p.visible_images else [],
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
    # Validar stock não negativo
    if stock < 0:
        raise HTTPException(status_code=400, detail="Stock não pode ser negativo")
    
    # Validar preço não negativo
    if price < 0:
        raise HTTPException(status_code=400, detail="Preço não pode ser negativo")
    
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

    if files:
        new_images = []
        files_list = files if isinstance(files, list) else [files]
        for file in files_list:
            try:
                upload_result = cloudinary.uploader.upload(file.file, folder="mambini_products")
                new_images.append(upload_result["secure_url"])
            except Exception as e:
                print(f"Erro upload update: {e}")

        if new_images:
            # Adiciona novas imagens às existentes (não substitui)
            existing_images = p.images if p.images else []
            p.images = existing_images + new_images
            # Adiciona novas imagens às visíveis por padrão
            existing_visible = p.visible_images if hasattr(p, 'visible_images') and p.visible_images else existing_images
            p.visible_images = existing_visible + new_images

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
        visible_images=p.visible_images if hasattr(p, 'visible_images') and p.visible_images else (p.images if p.images else []),
        created_at=str(p.created_at)
    )

@router.delete("/{product_id}/images/{image_url:path}")
def delete_product_image(product_id: str, image_url: str, admin=Depends(require_admin)):
    """Remove uma imagem específica do produto"""
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Decodificar URL (pode vir codificada)
    import urllib.parse
    image_url = urllib.parse.unquote(image_url)
    
    # Remove da lista de imagens
    if p.images and image_url in p.images:
        p.images = [img for img in p.images if img != image_url]
    
    # Remove da lista de imagens visíveis
    if hasattr(p, 'visible_images') and p.visible_images and image_url in p.visible_images:
        p.visible_images = [img for img in p.visible_images if img != image_url]
    
    # Tentar deletar do Cloudinary
    try:
        # Extrair public_id da URL do Cloudinary
        if 'cloudinary.com' in image_url:
            # Formato: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
            parts = image_url.split('/')
            folder_index = -1
            for i, part in enumerate(parts):
                if part == 'upload':
                    folder_index = i + 2
                    break
            if folder_index > 0 and folder_index < len(parts):
                public_id = '/'.join(parts[folder_index:]).split('.')[0]  # Remove extensão
                cloudinary.uploader.destroy(public_id)
    except Exception as e:
        print(f"Erro ao deletar imagem do Cloudinary: {e}")
        # Continua mesmo se falhar no Cloudinary
    
    p.save()
    return {"detail": "Image deleted", "images": p.images, "visible_images": p.visible_images if hasattr(p, 'visible_images') else p.images}

class VisibleImagesUpdate(BaseModel):
    visible_images: List[str]

@router.put("/{product_id}/visible-images")
def update_visible_images(
    product_id: str,
    data: VisibleImagesUpdate = Body(...),
    admin=Depends(require_admin)
):
    """Atualiza quais imagens são visíveis na loja"""
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    
    visible_images = data.visible_images or []  # Permite lista vazia
    
    # Validar que todas as imagens visíveis existem na lista de imagens
    if p.images and visible_images:
        for img in visible_images:
            if img not in p.images:
                raise HTTPException(status_code=400, detail=f"Imagem {img} não existe no produto")
    
    # Atualizar visible_images (pode ser lista vazia)
    p.visible_images = visible_images
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
        visible_images=p.visible_images if hasattr(p, 'visible_images') and p.visible_images else (p.images if p.images else []),
        created_at=str(p.created_at)
    )

@router.delete("/{product_id}")
def delete_product(product_id: str, admin=Depends(require_admin)):
    p = Product.objects(id=product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    p.delete()
    return {"detail": "Product deleted"}