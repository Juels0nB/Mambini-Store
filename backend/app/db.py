import os
from mongoengine import connect
MONGO_URL = os.getenv("mongodb+srv://Vercel-Admin-Mambini-Store:CtpFvdifk3wJa4EX@mambini-store.ywfkrvf.mongodb.net/?retryWrites=true&w=majority","mongodb://localhost:27017/mydatabase")
connect(host=MONGO_URL)