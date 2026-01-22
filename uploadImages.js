import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import url from "url";

// ✅ Configuração do Cloudinary
cloudinary.config({
  cloud_name: "dzdyokoiv",
  api_key: "946726721337646",
  api_secret: "-j4ImyiKokwoyDuPn8QJNrh9hTw",
});

// ✅ Caminhos principais
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const linksFile = path.join(__dirname, "links.json");

// ✅ Função recursiva para listar todos os arquivos dentro da pasta (e subpastas)
function getAllImages(dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllImages(fullPath)); // entra nas subpastas
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)) {
      files.push(fullPath); // adiciona só imagens
    }
  }
  return files;
}

// ✅ Função para enviar imagem ao Cloudinary
async function uploadImage(filePath) {
  const folderName = "maddie_tavares";
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    console.log(`✅ Enviado: ${path.basename(filePath)} → ${result.secure_url}`);
    return { [path.relative(publicDir, filePath)]: result.secure_url };
  } catch (err) {
    console.error(`❌ Erro ao enviar ${filePath}:`, err.message);
    return null;
  }
}

// 🚀 Função principal
async function uploadAll() {
  const images = getAllImages(publicDir);
  console.log(`🔍 Encontradas ${images.length} imagens em ${publicDir}`);

  const uploaded = {};

  for (const img of images) {
    const result = await uploadImage(img);
    if (result) Object.assign(uploaded, result);
  }

  fs.writeFileSync(linksFile, JSON.stringify(uploaded, null, 2));
  console.log(`📁 Links salvos em: ${linksFile}`);
}

// 🏁 Executa
uploadAll();
