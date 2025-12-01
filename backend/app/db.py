import os
from mongoengine import connect

# Carrega URL de conexão MongoDB de variável de ambiente
# Fallback para desenvolvimento local
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/mydatabase")
connect(host=MONGO_URL)