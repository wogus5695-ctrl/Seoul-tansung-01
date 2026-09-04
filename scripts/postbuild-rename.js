import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const oldPath = path.join(distDir, 'index.html');
const newPath = path.join(distDir, 'app.html');

if (fs.existsSync(oldPath)) {
  fs.copyFileSync(oldPath, newPath);
  console.log('Successfully copied dist/index.html to dist/app.html for Vercel static parity.');
} else {
  console.error('dist/index.html not found! Copy process skipped.');
}
