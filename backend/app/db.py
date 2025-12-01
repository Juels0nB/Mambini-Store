import os
from mongoengine import connect
MONGO_URL = os.getenv("MONGODB_URI","mongodb://localhost:27017/mydatabase")
connect(host=MONGO_URL)