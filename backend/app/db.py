import os
from mongoengine import connect
MONGO_URL = os.getenv("mongodb+srv://juelsonbalanga_db_user:JyKDNzicoflgVfzA@mambinistore.mxfpxrp.mongodb.net/?appName=MambiniStore","mongodb://localhost:27017/mydatabase")
connect(host=MONGO_URL)