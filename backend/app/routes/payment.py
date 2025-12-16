from fastapi import APIRouter, Depends, HTTPException, status, Header
from starlette.requests import Request
from pydantic import BaseModel
from typing import Optional
import stripe
import os
from app.auth import get_current_user
from app.models.order import Order
from app.models.product import Product
from app.models.user import User

# Garantir que dotenv seja carregado antes de ler variáveis
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configurar Stripe
# Não falhar na importação - verificar nas rotas quando necessário
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

def check_stripe_configured():
    """Verifica se o Stripe está configurado, lança HTTPException se não estiver"""
    if not STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço de pagamento não configurado. STRIPE_SECRET_KEY não está definida."
        )

router = APIRouter(prefix="/payment")

class PaymentIntentCreate(BaseModel):
    amount: float
    currency: str = "eur"
    order_id: Optional[str] = None  # Opcional - pode criar o order depois

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str

@router.post("/create-intent", response_model=PaymentIntentResponse)
def create_payment_intent(
    payment_data: PaymentIntentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Cria um PaymentIntent no Stripe para iniciar o processo de pagamento.
    O cliente vai usar o client_secret para confirmar o pagamento no frontend.
    """
    check_stripe_configured()
    try:
        # Converter para centavos (Stripe trabalha com a menor unidade da moeda)
        amount_cents = int(payment_data.amount * 100)
        
        # Validar valor mínimo
        if amount_cents < 50:  # Mínimo de 0.50 EUR
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Valor mínimo é 0.50 EUR"
            )
        
        # Criar PaymentIntent no Stripe
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment_data.currency.lower(),
            metadata={
                "user_id": str(current_user.id),
                "user_email": current_user.email,
                "order_id": payment_data.order_id or ""
            },
            automatic_payment_methods={
                "enabled": True,
            },
        )
        
        return PaymentIntentResponse(
            client_secret=intent.client_secret,
            payment_intent_id=intent.id
        )
    
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao criar pagamento: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno: {str(e)}"
        )

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """
    Webhook do Stripe para receber eventos de pagamento.
    Atualiza o status do pedido quando o pagamento é confirmado.
    """
    check_stripe_configured()
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    if not webhook_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="STRIPE_WEBHOOK_SECRET não configurado"
        )
    
    payload = await request.body()
    
    try:
        # Verificar assinatura do webhook
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, webhook_secret
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload inválido"
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assinatura do webhook inválida"
        )
    
    # Processar eventos
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        payment_intent_id = payment_intent["id"]
        
        # Buscar pedido pelo payment_intent_id
        order = Order.objects(payment_intent_id=payment_intent_id).first()
        
        if order:
            # Atualizar status do pagamento e do pedido
            order.payment_status = "succeeded"
            order.status = "processing"  # Mudar de pending para processing
            order.save()
            
            return {"status": "success", "message": "Pagamento confirmado"}
    
    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        payment_intent_id = payment_intent["id"]
        
        # Buscar pedido pelo payment_intent_id
        order = Order.objects(payment_intent_id=payment_intent_id).first()
        
        if order:
            order.payment_status = "failed"
            order.save()
            # Nota: O estoque não precisa ser revertido porque o pedido
            # só é criado após confirmação de pagamento no frontend
            return {"status": "success", "message": "Falha de pagamento registrada"}
    
    # Retornar sucesso para outros eventos (para evitar retries)
    return {"status": "received"}

@router.get("/intent/{payment_intent_id}")
def get_payment_intent_status(payment_intent_id: str, current_user: User = Depends(get_current_user)):
    """
    Verifica o status de um PaymentIntent específico.
    """
    check_stripe_configured()
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        # Verificar se o pedido pertence ao usuário
        order = Order.objects(payment_intent_id=payment_intent_id).first()
        if order and str(order.user_id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Não tens permissão para ver este pagamento"
            )
        
        return {
            "id": intent.id,
            "status": intent.status,
            "amount": intent.amount / 100,  # Converter de centavos para euros
            "currency": intent.currency
        }
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao buscar pagamento: {str(e)}"
        )

