#!/usr/bin/env python3
"""
Script para testar e descobrir o cloud name correto do Cloudinary
"""

import requests
from requests.auth import HTTPBasicAuth
import json

API_KEY = "448678499645981"
API_SECRET = "L0TE9oujJYzGgug5ujKIH8JzZ3s"

def test_upload(cloud_name):
    """Testa upload com um cloud name"""
    try:
        print(f"Testando com cloud_name: {cloud_name}")
        
        # Criar um arquivo de teste mínimo (1x1 pixel PNG)
        tiny_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        
        url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
        
        files = {'file': ('test.png', tiny_png)}
        data = {
            'api_key': API_KEY,
            'folder': 'test'
        }
        
        response = requests.post(url, files=files, data=data, timeout=10)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if 'secure_url' in result:
                print(f"✅ SUCESSO! URL: {result['secure_url']}")
                # Deletar arquivo de teste
                requests.delete(
                    f"https://api.cloudinary.com/v1_1/{cloud_name}/image/destroy",
                    auth=HTTPBasicAuth(API_KEY, API_SECRET),
                    data={'public_id': result['public_id']},
                    timeout=10
                )
                return True
        
        print(f"Response: {response.text[:200]}")
        return False
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        return False

# Testar diferentes cloud names
cloud_names_to_try = [
    "Root",  # Original
    "maddietavares",
    "maddie-tavares",
    "maddie_tavares",
]

print("🔍 Descobrindo o cloud_name correto...\n")

for cloud_name in cloud_names_to_try:
    if test_upload(cloud_name):
        print(f"\n✅ Cloud name correto: {cloud_name}")
        break
    print()
