from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import user, product, order
from dotenv import load_dotenv
import os

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

import app.db  # importa a conexão MongoDB


app = FastAPI(title="Backend MongoEngine + FastAPI")

# Configuração CORS - Permitir apenas origens, métodos e headers necessários
# Para adicionar mais origens, defina a variável de ambiente ALLOWED_ORIGINS (separadas por vírgula)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
default_origins = [
    "http://localhost:5173",  # Desenvolvimento local (Vite)
    "https://mambini-store.vercel.app",  # Produção (sem barra final)
]

# Combina origens padrão com as do ambiente (se existirem)
origins = default_origins.copy()
if allowed_origins_env:
    origins.extend([origin.strip() for origin in allowed_origins_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Apenas domínios específicos permitidos
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Apenas métodos necessários
    allow_headers=["Authorization", "Content-Type"],  # Apenas headers necessários
    expose_headers=["Content-Type"],  # Headers que o frontend pode ler
    max_age=3600,  # Cache de preflight por 1 hora
)

app.include_router(user.router)
app.include_router(product.router)
app.include_router(order.router)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
uploads_path = os.path.join(BASE_DIR, "uploads")
uploads_path = os.path.abspath(uploads_path)

os.makedirs(uploads_path, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")
