#!/usr/bin/env python3
"""
Script de Migração de Imagens para Cloudinary - VERSÃO FINAL
Migra todas as imagens para Cloudinary e atualiza referências no projeto
"""

import os
import json
import re
import sys
from pathlib import Path

# Tentar importar requests, se não existir, pedir para instalar
try:
    import requests
    from requests.auth import HTTPBasicAuth
except ImportError:
    print("❌ Erro: O pacote 'requests' não está instalado")
    print("\nPara instalar, execute:")
    print("  pip install requests")
    sys.exit(1)

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

def print_header(msg):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{msg}{Colors.ENDC}\n")

def upload_to_cloudinary(file_path, file_name):
    """Upload de imagem para o Cloudinary usando upload preset não assinado"""
    try:
        url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CONFIG['cloud_name']}/image/upload"
        
        # Ler arquivo
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {
                'api_key': CLOUDINARY_CONFIG['api_key'],
                'folder': 'maddietavares',
                'tags': 'website,maddietavares'
            }
            
            print_info(f"Uploading: {file_name}...")
            response = requests.post(url, files=files, data=data, timeout=60)
            
            if response.status_code == 401:
                print_error("Erro 401: Autenticação falhou. Tentando com api_secret...")
                # Tentar com autenticação básica
                from requests.auth import HTTPBasicAuth
                response = requests.post(
                    url, 
                    files={'file': open(file_path, 'rb')},
                    data=data,
                    auth=HTTPBasicAuth(
                        CLOUDINARY_CONFIG['api_key'],
                        CLOUDINARY_CONFIG['api_secret']
                    ),
                    timeout=60
                )
            
            if response.status_code == 400:
                # Tentar sem api_key mas com dados autenticados
                data_auth = {
                    'timestamp': str(int(__import__('time').time())),
                    'folder': 'maddietavares',
                    'tags': 'website,maddietavares'
                }
                
                # Gerar assinatura
                import hashlib
                param_string = '&'.join([f"{k}={v}" for k, v in sorted(data_auth.items())])
                signature_string = f"{param_string}{CLOUDINARY_CONFIG['api_secret']}"
                signature = hashlib.sha1(signature_string.encode()).hexdigest()
                
                data_auth['api_key'] = CLOUDINARY_CONFIG['api_key']
                data_auth['signature'] = signature
                
                with open(file_path, 'rb') as f:
                    response = requests.post(url, files={'file': f}, data=data_auth, timeout=60)
            
            response.raise_for_status()
            
            result = response.json()
            
            if 'secure_url' in result:
                print_success(f"{file_name} → {result['secure_url']}")
                return result['secure_url']
            elif 'error' in result:
                error_msg = result['error'].get('message', str(result['error']))
                print_error(f"Cloudinary error: {error_msg}")
                print_error(f"Response: {result}")
                return None
            else:
                print_error(f"Unexpected response: {result}")
                return None
                
    except requests.exceptions.Timeout:
        print_error(f"Timeout ao fazer upload de {file_name} (arquivo muito grande?)")
        return None
    except requests.exceptions.ConnectionError:
        print_error(f"Erro de conexão ao fazer upload de {file_name}")
        return None
    except requests.exceptions.RequestException as e:
        print_error(f"Erro ao fazer upload de {file_name}: {str(e)}")
        return None
    except Exception as e:
        print_error(f"Erro inesperado ao fazer upload de {file_name}: {str(e)}")
        return None

def find_source_files(root_dir, extensions=None):
    """Procura por arquivos de código fonte"""
    if extensions is None:
        extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.md']
    
    source_files = []
    exclude_dirs = {
        'node_modules', '.next', '.git', 'public', '.azure', '.vscode',
        '.vercel', 'dist', 'build', 'out', '.turbo'
    }
    
    try:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Remover diretórios que devem ser ignorados
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
            
            for filename in filenames:
                if any(filename.endswith(ext) for ext in extensions):
                    source_files.append(os.path.join(dirpath, filename))
    except PermissionError as e:
        print_warning(f"Permissão negada ao acessar: {dirpath}")
    
    return source_files

def replace_image_references(file_path, image_map):
    """Substitui referências de imagens no arquivo"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        for local_path, cloudinary_url in image_map.items():
            # Padrões de busca
            patterns = [
                (f'"{local_path}"', f'"{cloudinary_url}"'),
                (f"'{local_path}'", f"'{cloudinary_url}'"),
                (f'`{local_path}`', f'`{cloudinary_url}`'),
                (f'url({local_path})', f'url("{cloudinary_url}")'),
                (f'url("{local_path}")', f'url("{cloudinary_url}")'),
                (f"url('{local_path}')", f"url('{cloudinary_url}')"),
            ]
            
            for pattern, replacement in patterns:
                if pattern in content:
                    content = content.replace(pattern, replacement)
                    modified = True
        
        # Salvar se houve mudanças
        if modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except PermissionError:
        print_warning(f"Permissão negada para ler/escrever: {file_path}")
        return False
    except Exception as e:
        print_error(f"Erro ao atualizar {file_path}: {str(e)}")
        return False

def get_file_size_mb(file_path):
    """Retorna tamanho do arquivo em MB"""
    try:
        return os.path.getsize(file_path) / (1024 * 1024)
    except:
        return 0

def find_all_images(public_dir):
    """Encontra todas as imagens recursivamente em /public"""
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico']
    image_files = {}
    
    try:
        for dirpath, dirnames, filenames in os.walk(public_dir):
            for filename in filenames:
                if any(filename.lower().endswith(ext) for ext in image_extensions):
                    full_path = os.path.join(dirpath, filename)
                    # Caminho relativo a partir de /public
                    rel_path = os.path.relpath(full_path, public_dir)
                    image_files[rel_path] = full_path
    except Exception as e:
        print_error(f"Erro ao listar imagens: {str(e)}")
        return {}
    
    return image_files

def main():
    """Função principal"""
    print_header("🚀 Migração de Imagens para Cloudinary")
    
    # Obter diretório do projeto
    project_root = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(project_root, 'public')
    
    print_info(f"Cloud Name: {CLOUDINARY_CONFIG['cloud_name']}")
    print_info(f"API Key: {CLOUDINARY_CONFIG['api_key'][:10]}...")
    print_info(f"Projeto: {project_root}")
    print_info(f"Pasta pública: {public_dir}\n")
    
    # Verificar se diretório existe
    if not os.path.exists(public_dir):
        print_error(f"Pasta {public_dir} não encontrada!")
        return False
    
    # Encontrar todas as imagens recursivamente
    image_files = find_all_images(public_dir)
    
    if not image_files:
        print_warning("Nenhuma imagem encontrada em /public")
        return False
    
    if not image_files:
        print_warning("Nenhuma imagem encontrada em /public")
        return False
    
    print_header(f"📷 Encontradas {len(image_files)} imagens em /public")
    
    total_size = 0
    for rel_path in sorted(image_files.keys()):
        full_path = image_files[rel_path]
        size = get_file_size_mb(full_path)
        total_size += size
        print(f"   • {rel_path:<45} ({size:.2f} MB)")
    
    print(f"\n   Total: {total_size:.2f} MB\n")
    
    # Confirmar
    response = input(f"{Colors.BOLD}Deseja continuar? (s/n): {Colors.ENDC}").strip().lower()
    if response not in ['s', 'sim', 'y', 'yes']:
        print_warning("Migração cancelada")
        return False
    
    # Mapear imagens
    image_map = {}
    
    # Upload para Cloudinary
    print_header("📤 Enviando imagens para Cloudinary...")
    
    sorted_images = sorted(image_files.items())
    for i, (rel_path, full_path) in enumerate(sorted_images, 1):
        # Converter caminho para URL (ex: images/logo.png -> /images/logo.png)
        url_path = f"/{rel_path.replace(os.sep, '/')}"
        
        print(f"[{i}/{len(sorted_images)}] ", end='')
        cloudinary_url = upload_to_cloudinary(full_path, rel_path)
        
        if cloudinary_url:
            image_map[url_path] = cloudinary_url
        else:
            print_warning(f"Pulando {rel_path}")
    
    if not image_map:
        print_error("Nenhuma imagem foi enviada com sucesso!")
        return False
    
    print_success(f"\n{len(image_map)} de {len(sorted_images)} imagens enviadas com sucesso!")
    
    # Atualizar referências
    print_header("🔄 Atualizando referências nos arquivos...")
    
    source_files = find_source_files(project_root)
    updated_files = []
    
    for file_path in source_files:
        if replace_image_references(file_path, image_map):
            updated_files.append(file_path)
            print_success(f"Atualizado: {os.path.relpath(file_path, project_root)}")
    
    if not updated_files:
        print_warning("Nenhum arquivo foi atualizado (referências não encontradas)")
    else:
        print_success(f"\n{len(updated_files)} arquivo(s) atualizado(s)!")
    
    # Deletar imagens locais
    print_header("🗑️  Removendo imagens locais...")
    
    deleted_count = 0
    failed_delete = []
    for rel_path, full_path in sorted_images:
        try:
            os.remove(full_path)
            print_success(f"Deletado: {rel_path}")
            deleted_count += 1
        except PermissionError:
            print_warning(f"Sem permissão para deletar: {rel_path}")
            failed_delete.append(rel_path)
        except Exception as e:
            print_error(f"Erro ao deletar {rel_path}: {str(e)}")
            failed_delete.append(rel_path)
    
    # Salvar mapeamento
    mapping_file = os.path.join(project_root, 'cloudinary-mapping.json')
    try:
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(image_map, f, indent=2, ensure_ascii=False)
        print_success(f"Mapeamento salvo em: cloudinary-mapping.json")
    except Exception as e:
        print_error(f"Erro ao salvar mapeamento: {str(e)}")
    
    # Resumo
    print_header("✨ Migração concluída com sucesso!")
    
    print(f"{Colors.BOLD}📊 Resumo Final:{Colors.ENDC}")
    print(f"   • Imagens enviadas: {len(image_map)}")
    print(f"   • Arquivos atualizados: {len(updated_files)}")
    print(f"   • Imagens deletadas: {deleted_count}")
    if failed_delete:
        print(f"   • Falhas ao deletar: {len(failed_delete)}")
        for img in failed_delete:
            print(f"     - {img}")
    print(f"   • Espaço liberado: {total_size:.2f} MB\n")
    
    return True

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠ Migração cancelada pelo usuário{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print_error(f"Erro fatal: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
