from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.models.product import Product
from app.schemas.product import ProductBase, ProductOut
from app.auth import get_current_user, require_admin
from typing import List, Union, Optional
import os
import uuid
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

# Configuration
cloudinary.config(
    cloud_name = "ddyni5b9q",
    api_key = "351722938126552",
    api_secret = "4iuJbv4oiZyd0RYGgTFIAa9js9Y", # Click 'View API Keys' above to copy your API secret
    secure=True
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

    if files:
        files_list = files if isinstance(files, list) else [files]
        for file in files_list:
            try:
                # Envia direto para a nuvem
                upload_result = cloudinary.uploader.upload(file.file, folder="mambini_products")
                # Guarda o link HTTPs seguro
                image_paths.append(upload_result["secure_url"])
            except Exception as e:
                print(f"Erro no upload: {e}")
                raise HTTPException(status_code=500, detail="Upload image failed")


            # with open(file_path, "wb") as f:
            #     f.write(file.file.read())
            # image_paths.append(f"/uploads/{unique_name}")
        #  CÓDIGO NOVO (Cloudinary)
        # O Cloudinary aceita o ficheiro diretamente do FastAPI
        result = cloudinary.uploader.upload(file.file, folder="mambini_products")

        # O Cloudinary devolve um URL completo (ex: https://res.cloudinary.com/...)
        image_paths.append(result["secure_url"])


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
    """Retorna um único produto pelo ID"""
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

    if files:
        for img in p.images:
            filename = os.path.basename(img)  
            full_path = os.path.join(UPLOAD_DIR, filename) 
            if os.path.exists(full_path):
                os.remove(full_path)

        new_images = []
        for file in files:
            ext = os.path.splitext(file.filename)[1] or ".bin"
            unique_name = f"{uuid.uuid4()}{ext}"
            file_path = os.path.join(UPLOAD_DIR, unique_name)
            with open(file_path, "wb") as f:
                f.write(file.file.read())
            file.file.close()
            new_images.append(f"/uploads/{unique_name}")

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


    for image_path in p.images:
        full_path = os.path.join(BASE_DIR, image_path.lstrip("/")) 
        if os.path.exists(full_path):
            os.remove(full_path)

    p.delete()
    return {"detail": "Product deleted"}