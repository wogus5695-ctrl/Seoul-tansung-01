import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';

function runGit(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

console.log('=== HISTORICAL ASSETS FORENSIC AUDIT ===\n');

// Get all files ever committed in public/images
const filesOutput = runGit('git log --pretty=format: --name-only -- "public/images*"');
const fileSet = new Set(filesOutput.split(/\r?\n/).map(s => s.trim()).filter(Boolean));

console.log('Historical Image Files found in git history:');
for (const f of fileSet) {
  console.log(` - ${f}`);
}

console.log('\n--- Checking current public/images directory ---');
function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = `${dir}/${file}`;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const currentImages = walkDir('public/images');
for (const imgPath of currentImages) {
  const buf = fs.readFileSync(imgPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  console.log(`File: ${imgPath}`);
  console.log(`  Size: ${buf.length} bytes`);
  console.log(`  SHA256: ${hash}`);
}
