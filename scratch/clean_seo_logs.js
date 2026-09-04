import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

let seoFile = fs.readFileSync(path.join(workspaceRoot, 'api/seo.js'), 'utf-8');

// Strip all SEO.js Debug console.logs
seoFile = seoFile.replace(/^[ \t]*console\.log\('SEO\.js Debug:.*?\);\r?\n/gm, '');

fs.writeFileSync(path.join(workspaceRoot, 'api/seo.js'), seoFile, 'utf-8');
console.log('Cleaned up debug console logs in api/seo.js');

