import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const oldPath = path.join(distDir, 'index.html');
const newPath = path.join(distDir, 'app.html');

if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Successfully renamed dist/index.html to dist/app.html for Vercel bypass.');
} else {
  console.error('dist/index.html not found! Rename process skipped.');
}
