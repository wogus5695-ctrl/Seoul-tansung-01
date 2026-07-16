import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = "C:/Users/wogus/OneDrive/Desktop/★홈페이지 이미지/탄성코트,줄눈/바름공간/썸네일.png";
const destDir = path.join(__dirname, "../public/images/seo");
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}
const dest = path.join(destDir, "bareumgonggan-search-thumbnail-v1.png");

fs.copyFileSync(src, dest);
console.log("Copied thumbnail successfully to: " + dest);
