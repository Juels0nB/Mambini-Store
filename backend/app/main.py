from fastapi import FastAPI
from app.routes import user, product
import app.db  # importa a conexão MongoDB

app = FastAPI(title="Backend MongoEngine + FastAPI")

app.include_router(user.router)
app.include_router(product.router)