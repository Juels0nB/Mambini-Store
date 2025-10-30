from fastapi import FastAPI
from app.routes import user, product
from fastapi.staticfiles import StaticFiles
import app.db  # importa a conexão MongoDB
import os


app = FastAPI(title="Backend MongoEngine + FastAPI")

app.include_router(user.router)
app.include_router(product.router)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
uploads_path = os.path.join(BASE_DIR, "..", "uploads")  
uploads_path = os.path.abspath(uploads_path)  


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")