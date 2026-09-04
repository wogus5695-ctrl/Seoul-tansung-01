import fs from 'fs';
import path from 'path';

// Let's write a simple binary parser for JPEG to read the SOF0/SOF2 marker for width/height
function getJpgDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  let i = 2; // skip SOI
  while (i < buffer.length) {
    const marker = buffer.readUInt16BE(i);
    i += 2;
    if (marker === 0xFFD8) continue; // SOI
    if (marker === 0xFFD9) break; // EOI
    
    const length = buffer.readUInt16BE(i);
    if (marker >= 0xFFC0 && marker <= 0xFFC3) {
      // SOF0 - SOF3 (Start Of Frame markers containing width and height)
      const height = buffer.readUInt16BE(i + 3);
      const width = buffer.readUInt16BE(i + 5);
      return { width, height, size: buffer.length };
    }
    i += length;
  }
  return { width: 0, height: 0, size: buffer.length };
}

const files = [
  'media__1787622216064.jpg',
  'media__1787622216358.jpg',
  'media__1787622216382.jpg'
];

const brainDir = 'C:/Users/wogus/.gemini/antigravity/brain/5f11e682-0af4-4370-b938-e8f058e47ca5';

for (const f of files) {
  const p = path.join(brainDir, f);
  if (fs.existsSync(p)) {
    const info = getJpgDimensions(p);
    console.log(`${f} -> Width: ${info.width}, Height: ${info.height}, Size: ${info.size} bytes`);
  } else {
    console.log(`${f} does not exist`);
  }
}
