import { getActiveRegions, parseAndValidateK } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';
import { keywordMetadata } from '../src/data/keywordMetadata.js';
import { regionMaster } from '../src/data/regionMaster.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

console.log('=== START REGRESSION TESTS ===');

// 1. Regional Structure Tests
let orphans = 0;
let wrongParentage = 0;

regionMaster.dongs.forEach(d => {
  if (d.provinceId === 'gyeonggi') {
    if (d.districtId) {
      const dist = regionMaster.districts.find(di => di.id === d.districtId);
      if (!dist) {
        orphans++;
        console.error(`Orphan Gyeonggi Dong: ${d.name} references districtId ${d.districtId} which doesn't exist.`);
      } else if (dist.parentId !== d.cityId) {
        wrongParentage++;
        console.error(`Wrong Parentage: District ${dist.name} (parentId: ${dist.parentId}) does not match Dong's cityId ${d.cityId}`);
      }
    }
  }
});

console.log(`Orphans count: ${orphans}`);
console.log(`Wrong parentage count: ${wrongParentage}`);

// 2. Keyword Tests
let stemDongKeywordErrors = 0;
let undefinedKeywordErrors = 0;
let emptyNameErrors = 0;

keywordMetadata.forEach(item => {
  const displayRegion = item.displayRegion;
  if (!displayRegion) {
    emptyNameErrors++;
    console.error('Empty region name in metadata');
    return;
  }

  if (displayRegion.includes('undefined')) {
    undefinedKeywordErrors++;
  }

  const parentParts = item.parentRegion.replace(/>/g, '').split(' ');
  const stems = parentParts.map(p => p.trim().replace(/구$/, '').replace(/시$/, '').replace(/권$/, '')).filter(Boolean);

  if (item.type === 'dong') {
    stems.forEach(stem => {
      const legitimateExceptions = ['구로동', '도봉동', '서초동', '성북동', '송파동', '영등포동', '중림동'];
      if (legitimateExceptions.includes(displayRegion)) {
        return;
      }
      if (stem && displayRegion.startsWith(stem) && displayRegion !== stem) {
        stemDongKeywordErrors++;
        console.error(`Long/Prefix Keyword error: '${displayRegion}' contains parent stem '${stem}'`);
      }
    });
  }
});

console.log(`City+Dong / Gu+Dong / Stem+Dong Errors (excluding legitimate ones): ${stemDongKeywordErrors}`);
console.log(`Undefined errors: ${undefinedKeywordErrors}`);
console.log(`Empty name errors: ${emptyNameErrors}`);

// 3. Sitemap URL check
const sitemapPath = path.join(workspaceRoot, 'public/sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

const urlsInSitemap = [];
const regex = /<loc>(.*?)<\/loc>/g;
let match;
while ((match = regex.exec(sitemapContent)) !== null) {
  urlsInSitemap.push(match[1]);
}

console.log(`Total URLs in sitemap.xml: ${urlsInSitemap.length}`);

let oldUrlsInSitemap = 0;
urlsInSitemap.forEach(url => {
  if (url.includes('%ED%99%94%EC%A0%95%EB%8F%99') && url.includes('%EA%B3%A0%EC%96%91')) {
    oldUrlsInSitemap++;
  }
});
console.log(`Old joined long URLs in sitemap.xml: ${oldUrlsInSitemap}`);

// 4. Mock Request Testing
const activeRegionsList = getActiveRegions();
console.log(`Active regions in resolver: ${activeRegionsList.length}`);

import handler from '../api/seo.js';

const mockRes = {
  headers: {},
  statusCode: 200,
  body: '',
  setHeader(name, val) {
    this.headers[name] = val;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  send(content) {
    this.body = content;
    return this;
  },
  end() {
    return this;
  }
};

const mockReq = {
  url: '/?k=%EC%95%88%EC%96%91-%EB%B9%84%EC%82%B0%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8', // 안양-비산동-탄성코트
  headers: {
    host: 'www.barumspace.co.kr'
  }
};

handler(mockReq, mockRes).then(() => {
  console.log(`Mock Request: /?k=안양-비산동-탄성코트`);
  console.log(`  - Redirect StatusCode: ${mockRes.statusCode}`);
  console.log(`  - Location: ${mockRes.headers['Location']}`);
  
  mockRes.statusCode = 200;
  mockRes.headers = {};
  
  const mockReq2 = {
    url: '/?k=%EB%B9%84%EC%82%B0%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8', // 비산동-탄성코트
    headers: {
      host: 'www.barumspace.co.kr'
    }
  };
  
  return handler(mockReq2, mockRes);
}).then(() => {
  console.log(`Mock Request: /?k=비산동-탄성코트`);
  console.log(`  - StatusCode: ${mockRes.statusCode}`);
  console.log(`  - Has HTML Content: ${mockRes.body.includes('<title>')}`);
  
  const body = mockRes.body;
  const h1Match = body.match(/<h1>(.*?)<\/h1>/);
  const canonicalMatch = body.match(/<link rel="canonical" href="(.*?)" \/>/);
  
  console.log(`  - H1: ${h1Match ? h1Match[1] : 'NOT FOUND'}`);
  console.log(`  - Canonical: ${canonicalMatch ? canonicalMatch[1] : 'NOT FOUND'}`);
});

