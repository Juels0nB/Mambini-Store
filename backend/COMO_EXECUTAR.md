# 🚀 Como Executar o Servidor

## ❌ Erro Comum

Se você ver este erro:
```
ModuleNotFoundError: No module named 'cloudinary'
```

**Causa**: O ambiente virtual não está ativado!

## ✅ Solução

### Passo 1: Navegar para o diretório backend
```bash
cd backend
```

### Passo 2: Ativar o ambiente virtual
```bash
source .venv/bin/activate
```

Você deve ver `(.venv)` no início da linha do terminal:
```bash
(.venv) user@computer backend %
```

### Passo 3: Iniciar o servidor
```bash
uvicorn app.main:app --reload
```

## 🎯 Método Mais Fácil (Recomendado)

Use o script helper que já ativa tudo automaticamente:

```bash
cd backend
./start_server.sh
```

## 🔍 Verificar se está correto

Antes de executar, verifique:

```bash
# Deve mostrar o caminho do .venv
which python
# Deve mostrar: /caminho/para/backend/.venv/bin/python

# Deve mostrar o caminho do .venv
which uvicorn
# Deve mostrar: /caminho/para/backend/.venv/bin/uvicorn
```

Se mostrar caminhos do sistema (como `/usr/bin/python`), o ambiente virtual **NÃO** está ativado!

## 📝 Checklist

- [ ] Ambiente virtual criado (`.venv/` existe)
- [ ] Ambiente virtual ativado (vejo `(.venv)` no terminal)
- [ ] Dependências instaladas (`pip install -r app/requirements.txt`)
- [ ] Arquivo `.env` configurado
- [ ] Executar `uvicorn app.main:app --reload`

## 💡 Dica

Se você fechar o terminal, precisa ativar o ambiente virtual novamente. O ambiente virtual só fica ativo na sessão atual do terminal.

