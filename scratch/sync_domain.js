import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

let configContent = fs.readFileSync(path.join(workspaceRoot, 'src/config.js'), 'utf-8');

// Change siteUrl to production domain https://www.barumspace.co.kr
configContent = configContent.replace(
  "siteUrl: 'https://seoul-tansung-01.vercel.app',",
  "siteUrl: 'https://www.barumspace.co.kr',"
);

fs.writeFileSync(path.join(workspaceRoot, 'src/config.js'), configContent, 'utf-8');
console.log('Successfully synchronized domain in src/config.js');

