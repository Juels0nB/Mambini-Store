# Configuração do Stripe no Projeto Mambini Store

Este documento explica como configurar o Stripe para processar pagamentos no projeto.

## 📋 Pré-requisitos

1. Criar uma conta no [Stripe](https://stripe.com)
2. Obter as chaves de API (teste e produção)

## 🔑 Variáveis de Ambiente

### Backend

Adicione as seguintes variáveis ao arquivo `.env` do backend:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...  # Chave secreta do Stripe (começa com sk_test_ para teste ou sk_live_ para produção)
STRIPE_WEBHOOK_SECRET=whsec_...  # Secret do webhook (obtido após configurar o webhook)
```

### Frontend

Adicione a seguinte variável ao arquivo `.env` do frontend (ou `.env.local`):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Chave pública do Stripe (começa com pk_test_ para teste ou pk_live_ para produção)
```

## 🔧 Configuração Passo a Passo

### 1. Obter Chaves da API Stripe

1. Acesse o [Dashboard do Stripe](https://dashboard.stripe.com)
2. Vá em **Developers** → **API keys**
3. Copie a **Publishable key** (usar no frontend)
4. Clique em **Reveal test key** para ver a **Secret key** (usar no backend)

### 2. Configurar Webhook (Importante!)

O webhook permite que o Stripe notifique o backend quando um pagamento é confirmado.

#### Para Desenvolvimento Local:

1. Instale o [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Faça login: `stripe login`
3. Execute o comando para encaminhar webhooks:

```bash
stripe listen --forward-to localhost:8000/payment/webhook
```

4. Copie o `webhook signing secret` que aparece (começa com `whsec_`)
5. Adicione ao `.env` do backend como `STRIPE_WEBHOOK_SECRET`

#### Para Produção:

1. No Dashboard do Stripe, vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seu-backend.com/payment/webhook`
4. Selecione os eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copie o **Signing secret** e adicione ao `.env` do backend

### 3. Instalar Dependências

#### Backend:

```bash
cd backend
pip install -r requirements.txt
```

#### Frontend:

```bash
cd mambini-app
npm install
```

## 🔄 Fluxo de Pagamento

1. **Cliente preenche informações de entrega** → CheckoutPage
2. **Sistema cria PaymentIntent** → Backend retorna `client_secret`
3. **Cliente preenche dados do cartão** → PaymentForm (Stripe Elements)
4. **Pagamento é processado** → Stripe confirma pagamento
5. **Backend cria pedido** → Com `payment_intent_id`
6. **Webhook confirma pagamento** → Atualiza status do pedido

## 🧪 Testar em Modo de Teste

### Cartões de Teste do Stripe:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

**Data de expiração**: Qualquer data futura (ex: 12/25)
**CVC**: Qualquer 3 dígitos (ex: 123)
**CEP**: Qualquer valor válido

## ⚠️ Importante

1. **Nunca commite as chaves secretas** no repositório
2. Use **chaves de teste** durante desenvolvimento
3. Configure o **webhook** corretamente para produção
4. Em produção, use chaves **live** (`sk_live_` e `pk_live_`)

## 📝 Checklist de Configuração

- [ ] Criar conta no Stripe
- [ ] Obter chaves de API (teste)
- [ ] Configurar `STRIPE_SECRET_KEY` no backend `.env`
- [ ] Configurar `VITE_STRIPE_PUBLISHABLE_KEY` no frontend `.env`
- [ ] Configurar webhook (Stripe CLI para dev ou dashboard para produção)
- [ ] Configurar `STRIPE_WEBHOOK_SECRET` no backend `.env`
- [ ] Instalar dependências do backend (`pip install -r requirements.txt`)
- [ ] Instalar dependências do frontend (`npm install`)
- [ ] Testar fluxo completo com cartão de teste

## 🐛 Resolução de Problemas

### Erro: "Chave pública do Stripe não configurada"
- Verifique se `VITE_STRIPE_PUBLISHABLE_KEY` está no `.env` do frontend
- Reinicie o servidor de desenvolvimento

### Erro: "STRIPE_SECRET_KEY não configurado"
- Verifique se a variável está no `.env` do backend
- Reinicie o servidor backend

### Webhook não funciona
- Verifique se o endpoint está acessível publicamente (para produção)
- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Use o Stripe CLI para desenvolvimento local

### Pagamento não confirma
- Verifique os logs do backend para erros
- Verifique se o webhook está configurado corretamente
- Verifique se o status do PaymentIntent está correto

## 📚 Recursos Adicionais

- [Documentação do Stripe](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

