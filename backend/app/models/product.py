from mongoengine import Document, StringField, FloatField, IntField, DateTimeField, ListField
import datetime

class Product(Document):
    name = StringField(required=True, max_length=100)
    description = StringField()
    price = FloatField(required=True)
    stock = IntField(default=0)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    sizes = ListField(StringField())
    available_sizes = ListField(StringField())
    gender = StringField(choices=['male', 'female', 'unisex'])
    category = StringField()
    colors = ListField(StringField())
    available_colors = ListField(StringField())
    images = ListField(StringField())