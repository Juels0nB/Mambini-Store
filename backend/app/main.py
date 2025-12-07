from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, product, order, payment
import app.db  # Conexão DB
import os

# Tenta carregar dotenv, mas não falha se não existir (bom para Vercel)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = FastAPI(title="Backend Mambini Store")

# LISTA DE ORIGENS (Atualiza com o TEU link exato do frontend)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mambini-store-f.vercel.app",   # Teu Frontend
    "https://mambini-store-f.vercel.app/"   # Teu Frontend com barra
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://mambini-store-f.vercel.app" # O teu site oficial
    ],

    allow_origin_regex=r"https://.*\.vercel\.app",  # Nota o 'r' no início # Aceita qualquer site .vercel.app (Previews)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota de teste simples para ver se o servidor está vivo
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend a funcionar!"}

app.include_router(user.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(payment.router)