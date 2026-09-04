import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import source data
import { seoulRegions } from '../src/data/seoulRegions.js';
import { incheonRegions } from '../src/data/incheonRegions.js';
import { gyeonggiRegions } from '../src/data/gyeonggiRegions.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { getActiveRegions } from '../src/data/regionResolver.js';
import { siteConfig } from '../src/config.js';

const workspaceRoot = path.join(__dirname, '..');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(workspaceRoot, 'backup', `backup_${timestamp}`);

fs.mkdirSync(backupDir, { recursive: true });

console.log(`Backup directory created: ${backupDir}`);

// 1. Copy raw files
const filesToBackup = [
  'src/data/seoulRegions.js',
  'src/data/incheonRegions.js',
  'src/data/gyeonggiRegions.js',
  'src/data/serviceKeywords.js',
  'src/data/regionResolver.js',
  'src/config.js',
  'api/seo.js',
  'vercel.json',
  'scripts/generate-sitemap.js',
  'src/App.jsx'
];

filesToBackup.forEach(file => {
  const srcPath = path.join(workspaceRoot, file);
  const destPath = path.join(backupDir, file.replace(/\//g, '_'));
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to backup.`);
  } else {
    console.warn(`File not found: ${srcPath}`);
  }
});

// Write configurations as JSON for easy machine reading
fs.writeFileSync(path.join(backupDir, 'siteConfig.json'), JSON.stringify(siteConfig, null, 2), 'utf-8');
fs.writeFileSync(path.join(backupDir, 'serviceKeywords.json'), JSON.stringify(serviceKeywords, null, 2), 'utf-8');

// 2. Perform comparison analysis on ALL raw regions
const activeRegions = getActiveRegions();
const activeRegionMap = new Map(activeRegions.map(r => [r.id, r]));

// Check for duplicates in active regions
const nameCounts = {};
const urlCounts = {};
activeRegions.forEach(r => {
  const nameKey = `${r.metro}-${r.displayName}`;
  nameCounts[nameKey] = (nameCounts[nameKey] || 0) + 1;
  urlCounts[r.urlRegion] = (urlCounts[r.urlRegion] || 0) + 1;
});

const allRegions = [
  ...seoulRegions.map(r => ({ ...r, metro: '서울', city: '서울시', source: 'seoul' })),
  ...incheonRegions.map(r => ({ ...r, source: 'incheon' })),
  ...gyeonggiRegions.map(r => ({ ...r, source: 'gyeonggi' }))
];

const comparisonRows = [];

// Track statistics
let normalCount = 0;
let modifyCount = 0;
let missingCount = 0;
let longCount = 0;
let duplicateCount = 0;

// Set of expected Anyang Dongan-gu dongs to verify missing ones
const expectedDonganDongs = ['비산동', '부흥동', '달안동', '관양동', '평촌동', '평안동', '범계동', '신촌동', '갈산동', '호계동'];

allRegions.forEach(r => {
  // Determine ID
  let id = '';
  if (r.source === 'seoul') {
    id = `seoul-${r.displayName}`;
  } else if (r.source === 'incheon') {
    id = r.regionType === 'district' ? `incheon-${r.groupName}` : `incheon-${r.groupName}-${r.officialName}`;
  } else {
    id = r.regionType === 'district' ? `gyeonggi-${r.officialName}` : `gyeonggi-${r.city}-${r.groupName || ''}-${r.officialName}`;
  }

  const isActive = activeRegionMap.has(id);
  const parent = r.regionType === 'district' ? r.metro : (r.groupName || r.districtName || r.city);

  // 12 Service Keywords
  serviceKeywords.forEach(tk => {
    // Current state
    const currentKeyword = `${r.displayName} ${tk.keyword}`;
    const currentUrlRegion = r.slugKey || r.displayName || '';
    const currentUrl = `https://www.barumspace.co.kr/?k=${encodeURIComponent(currentUrlRegion + '-' + tk.keyword)}`;

    // Flags
    let isNormal = isActive;
    let isMissing = false;
    let isDuplicate = false;
    let isLong = false;
    let needsModification = false;

    // Check long keyword
    const parentStem = parent ? parent.replace(/구$/, '').replace(/시$/, '') : '';
    if (r.regionType === 'dong' && parentStem && r.displayName.startsWith(parentStem) && r.displayName !== parent && r.displayName !== parentStem) {
      isLong = true;
    }

    // Check duplicate
    const nameKey = `${r.metro}-${r.displayName}`;
    if (nameCounts[nameKey] > 1 || urlCounts[currentUrlRegion] > 1) {
      isDuplicate = true;
    }

    // Determine missing status
    // (If the region is inactive, it's considered missing from the active list/hub)
    if (!isActive) {
      isMissing = true;
      isNormal = false;
    }

    // If it's a long keyword, is duplicate, or is inactive/missing, it needs modification
    if (isLong || isDuplicate || !isActive) {
      needsModification = true;
    }

    // Calculate expected normal keyword and URL
    // If it is long (e.g. '부평 구산동'), expected displayName should strip parentStem
    let expectedDisplayName = r.displayName;
    let expectedSlugKey = r.slugKey;
    if (isLong) {
      // Remove prefix of parent (e.g. "부평 구산동" -> "구산동")
      expectedDisplayName = r.displayName.substring(parentStem.length).trim();
      const parentGroupClean = (r.groupName || r.districtName || '').replace(/구$/, '');
      expectedSlugKey = r.slugKey
        .replace(new RegExp(`^${parentStem}-`), '')
        .replace(new RegExp(`^${parentGroupClean}-`), '');
    }

    const expectedNormalKeyword = `${expectedDisplayName} ${tk.keyword}`;
    const expectedNormalUrl = `https://www.barumspace.co.kr/?k=${encodeURIComponent(expectedSlugKey + '-' + tk.keyword)}`;

    // Statistics increment
    if (isNormal && !needsModification) {
      normalCount++;
    } else {
      modifyCount++;
      if (isMissing) missingCount++;
      if (isLong) longCount++;
      if (isDuplicate) duplicateCount++;
    }

    comparisonRows.push({
      originalRegionName: r.displayName,
      officialName: r.officialName,
      regionType: r.regionType,
      parentRegion: parent,
      currentKeyword,
      currentUrl,
      isNormal,
      isMissing,
      isDuplicate,
      isLong,
      needsModification,
      expectedNormalKeyword,
      expectedNormalUrl
    });
  });
});

// Also manually add completely missing expected Anyang Dongan-gu dongs to comparison rows!
expectedDonganDongs.forEach(ed => {
  const existsInRaw = gyeonggiRegions.some(r => r.city === '안양시' && r.groupName === '동안구' && (r.displayName === ed || r.officialName === ed));
  if (!existsInRaw) {
    serviceKeywords.forEach(tk => {
      comparisonRows.push({
        originalRegionName: ed,
        officialName: ed,
        regionType: 'dong',
        parentRegion: '동안구',
        currentKeyword: `(누락) ${ed} ${tk.keyword}`,
        currentUrl: 'N/A',
        isNormal: false,
        isMissing: true,
        isDuplicate: false,
        isLong: false,
        needsModification: true,
        expectedNormalKeyword: `${ed} ${tk.keyword}`,
        expectedNormalUrl: `https://www.barumspace.co.kr/?k=${encodeURIComponent(ed + '-' + tk.keyword)}`
      });
      modifyCount++;
      missingCount++;
    });
  }
});

// Save the full comparison rows to a JSON file
fs.writeFileSync(path.join(backupDir, 'comparison_table.json'), JSON.stringify(comparisonRows, null, 2), 'utf-8');

console.log('--- COMPILATION STATS ---');
console.log(`Normal count: ${normalCount}`);
console.log(`Modify count: ${modifyCount}`);
console.log(`Missing count (filtered out or raw missing): ${missingCount}`);
console.log(`Long count: ${longCount}`);
console.log(`Duplicate count: ${duplicateCount}`);

// Export CSV for Excel import
const headers = [
  '현재 지역명', '지역 유형', '상위 지역', '현재 키워드', '현재 URL',
  '정상 여부', '누락 여부', '중복 여부', '긴 키워드 여부',
  '수정 예정 여부', '예상 정상 키워드', '예상 정상 URL'
];
const csvRows = [headers.join(',')];
comparisonRows.forEach(row => {
  const line = [
    row.originalRegionName,
    row.regionType,
    row.parentRegion,
    row.currentKeyword,
    row.currentUrl,
    row.isNormal ? 'Y' : 'N',
    row.isMissing ? 'Y' : 'N',
    row.isDuplicate ? 'Y' : 'N',
    row.isLong ? 'Y' : 'N',
    row.needsModification ? 'Y' : 'N',
    row.expectedNormalKeyword,
    row.expectedNormalUrl
  ].map(val => `"${val.replace(/"/g, '""')}"`);
  csvRows.push(line.join(','));
});
fs.writeFileSync(path.join(backupDir, 'comparison_table.csv'), csvRows.join('\n'), 'utf-8');

// Print samples to verify
console.log('Sample rows generated: ', comparisonRows.length);
// Write stats summary file
const statsSummary = {
  timestamp,
  backupLocation: backupDir,
  normalCount,
  modifyCount,
  missingCount,
  longCount,
  duplicateCount,
  totalRows: comparisonRows.length
};
fs.writeFileSync(path.join(backupDir, 'stats_summary.json'), JSON.stringify(statsSummary, null, 2), 'utf-8');

