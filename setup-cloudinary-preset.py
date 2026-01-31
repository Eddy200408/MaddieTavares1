#!/usr/bin/env python3
"""
Setup do Upload Preset no Cloudinary
Execute este script para configurar o upload_preset automático
"""

import requests
import json
from base64 import b64encode

CLOUDINARY_CONFIG = {
    "cloud_name": "Root",
    "api_key": "448678499645981",
    "api_secret": "L0TE9oujJYzGgug5ujKIH8JzZ3s"
}

def create_upload_preset():
    """Cria um upload preset sem autenticação para uploads públicos"""
    
    url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CONFIG['cloud_name']}/upload_presets"
    
    # Credenciais básicas
    credentials = f"{CLOUDINARY_CONFIG['api_key']}:{CLOUDINARY_CONFIG['api_secret']}"
    encoded_credentials = b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    data = {
        'name': 'maddietavares_preset',
        'unsigned': False,
        'folder': 'maddietavares',
        'tags': 'maddietavares,website',
        'resource_type': 'auto'
    }
    
    try:
        print("🔧 Criando upload preset...")
        response = requests.post(url, data=data, headers=headers, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        print(f"✅ Upload preset criado com sucesso!")
        print(json.dumps(result, indent=2))
        return result
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 409:
            print("⚠️  Upload preset já existe")
            return None
        else:
            print(f"❌ Erro: {e.response.text}")
            return None
    except Exception as e:
        print(f"❌ Erro ao criar upload preset: {str(e)}")
        return None

if __name__ == '__main__':
    print(f"Cloud Name: {CLOUDINARY_CONFIG['cloud_name']}")
    print(f"API Key: {CLOUDINARY_CONFIG['api_key']}\n")
    create_upload_preset()
