# Análise do Projeto Mambini Store

## 📋 Visão Geral

O **Mambini Store** é uma aplicação de e-commerce completa com arquitetura separada entre frontend (React/TypeScript) e backend (FastAPI/Python), utilizando MongoDB como banco de dados.

---

## 🏗️ Arquitetura

### **Backend (FastAPI + MongoDB)**
- **Framework**: FastAPI
- **ORM**: MongoEngine
- **Banco de Dados**: MongoDB (MongoDB Atlas)
- **Autenticação**: JWT (JSON Web Tokens)
- **Armazenamento de Imagens**: Cloudinary
- **Porta**: 8000

### **Frontend (React + TypeScript)**
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.12
- **Estilização**: Tailwind CSS 4.1.16
- **Roteamento**: React Router DOM 7.9.4
- **HTTP Client**: Axios
- **Porta**: 5173

---

## ✅ Pontos Fortes

### 1. **Arquitetura Moderna e Escalável**
- Separação clara entre frontend e backend
- Uso de TypeScript para type safety
- API RESTful bem estruturada
- Context API para gerenciamento de estado (carrinho)

### 2. **Segurança Básica Implementada**
- Hash de senhas com Argon2 (via Passlib)
- Autenticação JWT
- Proteção de rotas admin
- Validação de dados com Pydantic

### 3. **Funcionalidades Completas**
- ✅ CRUD de produtos
- ✅ Sistema de autenticação (registro/login)
- ✅ Carrinho de compras (localStorage)
- ✅ Painel administrativo
- ✅ Upload de imagens (Cloudinary)
- ✅ Filtros por categoria, gênero, tamanho, cor

### 4. **Boas Práticas**
- Uso de schemas Pydantic para validação
- Interceptors Axios para tokens
- Componentização React
- Responsive design com Tailwind

---

## ⚠️ Problemas Críticos de Segurança

### 🔴 **1. Credenciais Expostas no Código**

**Localização**: `backend/app/routes/product.py` (linhas 14-16)
```python
cloudinary.config(
    cloud_name = "ddyni5b9q",
    api_key = "351722938126552",
    api_secret = "4iuJbv4oiZyd0RYGgTFIAa9js9Y",  # ⚠️ EXPOSTO!
    secure=True
)
```

**Risco**: Credenciais do Cloudinary expostas publicamente no repositório.

**Solução**: Usar variáveis de ambiente:
```python
import os
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)
```

---

### 🔴 **2. SECRET_KEY JWT Hardcoded**

**Localização**: `backend/app/auth.py` (linha 7)
```python
SECRET_KEY = "YOUR_SECRET_KEY"  # ⚠️ MUITO FRACO!
```

**Risco**: 
- Token JWT pode ser facilmente forjado
- Qualquer pessoa pode criar tokens válidos
- Acesso não autorizado ao sistema

**Solução**: 
```python
import os
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-key-for-dev-only")
# Em produção, usar: openssl rand -hex 32
```

**Ação Imediata**: 
1. Gerar nova SECRET_KEY forte
2. Invalidar todos os tokens existentes
3. Mover para variável de ambiente

---

### 🔴 **3. String de Conexão MongoDB Exposta**

**Localização**: `backend/app/db.py` (linha 3)
```python
MONGO_URL = os.getenv("mongodb+srv://Vercel-Admin-Mambini-Store:CtpFvdifk3wJa4EX@mambini-store.ywfkrvf.mongodb.net/?retryWrites=true&w=majority","mongodb://localhost:27017/mydatabase")
```

**Problemas**:
- Senha do MongoDB visível no código
- Sintaxe incorreta do `os.getenv()` (primeiro parâmetro não é a chave)
- Fallback hardcoded

**Solução**:
```python
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/mydatabase")
```

---

### 🔴 **4. CORS Muito Permissivo**

**Localização**: `backend/app/main.py` (linhas 18-24)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Apenas localhost e vercel
    allow_credentials=True,
    allow_methods=["*"],    # ⚠️ Permite TODOS os métodos
    allow_headers=["*"],    # ⚠️ Permite TODOS os headers
)
```

**Risco**: Ataques CSRF, requisições maliciosas.

**Solução**: Especificar métodos e headers necessários:
```python
allow_methods=["GET", "POST", "PUT", "DELETE"],
allow_headers=["Authorization", "Content-Type"],
```

---

## 🟡 Problemas de Qualidade de Código

### **1. Código Duplicado no Upload de Imagens**

**Localização**: `backend/app/routes/product.py` (linhas 66-85)

Há código duplicado no loop de upload:
```python
for file in files_list:
    try:
        upload_result = cloudinary.uploader.upload(file.file, folder="mambini_products")
        image_paths.append(upload_result["secure_url"])
    except Exception as e:
        # ...
    
    # ⚠️ Código duplicado abaixo (linhas 82-85)
    result = cloudinary.uploader.upload(file.file, folder="mambini_products")
    image_paths.append(result["secure_url"])
```

**Solução**: Remover o código duplicado após o loop.

---

### **2. Inconsistência no Gerenciamento de Imagens**

No endpoint `update_product`, ainda usa sistema de arquivos local:
```python
# Linha 159-173: Remove arquivos locais
# Mas no create_product usa Cloudinary
```

**Solução**: Padronizar para Cloudinary em ambos os endpoints.

---

### **3. Falta de Validação de Estoque**

Não há validação ao adicionar produtos ao carrinho:
- Verificar se há estoque suficiente
- Prevenir adicionar mais itens do que disponível

---

### **4. Tratamento de Erros Inconsistente**

- Alguns endpoints retornam mensagens genéricas
- Falta logging adequado
- Erros do Cloudinary não são tratados adequadamente

---

### **5. Falta de Paginação**

**Localização**: `backend/app/routes/product.py` (linha 26-45)

O endpoint `get_products` retorna TODOS os produtos:
```python
@router.get("/", response_model=List[ProductOut])
def get_products():
    return [ProductOut(...) for p in Product.objects()]  # ⚠️ Sem paginação
```

**Problema**: Com muitos produtos, pode causar lentidão e consumo excessivo de memória.

**Solução**: Implementar paginação:
```python
@router.get("/", response_model=List[ProductOut])
def get_products(skip: int = 0, limit: int = 20):
    products = Product.objects().skip(skip).limit(limit)
    return [ProductOut(...) for p in products]
```

---

## 🟢 Melhorias Recomendadas

### **1. Variáveis de Ambiente**

Criar arquivo `.env` (e adicionar ao `.gitignore`):
```env
SECRET_KEY=seu-secret-key-aqui
MONGO_URL=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=ddyni5b9q
CLOUDINARY_API_KEY=351722938126552
CLOUDINARY_API_SECRET=4iuJbv4oiZyd0RYGgTFIAa9js9Y
```

Instalar `python-dotenv`:
```bash
pip install python-dotenv
```

Usar no código:
```python
from dotenv import load_dotenv
load_dotenv()
```

---

### **2. Validação de Dados**

- Validar preços negativos
- Validar estoque negativo
- Validar tamanhos e cores disponíveis
- Validar formato de imagens

---

### **3. Testes**

Adicionar testes unitários e de integração:
- Testes de autenticação
- Testes de CRUD de produtos
- Testes de validação

---

### **4. Documentação da API**

FastAPI gera documentação automática em `/docs`, mas pode ser melhorada com:
- Exemplos de requisições
- Descrições mais detalhadas
- Códigos de erro documentados

---

### **5. Logging**

Implementar logging estruturado:
```python
import logging
logger = logging.getLogger(__name__)
logger.error(f"Erro no upload: {e}")
```

---

### **6. Rate Limiting**

Proteger endpoints contra abuso:
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@router.post("/")
@limiter.limit("10/minute")
def create_product(...):
    ...
```

---

### **7. Sistema de Pedidos**

Atualmente não há sistema de pedidos. Implementar:
- Modelo `Order`
- Endpoint para criar pedidos
- Histórico de pedidos do usuário
- Atualização de estoque após pedido

---

### **8. Busca e Filtros**

Melhorar filtros de produtos:
- Busca por nome
- Filtros combinados (categoria + gênero + preço)
- Ordenação (preço, data, nome)

---

### **9. Validação de Imagens**

- Validar tipo de arquivo (apenas imagens)
- Validar tamanho máximo
- Redimensionar imagens automaticamente

---

### **10. Tratamento de Erros no Frontend**

- Mensagens de erro amigáveis
- Loading states
- Retry automático em caso de falha

---

## 📊 Estrutura de Dados

### **Modelo Product**
```python
- name: str (required)
- description: str
- price: float (required)
- stock: int (default: 0)
- sizes: List[str]
- available_sizes: List[str]
- gender: str (choices: male, female, unisex)
- category: str
- colors: List[str]
- available_colors: List[str]
- images: List[str] (URLs do Cloudinary)
- created_at: datetime
```

**Observação**: Há redundância entre `sizes`/`available_sizes` e `colors`/`available_colors`. Considerar simplificar.

---

### **Modelo User**
```python
- email: EmailField (required, unique)
- name: str
- password: str (hashed)
- role: str (choices: client, admin)
```

**Observação**: Falta campo de data de criação/atualização.

---

## 🔧 Configuração e Deploy

### **Backend**
- Configurado para Vercel (`vercel.json` presente)
- CORS configurado para produção
- Uploads configurados

### **Frontend**
- Build configurado com Vite
- Base URL hardcoded (`http://localhost:8000`)
- Deve usar variável de ambiente para API URL

---

## 📝 Checklist de Ações Urgentes

- [ ] **URGENTE**: Mover credenciais para variáveis de ambiente
- [ ] **URGENTE**: Gerar nova SECRET_KEY forte e atualizar
- [ ] **URGENTE**: Corrigir string de conexão MongoDB
- [ ] Remover código duplicado no upload de imagens
- [ ] Padronizar upload de imagens (sempre Cloudinary)
- [ ] Implementar paginação nos produtos
- [ ] Adicionar validação de estoque no carrinho
- [ ] Melhorar tratamento de erros
- [ ] Adicionar logging
- [ ] Implementar sistema de pedidos
- [ ] Adicionar testes

---

## 🎯 Conclusão

O projeto demonstra uma boa base arquitetural e funcionalidades completas para um e-commerce. No entanto, há **problemas críticos de segurança** que precisam ser corrigidos **imediatamente** antes de qualquer deploy em produção.

**Prioridades**:
1. 🔴 **Segurança** (credenciais, SECRET_KEY)
2. 🟡 **Qualidade** (código duplicado, validações)
3. 🟢 **Funcionalidades** (pedidos, busca, testes)

Com essas correções, o projeto estará pronto para produção.

---

**Data da Análise**: 2024
**Versão Analisada**: Branch `main`

