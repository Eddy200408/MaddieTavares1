# 🚀 GUIA RÁPIDO: Migração para Cloudinary

## 3 Passos Simples

### 1️⃣ Instalar dependências
```bash
pip install requests
```

### 2️⃣ Executar migração
```bash
python migrate-images.py
```

### 3️⃣ Confirmar e concluir
- O script vai mostrar as imagens a migrar
- Digite `s` para confirmar
- Aguarde o upload completar

---

## 📊 O que acontece

✅ **Antes**
- 5 imagens locais em `/public/images/`
- ~2-5 MB de dados
- Carregadas do servidor

❌ **Depois** 
- Imagens no Cloudinary
- URLs atualizadas no código
- Pasta `/public/images/` vazia
- ~2-5 MB economizados

---

## 🔒 Credenciais (já configuradas)

```
Cloud: Root
API Key: 448678499645981
Secret: (protegido)
```

---

## 📁 Imagens a migrar

1. `logo.png` - Logo principal
2. `logo.jpeg` - Logo alternativo
3. `facial.jpg` - Serviço facial
4. `entrada.jpg` - Entrada da clínica
5. `whatsapp-20image-202025-11-17-20at-2021.jpeg` - Background

---

## ⚡ Resultado

| Métrica | Antes | Depois |
|---------|-------|--------|
| Tamanho local | ~2-5 MB | 0 MB |
| CDN | ❌ | ✅ |
| Performance | Normal | Otimizada |
| Entrega | Local | Global |

---

## 🆘 Se der erro

**"ModuleNotFoundError: No module named 'requests'"**
```bash
pip install requests
```

**"ConnectionError" ou "Timeout"**
- Verifique sua internet
- Tente novamente

**"Permission denied"**
- Feche programas usando as imagens
- Execute como admin

---

## 📞 Mapeamento

Após a migração, um arquivo `cloudinary-mapping.json` é criado com:

```json
{
  "/images/logo.png": "https://res.cloudinary.com/Root/image/upload/v1234567890/maddietavares/logo.png",
  "/images/facial.jpg": "https://res.cloudinary.com/Root/image/upload/v1234567890/maddietavares/facial.jpg"
}
```

Use este arquivo para referência ou reverter se necessário.

---

## 🔄 Se quiser reverter

```bash
git checkout HEAD -- app/ components/ public/
rm cloudinary-mapping.json
```

---

**Pronto para migrar? Execute:**
```bash
python migrate-images.py
```
