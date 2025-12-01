#!/bin/bash

# Script para iniciar o servidor FastAPI
# Garante que o ambiente virtual está ativado

cd "$(dirname "$0")"

# Ativa o ambiente virtual
source .venv/bin/activate

# Verifica se as dependências estão instaladas
if ! python -c "import cloudinary" 2>/dev/null; then
    echo "⚠️  Instalando dependências..."
    pip install -r app/requirements.txt
fi

# Inicia o servidor
echo "🚀 Iniciando servidor FastAPI..."
echo "📝 Documentação disponível em: http://localhost:8000/docs"
echo "🔌 API disponível em: http://localhost:8000"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

