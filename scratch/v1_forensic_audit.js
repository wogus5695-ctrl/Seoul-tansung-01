import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { parseAndValidateK, getActiveRegions, getAllowedServicesForRegion } from '../src/data/regionResolver.js';
import { thumbnailTestMap } from '../src/data/thumbnailTestMap.js';

function runGit(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

console.log('=== HISTORICAL V1 ASSET & HEAD FORENSIC AUDIT ===\n');

// 1. Git object for v1.jpg
const v1CommitIntro = 'c342b9f';
const v1CommitLast = 'eac1ed1';
let v1GitSha = '';
let v1Buf = null;

try {
  const treeLine = runGit(`git ls-tree -r ${v1CommitIntro} -- "public/images/seo/bareumgonggan-search-thumbnail-v1.jpg"`);
  v1GitSha = treeLine.split(/\s+/)[2];
  v1Buf = execSync(`git cat-file -p ${v1GitSha}`);
} catch (err) {
  console.error('Error fetching v1 git object:', err);
}

const v1Hash = v1Buf ? crypto.createHash('sha256').update(v1Buf).digest('hex') : 'N/A';
const v1Size = v1Buf ? v1Buf.length : 0;

console.log(`Historical v1 Asset (Commit ${v1CommitIntro}):`);
console.log(`  Path:           public/images/seo/bareumgonggan-search-thumbnail-v1.jpg`);
console.log(`  Git Object Hash:${v1GitSha}`);
console.log(`  Byte Size:      ${v1Size} bytes`);
console.log(`  SHA256 Hash:    ${v1Hash}`);
console.log(`  Intro Commit:   ${v1CommitIntro} (feat: integrate dynamic search thumbnail v1 metadata...)`);
console.log(`  Last Use Commit:${v1CommitLast} (fix: convert body img tags... rename to v2)`);
console.log('');

// 2. Compare with User Master and Current v2
const artifactMasterPath = 'C:/Users/wogus/.gemini/antigravity/brain/5f11e682-0af4-4370-b938-e8f058e47ca5/media__1788324581147.jpg';
const userMasterBuf = fs.existsSync(artifactMasterPath) ? fs.readFileSync(artifactMasterPath) : null;
const userMasterHash = userMasterBuf ? crypto.createHash('sha256').update(userMasterBuf).digest('hex') : 'N/A';
const userMasterSize = userMasterBuf ? userMasterBuf.length : 0;

const currentV2Path = path.join(process.cwd(), 'public/images/seo/bareumgonggan-search-thumbnail-v2.jpg');
const v2Buf = fs.readFileSync(currentV2Path);
const v2Hash = crypto.createHash('sha256').update(v2Buf).digest('hex');
const v2Size = v2Buf.length;

console.log('--- 3-Way Asset SHA256 & Dimension Comparison ---');
console.log(`A. User Master Image (media__1788324581147.jpg):`);
console.log(`   Size: ${userMasterSize} bytes | SHA256: ${userMasterHash}`);
console.log(`B. Historical v1 Image (Git ${v1CommitIntro}):`);
console.log(`   Size: ${v1Size} bytes | SHA256: ${v1Hash}`);
console.log(`C. Current v2 Image (public/images/seo/):`);
console.log(`   Size: ${v2Size} bytes | SHA256: ${v2Hash}`);
console.log('');

// 3. Code evidence of v1 in api/seo.js in commit c342b9f
console.log('--- Historical HEAD Metadata Code Evidence in Commit c342b9f ---');
try {
  const seoJsV1 = runGit(`git show ${v1CommitIntro}:api/seo.js`);
  const ogImgLine = (seoJsV1.match(/<meta property="og:image".*?\/>/gi) || [])[0] || 'NONE';
  const imgSrcLine = (seoJsV1.match(/<link rel="image_src".*?\/>/gi) || [])[0] || 'NONE';
  const jsonLdImgLine = (seoJsV1.match(/"image":\s*".*?"/gi) || [])[0] || 'NONE';
  console.log(`  og:image tag in api/seo.js:    ${ogImgLine}`);
  console.log(`  image_src tag in api/seo.js:   ${imgSrcLine}`);
  console.log(`  JSON-LD image tag in api/seo.js:${jsonLdImgLine}`);
} catch (err) {
  console.error('Error reading commit c342b9f api/seo.js:', err);
}
console.log('');

// 4. Select 10+ CLEAN candidate URLs
console.log('==================================================');
console.log('5. 10+ CLEAN CANDIDATE URL SELECTION');
console.log('==================================================\n');

const activeRegions = getActiveRegions();
const cleanCandidates = [];

// Exclude keywords with previous thumbnail tests
const excludedKeywords = new Set([
  '개봉동-탄성코트', '삼성동-탄성코트', '개봉동-세탁실탄성코트',
  '남현동-탄성코트시공', '공릉동-탄성코트업체', '이문동-탄성코트업체',
  '천호동-탄성코트', '천호동-세탁실탄성코트', '대치동-탄성코트',
  '원동-탄성코트', '오산동-탄성코트', '부산동-탄성코트'
]);

for (const reg of activeRegions) {
  // Focus on recently added Gyeonggi / Incheon regions for lower prior index history probability
  if (reg.id.startsWith('gyeonggi-') || reg.id.startsWith('incheon-')) {
    const services = getAllowedServicesForRegion(reg);
    for (const s of services) {
      const kParam = `${reg.urlRegion}-${s.keyword}`;
      if (!excludedKeywords.has(kParam) && !thumbnailTestMap[kParam]) {
        cleanCandidates.push({
          kParam,
          fullUrl: `https://www.barumspace.co.kr/?k=${encodeURIComponent(kParam)}`,
          regionName: reg.name,
          serviceName: s.keyword
        });
        if (cleanCandidates.length >= 15) break;
      }
    }
  }
  if (cleanCandidates.length >= 15) break;
}

console.log(`Found ${cleanCandidates.length} CLEAN Candidate URLs from recent Gyeonggi/Incheon expansion:`);
cleanCandidates.forEach((c, idx) => {
  console.log(`${idx + 1}. ?k=${c.kParam}`);
  console.log(`   Full URL: ${c.fullUrl}`);
  console.log(`   Status:   USER SEARCHADVISOR CHECK REQUIRED`);
  console.log('');
});
