import os
from mongoengine import connect

# Vercel usa MONGODB_URI por padrão nas integrações
MONGO_URL = os.getenv("MONGODB_URI", os.getenv("MONGO_URL", "mongodb://localhost:27017/mydatabase"))

print(f"Connecting to MongoDB...") # Log para debug
connect(host=MONGO_URL)