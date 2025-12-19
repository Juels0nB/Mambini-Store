from mongoengine import Document, StringField, EmailField
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class User(Document):
    ROLE_CHOICES = ('client', 'admin')
    email = EmailField(required=True, unique=True)
    name = StringField(max_length=100)
    password = StringField(required=True)
    role = StringField(choices=ROLE_CHOICES, default='client')
    
    # Informações de endereço para entrega
    address = StringField()
    city = StringField()
    postal_code = StringField()
    country = StringField()
    phone = StringField()

    def set_password(self, raw_password: str):
        self.password = pwd_context.hash(raw_password)

    def verify_password(self, raw_password: str) -> bool:
        return pwd_context.verify(raw_password, self.password)