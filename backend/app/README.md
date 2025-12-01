# Mambini Store - Backend

## 🚀 Início Rápido

### 1. Configurar Ambiente Virtual

```bash
# Criar ambiente virtual (se ainda não existe)
python3 -m venv .venv

# Ativar ambiente virtual
# macOS/Linux:
source .venv/bin/activate

# Windows:
# .venv\Scripts\activate
```

### 2. Instalar Dependências

```bash
# Com ambiente virtual ativado
pip install -r app/requirements.txt
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais
# Ver README_ENV.md para mais detalhes
```

### 4. Iniciar Servidor

**Opção 1: Usando o script helper (Recomendado)**
```bash
./start_server.sh
```

**Opção 2: Manualmente**
```bash
# Certifique-se de que o ambiente virtual está ativado!
source .venv/bin/activate  # macOS/Linux
# ou
# .venv\Scripts\activate   # Windows

# Iniciar servidor
uvicorn app.main:app --reload
```

O servidor estará disponível em:
- 🌐 API: http://localhost:8000
- 📚 Documentação: http://localhost:8000/docs

## ⚠️ Importante

**SEMPRE ative o ambiente virtual antes de executar o servidor!**

Se você ver erros como `ModuleNotFoundError: No module named 'cloudinary'`, significa que o ambiente virtual não está ativado.

## 📁 Estrutura

- `app/` - Código da aplicação
- `.venv/` - Ambiente virtual Python
- `.env` - Variáveis de ambiente (não commitar!)
- `uploads/` - Diretório para uploads locais (se necessário)

