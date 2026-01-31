#!/usr/bin/env python3
"""
Script de Migração de Imagens para Cloudinary
Faz upload de todas as imagens em /public/images e atualiza as referências no código
"""

import os
import json
import re
import sys
from pathlib import Path
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

# Configurações do Cloudinary
CLOUDINARY_CONFIG = {
    "cloud_name": "Root",
    "api_key": "448678499645981",
    "api_secret": "L0TE9oujJYzGgug5ujKIH8JzZ3s"
}

# Cores para output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.ENDC} {msg}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.ENDC} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.ENDC} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.ENDC} {msg}")

def upload_to_cloudinary(file_path, file_name):
    """Upload de imagem para o Cloudinary"""
    try:
        url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CONFIG['cloud_name']}/image/upload"
        
        with open(file_path, 'rb') as f:
            files = {'file': (file_name, f, 'image/*')}
            data = {
                'upload_preset': 'maddietavares_preset',
                'api_key': CLOUDINARY_CONFIG['api_key']
            }
            
            print_info(f"Fazendo upload: {file_name}...")
            response = requests.post(url, files=files, data=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if 'secure_url' in result:
                print_success(f"{file_name} -> {result['secure_url']}")
                return result['secure_url']
            else:
                print_error(f"Resposta inesperada: {result.get('error', {}).get('message', str(result))}")
                return None
                
    except requests.exceptions.RequestException as e:
        print_error(f"Erro ao fazer upload de {file_name}: {str(e)}")
        return None
    except Exception as e:
        print_error(f"Erro inesperado ao fazer upload de {file_name}: {str(e)}")
        return None

def find_source_files(root_dir, extensions=['.tsx', '.ts', '.jsx', '.js', '.css']):
    """Procura por arquivos de código fonte"""
    source_files = []
    exclude_dirs = {'node_modules', '.next', '.git', 'public', '.azure', '.vscode'}
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Remover diretórios que devem ser ignorados
        dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
        
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                source_files.append(os.path.join(dirpath, filename))
    
    return source_files

def replace_image_references(file_path, image_map):
    """Substitui referências de imagens no arquivo"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        for local_path, cloudinary_url in image_map.items():
            # Substituir em diferentes formatos
            patterns = [
                f'"{local_path}"',
                f"'{local_path}'",
                f'`{local_path}`',
                f'url({local_path})',
                f'url("{local_path}")',
                f"url('{local_path}')",
            ]
            
            for pattern in patterns:
                if pattern in content:
                    replacement = f'"{cloudinary_url}"' if '"' in pattern else f"'{cloudinary_url}'"
                    if 'url(' in pattern:
                        replacement = f'url("{cloudinary_url}")'
                    
                    content = content.replace(pattern, replacement)
                    print_success(f"Atualizado em {os.path.basename(file_path)}: {local_path}")
        
        # Salvar se houve mudanças
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print_error(f"Erro ao atualizar {file_path}: {str(e)}")
        return False

def main():
    """Função principal"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}🚀 Migração de Imagens para Cloudinary{Colors.ENDC}\n")
    
    # Obter diretório do projeto
    project_root = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(project_root, 'public', 'images')
    
    print_info(f"Nuvem: {CLOUDINARY_CONFIG['cloud_name']}")
    print_info(f"API Key: {CLOUDINARY_CONFIG['api_key'][:10]}...")
    print_info(f"Diretório de imagens: {images_dir}\n")
    
    # Verificar se diretório existe
    if not os.path.exists(images_dir):
        print_error(f"Pasta {images_dir} não encontrada!")
        return
    
    # Encontrar imagens
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    image_files = [
        f for f in os.listdir(images_dir)
        if os.path.isfile(os.path.join(images_dir, f)) and 
           any(f.lower().endswith(ext) for ext in image_extensions)
    ]
    
    if not image_files:
        print_warning("Nenhuma imagem encontrada em public/images")
        return
    
    print_info(f"Encontradas {len(image_files)} imagens para migrar:\n")
    for img in image_files:
        print(f"   • {img}")
    print()
    
    # Mapear imagens
    image_map = {}
    
    # Upload para Cloudinary
    print(f"{Colors.BOLD}📤 Uploading images...{Colors.ENDC}\n")
    
    for image_file in image_files:
        file_path = os.path.join(images_dir, image_file)
        local_path = f"/images/{image_file}"
        
        cloudinary_url = upload_to_cloudinary(file_path, image_file)
        if cloudinary_url:
            image_map[local_path] = cloudinary_url
    
    if not image_map:
        print_error("Nenhuma imagem foi enviada com sucesso!")
        return
    
    print(f"\n{Colors.GREEN}{len(image_map)} imagens enviadas com sucesso!{Colors.ENDC}\n")
    
    # Atualizar referências
    print(f"{Colors.BOLD}🔄 Atualizando referências nos arquivos...{Colors.ENDC}\n")
    
    source_files = find_source_files(project_root)
    updated_count = 0
    
    for file_path in source_files:
        if replace_image_references(file_path, image_map):
            updated_count += 1
    
    print(f"\n{Colors.GREEN}{updated_count} arquivos atualizados!{Colors.ENDC}\n")
    
    # Deletar imagens locais
    print(f"{Colors.BOLD}🗑️  Removendo imagens locais...{Colors.ENDC}\n")
    
    deleted_count = 0
    for image_file in image_files:
        file_path = os.path.join(images_dir, image_file)
        try:
            os.remove(file_path)
            print_success(f"Deletado: {image_file}")
            deleted_count += 1
        except Exception as e:
            print_error(f"Erro ao deletar {image_file}: {str(e)}")
    
    # Salvar mapeamento
    mapping_file = os.path.join(project_root, 'cloudinary-mapping.json')
    try:
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(image_map, f, indent=2)
        print_success(f"Mapeamento salvo em: cloudinary-mapping.json")
    except Exception as e:
        print_error(f"Erro ao salvar mapeamento: {str(e)}")
    
    # Resumo
    print(f"\n{Colors.BOLD}{Colors.GREEN}✨ Migração concluída com sucesso!{Colors.ENDC}\n")
    print(f"{Colors.BOLD}📊 Resumo:{Colors.ENDC}")
    print(f"   • Imagens enviadas: {len(image_map)}")
    print(f"   • Arquivos atualizados: {updated_count}")
    print(f"   • Imagens locais removidas: {deleted_count}")
    print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠ Migração cancelada pelo usuário{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Erro fatal: {str(e)}")
        sys.exit(1)
