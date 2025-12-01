from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from fastapi.staticfiles import StaticFiles
from app.routes import user, product, order
from dotenv import load_dotenv
import os

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

import app.db  # importa a conexão MongoDB


app = FastAPI(title="Backend MongoEngine + FastAPI")

#  Permitir conexões com o frontend (Vite: localhost:5173)
origins = [
    "http://localhost:5173",
    "https://mambini-store.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],    # Permite todos os métodos (GET, POST, etc)
    allow_headers=["*"],    # Permite todos os headers (incluindo Authorization)
)

app.include_router(user.router)
app.include_router(product.router)
app.include_router(order.router)

#BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#uploads_path = os.path.join(BASE_DIR, "uploads")
#uploads_path = os.path.abspath(uploads_path)

#os.makedirs(uploads_path, exist_ok=True)

#app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")
