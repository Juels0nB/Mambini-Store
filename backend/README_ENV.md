# Configuração de Variáveis de Ambiente

## ⚠️ IMPORTANTE: Segurança

Todas as credenciais sensíveis foram movidas para variáveis de ambiente. **NUNCA** commite o arquivo `.env` no repositório!

## 📋 Passos para Configurar

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Criar Arquivo .env

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

### 3. Preencher Variáveis no .env

Abra o arquivo `.env` e preencha com os valores reais:

#### SECRET_KEY (JWT)

Gere uma chave forte usando:

```bash
openssl rand -hex 32
```

Cole o resultado no `.env`:
```
SECRET_KEY=seu-valor-gerado-aqui
```

#### MONGO_URL

Use sua string de conexão do MongoDB:

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

Para desenvolvimento local:
```
MONGO_URL=mongodb://localhost:27017/mydatabase
```

#### Cloudinary

Obtenha as credenciais no [painel do Cloudinary](https://cloudinary.com/console):

```
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

#### Stripe (Pagamentos)

Obtenha as credenciais no [Dashboard do Stripe](https://dashboard.stripe.com):

```
STRIPE_SECRET_KEY=sk_test_...  # Chave secreta (sk_test_ para teste, sk_live_ para produção)
STRIPE_WEBHOOK_SECRET=whsec_...  # Secret do webhook (obtido após configurar o webhook)
```

**Nota**: Veja o arquivo `STRIPE_SETUP.md` na raiz do projeto para instruções detalhadas de configuração do Stripe.

#### CORS (Opcional)

Para adicionar origens adicionais além das padrão (localhost:5173 e mambini-store.vercel.app):

```
ALLOWED_ORIGINS=https://outro-dominio.com,https://mais-um-dominio.com
```

**Nota**: As origens padrão já estão configuradas. Use esta variável apenas se precisar adicionar mais domínios.

## ✅ Verificação

Após configurar, teste se está funcionando:

```bash
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('SECRET_KEY:', 'OK' if os.getenv('SECRET_KEY') else 'FALTANDO')"
```

## 🚀 Deploy

Em produção (Vercel, Heroku, etc.), configure as variáveis de ambiente através do painel da plataforma, **não** através de arquivo `.env`.

