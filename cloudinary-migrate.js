#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const querystring = require('querystring');

// Credenciais do Cloudinary
const CLOUDINARY_CONFIG = {
  cloud_name: 'Root',
  api_key: '448678499645981',
  api_secret: 'L0TE9oujJYzGgug5ujKIH8JzZ3s'
};

// Mapeamento de imagens locais para URLs do Cloudinary
const imageMap = new Map();

// Função para fazer upload para Cloudinary
async function uploadToCloudinary(filePath, fileName) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    const formData = new FormData();
    formData.append('file', fileStream);
    formData.append('upload_preset', 'maddietavares_preset');

    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
      method: 'POST',
      headers: formData.getHeaders?.() || {
        'Content-Type': 'multipart/form-data'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.secure_url) {
            console.log(`✓ Upload bem-sucedido: ${fileName} -> ${response.secure_url}`);
            resolve(response.secure_url);
          } else {
            reject(new Error(`Erro no upload: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Erro ao fazer parse da resposta: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    fileStream.pipe(req);
  });
}

// Versão simplificada usando curl (mais confiável)
function uploadToCloudinaryCurl(filePath, fileName) {
  return new Promise((resolve, reject) => {
    const { execSync } = require('child_process');

    try {
      const uploadUrl = `https://${CLOUDINARY_CONFIG.api_key}:${CLOUDINARY_CONFIG.api_secret}@api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`;

      const command = `curl -X POST "${uploadUrl}" -F "file=@${filePath}"`;

      const output = execSync(command, { encoding: 'utf-8' });
      const response = JSON.parse(output);

      if (response.secure_url) {
        console.log(`✓ Upload bem-sucedido: ${fileName} -> ${response.secure_url}`);
        resolve(response.secure_url);
      } else {
        reject(new Error(`Erro no upload: ${JSON.stringify(response)}`));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Função para procurar arquivos com extensão de imagem
function findImageReferences(dir, results = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // Ignorar pastas específicas
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'public'].includes(file)) {
        findImageReferences(fullPath, results);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      results.push(fullPath);
    }
  });

  return results;
}

// Função para substituir referências de imagens nos arquivos
async function replaceImageReferences(filePath, imageMap) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  imageMap.forEach((cloudinaryUrl, localPath) => {
    const regex = new RegExp(`["']${localPath}["']`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `"${cloudinaryUrl}"`);
      modified = true;
      console.log(`✓ Atualizado em ${path.basename(filePath)}: ${localPath} -> ${cloudinaryUrl}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  return modified;
}

// Função principal
async function migrateImages() {
  console.log('🚀 Iniciando migração de imagens para Cloudinary...\n');
  console.log(`📁 Nuvem: ${CLOUDINARY_CONFIG.cloud_name}`);
  console.log(`🔑 API Key: ${CLOUDINARY_CONFIG.api_key}\n`);

  const imagesDir = path.join(__dirname, 'public', 'images');

  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Pasta public/images não encontrada!');
    return;
  }

  const imageFiles = fs.readdirSync(imagesDir).filter(
    (file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
  );

  console.log(`📷 Encontradas ${imageFiles.length} imagens para migrar:\n`);

  // Upload para Cloudinary
  for (const imageFile of imageFiles) {
    const filePath = path.join(imagesDir, imageFile);
    const localPath = `/images/${imageFile}`;

    try {
      console.log(`⏳ Fazendo upload: ${imageFile}...`);
      // Usar curl para upload
      const cloudinaryUrl = await uploadToCloudinaryCurl(filePath, imageFile);
      imageMap.set(localPath, cloudinaryUrl);
    } catch (error) {
      console.error(`❌ Erro ao fazer upload de ${imageFile}:`, error.message);
    }
  }

  if (imageMap.size === 0) {
    console.log('❌ Nenhuma imagem foi enviada com sucesso!');
    return;
  }

  console.log(`\n✅ ${imageMap.size} imagens enviadas com sucesso!\n`);
  console.log('🔄 Atualizando referências nos arquivos do projeto...\n');

  // Encontrar e atualizar arquivos
  const sourceFiles = findImageReferences(path.join(__dirname, 'app')) ||
    findImageReferences(path.join(__dirname, 'components'));

  let updatedCount = 0;
  for (const filePath of sourceFiles) {
    if (await replaceImageReferences(filePath, imageMap)) {
      updatedCount++;
    }
  }

  console.log(`\n✅ ${updatedCount} arquivos atualizados!\n`);

  // Deletar imagens locais
  console.log('🗑️  Removendo imagens locais...\n');
  for (const imageFile of imageFiles) {
    const filePath = path.join(imagesDir, imageFile);
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deletado: ${imageFile}`);
    } catch (error) {
      console.error(`❌ Erro ao deletar ${imageFile}:`, error.message);
    }
  }

  // Salvar mapeamento para referência
  const mappingFile = path.join(__dirname, 'cloudinary-mapping.json');
  const mapping = {};
  imageMap.forEach((url, local) => {
    mapping[local] = url;
  });

  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
  console.log(`\n📝 Mapeamento salvo em: cloudinary-mapping.json`);

  console.log('\n✨ Migração concluída com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - Imagens enviadas: ${imageMap.size}`);
  console.log(`   - Arquivos atualizados: ${updatedCount}`);
  console.log(`   - Imagens locais removidas: ${imageFiles.length}`);
}

// Executar
migrateImages().catch((error) => {
  console.error('❌ Erro fatal:', error.message);
  process.exit(1);
});
