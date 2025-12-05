from fastapi import APIRouter, Depends, HTTPException, status
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.auth import get_current_user, require_admin
from typing import List
from mongoengine.errors import ValidationError

router = APIRouter(prefix="/orders")

@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, current_user=Depends(get_current_user)):
    """
    Cria um novo pedido a partir do carrinho do usuário.
    Valida estoque e atualiza produtos.
    """
    # Validar estoque e calcular total
    total_amount = 0.0
    validated_items = []
    
    for item in order_data.items:
        # Buscar produto
        try:
            product = Product.objects(id=item.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Produto {item.product_id} não encontrado"
                )
            
            # Validar estoque
            if product.stock is None or product.stock < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Produto {product.name} tem stock inválido"
                )
            
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Estoque insuficiente para {product.name}. Disponível: {product.stock}, Solicitado: {item.quantity}"
                )
            
            if item.quantity <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Quantidade deve ser maior que zero para {product.name}"
                )
            
            # Calcular subtotal
            subtotal = product.price * item.quantity
            total_amount += subtotal
            
            # Criar item validado
            validated_items.append(OrderItem(
                product_id=str(product.id),
                product_name=product.name,
                price=product.price,
                quantity=item.quantity,
                size=item.size,
                color=item.color,
                image=item.image or (product.images[0] if product.images else "")
            ))
            
            # Atualizar estoque
            product.stock -= item.quantity
            product.save()
            
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro ao validar produto {item.product_id}: {str(e)}"
            )
    
    if not validated_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Carrinho vazio"
        )
    
    # Criar pedido
    order = Order(
        user_id=str(current_user.id),
        user_email=current_user.email,
        user_name=current_user.name,
        items=validated_items,
        total_amount=total_amount,
        status="pending",
        shipping_address=order_data.shipping.address,
        shipping_city=order_data.shipping.city,
        shipping_postal_code=order_data.shipping.postal_code,
        shipping_country=order_data.shipping.country,
        shipping_phone=order_data.shipping.phone,
        notes=order_data.notes
    )
    
    try:
        order.save()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao criar pedido: {str(e)}"
        )
    
    return OrderOut(
        id=str(order.id),
        user_id=order.user_id,
        user_email=order.user_email,
        user_name=order.user_name,
        items=[
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "price": item.price,
                "quantity": item.quantity,
                "size": item.size,
                "color": item.color,
                "image": item.image
            }
            for item in order.items
        ],
        total_amount=order.total_amount,
        status=order.status,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_postal_code=order.shipping_postal_code,
        shipping_country=order.shipping_country,
        shipping_phone=order.shipping_phone,
        created_at=str(order.created_at),
        updated_at=str(order.updated_at),
        notes=order.notes
    )

@router.get("/", response_model=List[OrderOut])
def get_my_orders(current_user=Depends(get_current_user)):
    """Lista todos os pedidos do usuário logado"""
    orders = Order.objects(user_id=str(current_user.id)).order_by("-created_at")
    
    return [
        OrderOut(
            id=str(order.id),
            user_id=order.user_id,
            user_email=order.user_email,
            user_name=order.user_name,
            items=[
                {
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "price": item.price,
                    "quantity": item.quantity,
                    "size": item.size,
                    "color": item.color,
                    "image": item.image
                }
                for item in order.items
            ],
            total_amount=order.total_amount,
            status=order.status,
            shipping_address=order.shipping_address,
            shipping_city=order.shipping_city,
            shipping_postal_code=order.shipping_postal_code,
            shipping_country=order.shipping_country,
            shipping_phone=order.shipping_phone,
            created_at=str(order.created_at),
            updated_at=str(order.updated_at),
            notes=order.notes
        )
        for order in orders
    ]

@router.get("/all", response_model=List[OrderOut])
def get_all_orders(admin=Depends(require_admin)):
    """Lista todos os pedidos (apenas admin)"""
    orders = Order.objects().order_by("-created_at")
    
    return [
        OrderOut(
            id=str(order.id),
            user_id=order.user_id,
            user_email=order.user_email,
            user_name=order.user_name,
            items=[
                {
                    "product_id": item.product_id,
                    "product_name": item.product_name,
                    "price": item.price,
                    "quantity": item.quantity,
                    "size": item.size,
                    "color": item.color,
                    "image": item.image
                }
                for item in order.items
            ],
            total_amount=order.total_amount,
            status=order.status,
            shipping_address=order.shipping_address,
            shipping_city=order.shipping_city,
            shipping_postal_code=order.shipping_postal_code,
            shipping_country=order.shipping_country,
            shipping_phone=order.shipping_phone,
            created_at=str(order.created_at),
            updated_at=str(order.updated_at),
            notes=order.notes
        )
        for order in orders
    ]

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: str, current_user=Depends(get_current_user)):
    """Obtém detalhes de um pedido específico"""
    order = Order.objects(id=order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado"
        )
    
    # Usuário só pode ver seus próprios pedidos (a menos que seja admin)
    if str(current_user.id) != order.user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não tens permissão para ver este pedido"
        )
    
    return OrderOut(
        id=str(order.id),
        user_id=order.user_id,
        user_email=order.user_email,
        user_name=order.user_name,
        items=[
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "price": item.price,
                "quantity": item.quantity,
                "size": item.size,
                "color": item.color,
                "image": item.image
            }
            for item in order.items
        ],
        total_amount=order.total_amount,
        status=order.status,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_postal_code=order.shipping_postal_code,
        shipping_country=order.shipping_country,
        shipping_phone=order.shipping_phone,
        created_at=str(order.created_at),
        updated_at=str(order.updated_at),
        notes=order.notes
    )

@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    admin=Depends(require_admin)
):
    """Atualiza o status de um pedido (apenas admin)"""
    order = Order.objects(id=order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido não encontrado"
        )
    
    # Validar status
    if status_update.status not in Order.STATUS_CHOICES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status inválido. Opções: {', '.join(Order.STATUS_CHOICES)}"
        )
    
    order.status = status_update.status
    order.save()
    
    return OrderOut(
        id=str(order.id),
        user_id=order.user_id,
        user_email=order.user_email,
        user_name=order.user_name,
        items=[
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "price": item.price,
                "quantity": item.quantity,
                "size": item.size,
                "color": item.color,
                "image": item.image
            }
            for item in order.items
        ],
        total_amount=order.total_amount,
        status=order.status,
        shipping_address=order.shipping_address,
        shipping_city=order.shipping_city,
        shipping_postal_code=order.shipping_postal_code,
        shipping_country=order.shipping_country,
        shipping_phone=order.shipping_phone,
        created_at=str(order.created_at),
        updated_at=str(order.updated_at),
        notes=order.notes
    )

