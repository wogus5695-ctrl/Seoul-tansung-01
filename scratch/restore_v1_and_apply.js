import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

console.log('=== RESTORING HISTORICAL V1 ASSET BYTE-FOR-BYTE ===\n');

const gitObjSha = '645419e74dea4da1834a896719558d6a26122c7d';
const targetPath = path.join(process.cwd(), 'public/images/seo/bareumgonggan-search-thumbnail-v1.jpg');

try {
  const v1Buf = execSync(`git cat-file -p ${gitObjSha}`);
  fs.writeFileSync(targetPath, v1Buf);
  
  const hash = crypto.createHash('sha256').update(v1Buf).digest('hex');
  console.log(`Saved: ${targetPath}`);
  console.log(`Size:   ${v1Buf.length} bytes`);
  console.log(`SHA256: ${hash}`);
  
  const expectedHash = 'eadf6dc9e1667c20010ee6df65895b1d94498bed55e3fa57bb924a0619dce86b';
  const expectedSize = 389141;

  if (v1Buf.length === expectedSize && hash === expectedHash) {
    console.log('VERIFICATION: PASS (Byte-for-byte EXACT MATCH to Git Commit c342b9f)');
  } else {
    console.error('VERIFICATION: FAIL - Mismatch!');
  }
} catch (err) {
  console.error('Error extracting v1 image from git:', err);
}
