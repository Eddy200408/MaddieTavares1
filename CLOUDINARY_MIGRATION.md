# 📦 Script de Migração para Cloudinary

## 🎯 O que faz

Este script automatiza a migração de todas as imagens do projeto para o Cloudinary, incluindo:

✅ **Upload automático** de todas as imagens em `/public/images`  
✅ **Atualização** de todas as referências de imagens no código  
✅ **Remoção** das imagens locais para otimizar o projeto  
✅ **Documentação** do mapeamento em `cloudinary-mapping.json`  

## 📋 Pré-requisitos

### Opção 1: Python (Recomendado)

```bash
# Instalar dependências
pip install requests requests-toolbelt

# Executar migração
python cloudinary-migrate.py
```

### Opção 2: Node.js

```bash
# Instalar dependências
npm install

# Executar migração
node cloudinary-migrate.js
```

## 🚀 Como usar

### 1. Antes de executar

Certifique-se de que:
- Você tem conexão com internet
- O Cloudinary está configurado corretamente
- Você tem as credenciais corretas no script

### 2. Executar o script

**Python:**
```bash
python cloudinary-migrate.py
```

**Node.js:**
```bash
node cloudinary-migrate.js
```

### 3. Verificar resultados

O script vai:
1. ✅ Fazer upload de cada imagem
2. ✅ Atualizar referências nos arquivos `.tsx`, `.ts`, `.jsx`, `.js` e `.css`
3. ✅ Deletar as imagens locais
4. ✅ Criar um arquivo `cloudinary-mapping.json`

## 📊 O que muda

### Antes (Local)
```tsx
<img src="/images/logo.png" alt="Logo" />
```

### Depois (Cloudinary)
```tsx
<img src="https://res.cloudinary.com/Root/image/upload/v1234567890/logo.png" alt="Logo" />
```

## 🔒 Credenciais

```
Cloud Name: Root
API Key: 448678499645981
API Secret: L0TE9oujJYzGgug5ujKIH8JzZ3s
```

## 🔄 Reverter (se necessário)

Se precisar reverter para as imagens locais:

1. Restaurar arquivos do git:
```bash
git checkout HEAD -- app/ components/
```

2. Restaurar imagens do git:
```bash
git checkout HEAD -- public/images/
```

3. Remover mapeamento:
```bash
rm cloudinary-mapping.json
```

## 📝 Arquivos gerados

- `cloudinary-migrate.py` - Script Python principal
- `cloudinary-migrate.js` - Script Node.js alternativo
- `cloudinary-mapping.json` - Mapeamento de imagens (criado após execução)

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'requests'"
```bash
pip install requests requests-toolbelt
```

### Erro: "403 Unauthorized"
- Verifique as credenciais do Cloudinary
- Certifique-se de que o `upload_preset` está criado

### Erro: "Connection timeout"
- Verifique sua conexão com internet
- Tente novamente mais tarde

### Erro: "Permission denied" ao deletar imagens
- Feche qualquer programa que esteja usando as imagens
- Tente novamente

## ✨ Benefícios

🚀 **Performance**: Imagens otimizadas na nuvem  
💾 **Espaço**: Reduz o tamanho do repositório  
⚡ **Velocidade**: CDN global para entrega rápida  
🔧 **Manutenção**: Fácil gerenciamento de imagens  
🌍 **Escalabilidade**: Sem limite de tamanho  

## 📞 Suporte

Se tiver problemas, verifique:
1. Credenciais do Cloudinary
2. Conexão com internet
3. Permissões de arquivo
4. Espaço em disco

---

**Criado em**: Janeiro de 2026  
**Versão**: 1.0.0
