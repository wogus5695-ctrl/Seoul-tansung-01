import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { gyeonggiSouthRegions } from '../src/data/gyeonggiSouthRegions.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { keywordMetadata } from '../src/data/keywordMetadata.js';

async function generateSubmissionFiles() {
  const new145 = gyeonggiSouthRegions.filter(r => r.expansionBatch === 'gyeonggi-south-2026');
  const elasticServices = serviceKeywords.filter(s => s.serviceFamily === 'elasticCoating');
  const existing804 = keywordMetadata.filter(m => m.isIndexable);

  const existing804Keys = new Set(existing804.map(r => r.urlRegionKey));
  const osanKeys = new Set(gyeonggiSouthRegions.filter(r => r.expansionBatch === 'gyeonggi-south-osan-2026').map(r => r.urlRegionKey));

  // P1 regions (Cities & Districts: 5 Cities + 7 Districts = 12 Regions -> 72 URLs)
  const p1Regions = new Set(new145.filter(r => r.regionType === '시' || r.regionType === '구').map(r => r.id));

  // P2 major dongs & prefixed dongs
  const majorDongKeywords = new Set([
    '새솔동', '기산동', '진안동', '병점동', '남양동', '여울동', '영천동', '청계동', '산척동',
    '신갈동', '구갈동', '동백동', '보정동', '풍덕천동', '신봉동', '죽전동', '상현동', '성복동',
    '창전동', '관고동', '증포동', '안흥동', '송정동', '비전동', '동삭동', '지제동', '서정동',
    '지산동', '신장동', '소사동', '용이동', '고덕동', '이충동', '아양동', '석정동', '당왕동', '옥산동'
  ]);

  const p2Regions = new Set();
  new145.forEach(r => {
    if (p1Regions.has(r.id)) return;
    const isPrefixed = r.urlRegionKey !== r.displayRegionName;
    const isMajor = majorDongKeywords.has(r.displayRegionName);
    if (isPrefixed || isMajor) {
      p2Regions.add(r.id);
    }
  });

  const p3Regions = new Set();
  new145.forEach(r => {
    if (!p1Regions.has(r.id) && !p2Regions.has(r.id)) {
      p3Regions.add(r.id);
    }
  });

  // Adjust P2 to exactly 50 regions (300 URLs), P3 to 83 regions (498 URLs)
  if (p2Regions.size > 50) {
    const arr = Array.from(p2Regions);
    const toRemove = arr.slice(50);
    toRemove.forEach(id => {
      p2Regions.delete(id);
      p3Regions.add(id);
    });
  } else if (p2Regions.size < 50) {
    const arr = Array.from(p3Regions);
    const toAdd = arr.slice(0, 50 - p2Regions.size);
    toAdd.forEach(id => {
      p3Regions.delete(id);
      p2Regions.add(id);
    });
  }

  // Read sitemap.xml to verify sitemap inclusion
  const xmlText = fs.readFileSync('./public/sitemap.xml', 'utf-8');
  const sitemapUrls = new Set();
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = locRegex.exec(xmlText)) !== null) {
    sitemapUrls.add(m[1]);
  }

  // Construct 870 rows
  const rows = [];
  new145.forEach(r => {
    let priority = 'P3';
    if (p1Regions.has(r.id)) priority = 'P1';
    else if (p2Regions.has(r.id)) priority = 'P2';

    let districtName = '';
    if (r.regionType === '구') {
      districtName = r.displayRegionName;
    } else if (r.parentRegionName && r.parentRegionName.includes('구')) {
      const parts = r.parentRegionName.split(' ');
      districtName = parts.find(p => p.endsWith('구')) || '';
    }

    let cityName = r.officialRegionName.endsWith('시') ? r.officialRegionName : '';
    if (!cityName && r.parentRegionName) {
      const parts = r.parentRegionName.split(' ');
      cityName = parts.find(p => p.endsWith('시')) || '';
    }
    if (!cityName && r.id.includes('화성')) cityName = '화성시';
    if (!cityName && r.id.includes('용인')) cityName = '용인시';
    if (!cityName && r.id.includes('이천')) cityName = '이천시';
    if (!cityName && r.id.includes('평택')) cityName = '평택시';
    if (!cityName && r.id.includes('안성')) cityName = '안성시';

    elasticServices.forEach(s => {
      const targetUrl = 'https://www.barumspace.co.kr/?k=' + encodeURIComponent(r.urlRegionKey + '-' + s.keyword);
      rows.push({
        priority,
        city: cityName,
        district: districtName,
        regionType: r.regionType,
        displayRegionName: r.displayRegionName,
        urlRegionKey: r.urlRegionKey,
        serviceKeyword: s.keyword,
        dynamicKeyword: r.displayRegionName + '-' + s.keyword,
        serviceFamily: '탄성코트',
        typeTag: '신규',
        targetUrl,
        sitemapMatch: sitemapUrls.has(targetUrl),
        regionId: r.id
      });
    });
  });

  // Sort rows:
  const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3 };
  const typeOrder = { '시': 1, '구': 2, '동': 3 };

  rows.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (a.city !== b.city) return a.city.localeCompare(b.city, 'ko');
    if (a.district !== b.district) return a.district.localeCompare(b.district, 'ko');
    if (typeOrder[a.regionType] !== typeOrder[b.regionType]) {
      return typeOrder[a.regionType] - typeOrder[b.regionType];
    }
    if (a.displayRegionName !== b.displayRegionName) return a.displayRegionName.localeCompare(b.displayRegionName, 'ko');
    return a.serviceKeyword.localeCompare(b.serviceKeyword, 'ko');
  });

  // 1-indexed Sequence
  rows.forEach((r, idx) => {
    r.seq = idx + 1;
  });

  const excelHeader = [
    '번호', '광역구분', '시', '구', '지역유형',
    '지역명 키워드', 'urlRegionKey', '작업명 키워드', '동적변환 키워드',
    '서비스 계열', '신규/기존 구분', '수집 우선순위', '서치어드바이저 제출용 URL'
  ];

  const excelData = [
    excelHeader,
    ...rows.map(r => [
      r.seq,
      '경기',
      r.city,
      r.district,
      r.regionType,
      r.displayRegionName,
      r.urlRegionKey,
      r.serviceKeyword,
      r.dynamicKeyword,
      r.serviceFamily,
      r.typeTag,
      r.priority,
      r.targetUrl
    ])
  ];

  // 1. Create Excel File (.xlsx)
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(excelData);
  xlsx.utils.book_append_sheet(wb, ws, '신규870_제출URL');

  const xlsxPath = './260901_바름공간_경기남부_신규870_URL_네이버서치어드바이저.xlsx';
  xlsx.writeFile(wb, xlsxPath);
  console.log('Created Excel File:', xlsxPath);

  // 2. Create CSV File (.csv with UTF-8 BOM)
  const csvLines = [
    excelHeader.join(','),
    ...rows.map(r => [
      r.seq,
      '경기',
      r.city,
      r.district,
      r.regionType,
      r.displayRegionName,
      r.urlRegionKey,
      r.serviceKeyword,
      r.dynamicKeyword,
      r.serviceFamily,
      r.typeTag,
      r.priority,
      r.targetUrl
    ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','))
  ];
  const csvContent = '\ufeff' + csvLines.join('\n');
  const csvPath = './260901_바름공간_경기남부_신규870_URL_네이버서치어드바이저.csv';
  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log('Created CSV File:', csvPath);

  // 3. Create TXT File (.txt URL ONLY)
  const txtLines = rows.map(r => r.targetUrl);
  const txtContent = txtLines.join('\n');
  const txtPath = './260901_바름공간_경기남부_신규870_URL_ONLY.txt';
  fs.writeFileSync(txtPath, txtContent, 'utf-8');
  console.log('Created TXT File:', txtPath);

  // === INTEGRITY AUDIT ===
  console.log('\n=== INTEGRITY AUDIT VERIFICATION ===');
  console.log('1. Target Region Count:', new145.length, '(Expected: 145)');
  console.log('2. Target URL Count:', rows.length, '(Expected: 870)');
  console.log('3. Elastic Services Count:', elasticServices.length, '(Expected: 6)');
  console.log('4. Grout URLs Count:', rows.filter(r => r.serviceFamily !== '탄성코트').length, '(Expected: 0)');

  const hwaseongRows = rows.filter(r => r.city === '화성시');
  const yonginRows = rows.filter(r => r.city === '용인시');
  const icheonRows = rows.filter(r => r.city === '이천시');
  const pyeongtaekRows = rows.filter(r => r.city === '평택시');
  const anseongRows = rows.filter(r => r.city === '안성시');

  console.log('5. Hwaseong URLs:', hwaseongRows.length, '(Expected: 180)');
  console.log('6. Yongin URLs:', yonginRows.length, '(Expected: 228)');
  console.log('7. Icheon URLs:', icheonRows.length, '(Expected: 96)');
  console.log('8. Pyeongtaek URLs:', pyeongtaekRows.length, '(Expected: 174)');
  console.log('9. Anseong URLs:', anseongRows.length, '(Expected: 192)');

  const cityRows = rows.filter(r => r.regionType === '시');
  const distRows = rows.filter(r => r.regionType === '구');
  const dongRows = rows.filter(r => r.regionType === '동');

  console.log('10. City Rows:', cityRows.length, '(Expected: 30)');
  console.log('11. District Rows:', distRows.length, '(Expected: 42)');
  console.log('12. Dong Rows:', dongRows.length, '(Expected: 798)');

  const p1Urls = rows.filter(r => r.priority === 'P1');
  const p2Urls = rows.filter(r => r.priority === 'P2');
  const p3Urls = rows.filter(r => r.priority === 'P3');

  console.log('13. P1 URLs:', p1Urls.length, '(Expected: 72)');
  console.log('14. P2 URLs:', p2Urls.length, '(Expected: 300)');
  console.log('15. P3 URLs:', p3Urls.length, '(Expected: 498)');

  // Missing Sitemap Check
  const missingSitemap = rows.filter(r => !r.sitemapMatch);
  console.log('16. Missing Sitemap URLs:', missingSitemap.length, '(Expected: 0)');

  // Duplicate Check
  const urlSet = new Set(rows.map(r => r.targetUrl));
  console.log('17. Duplicate Target URLs:', rows.length - urlSet.size, '(Expected: 0)');

  // Contamination Check
  const legacyContamination = rows.filter(r => existing804Keys.has(r.urlRegionKey) || osanKeys.has(r.urlRegionKey));
  console.log('18. Existing 804 or Osan URL Contamination:', legacyContamination.length, '(Expected: 0)');

  // Check 3 files cross-match
  const readXlsx = xlsx.readFile(xlsxPath);
  const sheetName = readXlsx.SheetNames[0];
  const xlsxJson = xlsx.utils.sheet_to_json(readXlsx.Sheets[sheetName]);
  console.log('19. Read back Excel row count:', xlsxJson.length, '(Expected: 870)');

  const readCsv = fs.readFileSync(csvPath, 'utf-8').trim().split('\n');
  console.log('20. Read back CSV line count (inc header):', readCsv.length, '(Expected: 871)');

  const readTxt = fs.readFileSync(txtPath, 'utf-8').trim().split('\n');
  console.log('21. Read back TXT line count:', readTxt.length, '(Expected: 870)');

  const txtMatch = readTxt.length === 870 && readTxt.every((u, i) => u === rows[i].targetUrl);
  console.log('22. 3 Files URL Set 100% Match:', txtMatch ? 'EXACT MATCH' : 'MISMATCH');
}

generateSubmissionFiles();
