from mongoengine import Document, StringField, FloatField, IntField, DateTimeField, ListField, ReferenceField, EmbeddedDocument, EmbeddedDocumentField
import datetime

class OrderItem(EmbeddedDocument):
    """Item individual de um pedido"""
    product_id = StringField(required=True)
    product_name = StringField(required=True)
    price = FloatField(required=True)
    quantity = IntField(required=True, min_value=1)
    size = StringField()
    color = StringField()
    image = StringField()

class Order(Document):
    """Modelo de Pedido"""
    STATUS_CHOICES = ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    
    user_id = StringField(required=True)  # ID do usuário que fez o pedido
    user_email = StringField(required=True)
    user_name = StringField()
    
    items = ListField(EmbeddedDocumentField(OrderItem), required=True)
    
    total_amount = FloatField(required=True)
    
    status = StringField(choices=STATUS_CHOICES, default='pending')
    
    # Informações de entrega
    shipping_address = StringField()
    shipping_city = StringField()
    shipping_postal_code = StringField()
    shipping_country = StringField()
    shipping_phone = StringField()
    
    # Datas
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)
    
    # Notas
    notes = StringField()
    
    def save(self, *args, **kwargs):
        """Atualiza updated_at ao salvar"""
        self.updated_at = datetime.datetime.utcnow()
        return super().save(*args, **kwargs)

