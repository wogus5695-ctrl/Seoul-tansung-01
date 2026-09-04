import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function getJpgDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (filePath.endsWith('.png')) {
    // PNG dimensions at byte 16-24
    if (buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, size: buffer.length };
    }
  } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
    let i = 2;
    while (i < buffer.length) {
      const marker = buffer.readUInt16BE(i);
      i += 2;
      if (marker === 0xFFD8) continue;
      if (marker === 0xFFD9) break;
      const length = buffer.readUInt16BE(i);
      if (marker >= 0xFFC0 && marker <= 0xFFC3) {
        const height = buffer.readUInt16BE(i + 3);
        const width = buffer.readUInt16BE(i + 5);
        return { width, height, size: buffer.length };
      }
      i += length;
    }
  }
  return { width: 0, height: 0, size: buffer.length };
}

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir);

console.log('=== PUBLIC ROOT IMAGES AUDIT ===\n');

for (const f of files) {
  const fp = path.join(publicDir, f);
  if (fs.statSync(fp).isFile()) {
    const ext = path.extname(f).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      const dim = getJpgDimensions(fp);
      const hash = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
      console.log(`File: /${f}`);
      console.log(`  Dimensions: ${dim.width} × ${dim.height}`);
      console.log(`  Size: ${dim.size} bytes`);
      console.log(`  SHA256: ${hash}`);
      console.log('');
    }
  }
}
