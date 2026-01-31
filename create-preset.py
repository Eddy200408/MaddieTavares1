#!/usr/bin/env python3
"""
Setup Upload Preset no Cloudinary para upload não assinado
"""

import requests
from requests.auth import HTTPBasicAuth
import json

API_KEY = "448678499645981"
API_SECRET = "L0TE9oujJYzGgug5ujKIH8JzZ3s"
CLOUD_NAMES = ["Root", "maddietavares", "maddie-tavares", "maddie_tavares"]

def create_preset(cloud_name):
    """Cria um upload preset não assinado"""
    try:
        print(f"\n📝 Criando preset para cloud: {cloud_name}")
        
        url = f"https://api.cloudinary.com/v1_1/{cloud_name}/upload_presets"
        
        data = {
            'name': 'maddietavares_unsigned',
            'unsigned': True,
            'folder': 'maddietavares',
            'tags': 'website,maddietavares',
            'resource_type': 'auto'
        }
        
        # Usar autenticação básica com API key e secret
        auth = HTTPBasicAuth(API_KEY, API_SECRET)
        
        response = requests.post(url, data=data, auth=auth, timeout=10)
        
        print(f"Status: {response.status_code}")
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Preset criado com sucesso!")
            print(f"Preset name: {result.get('name')}")
            print(f"Unsigned: {result.get('unsigned')}")
            return result.get('name')
        elif response.status_code == 409:
            print(f"⚠️  Preset já existe")
            return 'maddietavares_unsigned'
        else:
            print(f"❌ Erro: {result.get('error', {}).get('message', str(result))}")
            return None
            
    except Exception as e:
        print(f"❌ Erro ao criar preset: {str(e)}")
        return None

def list_presets(cloud_name):
    """Lista presets existentes"""
    try:
        print(f"\n📋 Listando presets para cloud: {cloud_name}")
        
        url = f"https://api.cloudinary.com/v1_1/{cloud_name}/upload_presets"
        auth = HTTPBasicAuth(API_KEY, API_SECRET)
        
        response = requests.get(url, auth=auth, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            presets = result.get('presets', [])
            if presets:
                print(f"Presets encontrados: {len(presets)}")
                for preset in presets[:5]:
                    print(f"  • {preset.get('name')} (unsigned: {preset.get('unsigned')})")
            else:
                print("Nenhum preset encontrado")
            return presets
        else:
            print(f"❌ Erro: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Erro ao listar presets: {str(e)}")
        return []

print("=" * 60)
print("🚀 Setup Upload Preset no Cloudinary")
print("=" * 60)

# Tentar em cada cloud name possível
for cloud_name in CLOUD_NAMES:
    print(f"\n{'='*60}")
    print(f"Tentando com cloud_name: {cloud_name}")
    print(f"{'='*60}")
    
    # Listar presets existentes
    presets = list_presets(cloud_name)
    
    # Verificar se já existe um preset não assinado
    existing_unsigned = [p for p in presets if p.get('unsigned') == True]
    if existing_unsigned:
        print(f"\n✅ Preset não assinado já existe: {existing_unsigned[0].get('name')}")
        break
    
    # Criar novo preset
    preset = create_preset(cloud_name)
    if preset:
        print(f"\n✅ Sucesso com cloud_name: {cloud_name}")
        print(f"Preset criado: {preset}")
        break

print("\n" + "=" * 60)
print("✨ Setup concluído!")
print("=" * 60)
