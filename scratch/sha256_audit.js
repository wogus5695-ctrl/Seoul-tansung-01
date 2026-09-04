import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function runGit(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function getSha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return {
    hash: crypto.createHash('sha256').update(buf).digest('hex'),
    size: buf.length
  };
}

console.log('=== SHA256 CORRELATION AUDIT ===\n');

const artifactDir = 'C:/Users/wogus/.gemini/antigravity/brain/5f11e682-0af4-4370-b938-e8f058e47ca5';
const currentV2Path = path.join(process.cwd(), 'public/images/seo/bareumgonggan-search-thumbnail-v2.jpg');

// Current v2
const currentV2Info = getSha256(currentV2Path);
console.log(`Current v2.jpg in Repo:`);
console.log(`  Path:   ${currentV2Path}`);
console.log(`  Size:   ${currentV2Info.size} bytes`);
console.log(`  SHA256: ${currentV2Info.hash}\n`);

// User attached images in artifact directory
console.log('--- User Attached Media Files in Artifact Directory ---');
const files = fs.readdirSync(artifactDir);
for (const f of files) {
  if (f.startsWith('media__') && (f.endsWith('.jpg') || f.endsWith('.png'))) {
    const fp = path.join(artifactDir, f);
    const info = getSha256(fp);
    const stat = fs.statSync(fp);
    console.log(`File: ${f}`);
    console.log(`  mtime:  ${stat.mtime.toISOString()}`);
    console.log(`  Size:   ${info.size} bytes`);
    console.log(`  SHA256: ${info.hash}`);
    console.log(`  Matches current v2.jpg? ${info.hash === currentV2Info.hash ? 'YES (EXACT MATCH)' : 'NO'}`);
    console.log('');
  }
}

console.log('--- Historical Thumbnail Objects in Git History ---');
// Extract git commits that touched public/images/seo/
const gitCommits = runGit('git log --pretty=format:"%h %s" -- "public/images/seo/"').split('\n');
for (const line of gitCommits) {
  console.log(`Commit: ${line}`);
}

// Check git objects for bareumgonggan-search-thumbnail-v1.jpg, v1.png, v2.jpg, v2.png across git revisions
const revisions = ['c342b9f', 'eac1ed1', '707496e', '8151e15', 'HEAD'];
for (const rev of revisions) {
  try {
    const gitFiles = runGit(`git ls-tree -r ${rev} -- "public/images/seo/"`).split('\n');
    for (const gf of gitFiles) {
      if (!gf) continue;
      const parts = gf.split(/\s+/);
      const mode = parts[0];
      const type = parts[1];
      const objectHash = parts[2];
      const filePath = parts[3];

      // Extract raw binary object content from git
      const rawBuf = execSync(`git cat-file -p ${objectHash}`);
      const sha256 = crypto.createHash('sha256').update(rawBuf).digest('hex');

      console.log(`[Rev: ${rev}] File: ${filePath}`);
      console.log(`  Git Object: ${objectHash}`);
      console.log(`  Size:       ${rawBuf.length} bytes`);
      console.log(`  SHA256:     ${sha256}`);
      console.log(`  Matches current v2.jpg? ${sha256 === currentV2Info.hash ? 'YES' : 'NO'}`);
      console.log('');
    }
  } catch (err) {
    // ignore missing rev
  }
}
