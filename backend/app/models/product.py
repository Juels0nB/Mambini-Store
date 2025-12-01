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
    
    def clean(self):
        """Normaliza o campo created_at se for uma string ISO"""
        super().clean()
        if isinstance(self.created_at, str):
            try:
                # Converte string ISO para datetime
                # Formato esperado: "2023-11-02T15:10:00.000Z"
                date_str = self.created_at
                # Remove 'Z' e adiciona timezone UTC se necessário
                if date_str.endswith('Z'):
                    date_str = date_str[:-1] + '+00:00'
                elif '+' not in date_str and '-' in date_str[-6:]:
                    # Já tem timezone
                    pass
                else:
                    # Sem timezone, assume UTC
                    date_str = date_str + '+00:00'
                
                self.created_at = datetime.datetime.fromisoformat(date_str)
            except (ValueError, AttributeError, TypeError):
                # Se falhar o parse, usa datetime atual como fallback
                self.created_at = datetime.datetime.utcnow()