import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import { URL } from 'url';

const neocoatUrls = [
  'https://www.neocoat.co.kr/?k=%EC%B2%9C%ED%98%B8%EB%8F%99-%EC%84%B8%ED%83%81%EC%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
  'https://www.neocoat.co.kr/?k=%EB%8C%80%EC%B9%98%EB%8F%99-%EC%95%84%ED%8C%8C%ED%8A%B8%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8'
];

const barumUrls = [
  'https://www.barumspace.co.kr/?k=남현동-탄성코트시공',
  'https://www.barumspace.co.kr/?k=공릉동-탄성코트업체',
  'https://www.barumspace.co.kr/?k=이문동-탄성코트업체'
];

const uas = {
  chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  yeti: 'Mozilla/5.0 (compatible; Yeti/1.1; +http://naver.me/bot)'
};

function fetchRaw(targetUrl, ua) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': ua }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
        length: Buffer.byteLength(data, 'utf8'),
        hash: crypto.createHash('sha256').update(data).digest('hex')
      }));
    }).on('error', reject);
  });
}

function extractMetaAndImgs(html) {
  const title = (html.match(/<title>(.*?)<\/title>/i) || [])[1] || '';
  const canonical = (html.match(/<link\s+[^>]*?rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
  const robots = (html.match(/<meta\s+[^>]*?name="robots"\s+content="([^"]*)"/i) || [])[1] || '';
  const desc = (html.match(/<meta\s+[^>]*?name="description"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogTitle = (html.match(/<meta\s+[^>]*?property="og:title"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogDesc = (html.match(/<meta\s+[^>]*?property="og:description"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogImage = (html.match(/<meta\s+[^>]*?property="og:image"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogSec = (html.match(/<meta\s+[^>]*?property="og:image:secure_url"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogW = (html.match(/<meta\s+[^>]*?property="og:image:width"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogH = (html.match(/<meta\s+[^>]*?property="og:image:height"\s+content="([^"]*)"/i) || [])[1] || '';
  const ogT = (html.match(/<meta\s+[^>]*?property="og:image:type"\s+content="([^"]*)"/i) || [])[1] || '';
  const imgSrc = (html.match(/<link\s+[^>]*?rel="image_src"\s+href="([^"]*)"/i) || [])[1] || '';
  const twImage = (html.match(/<meta\s+[^>]*?name="twitter:image"\s+content="([^"]*)"/i) || [])[1] || '';

  const bodyImgs = [];
  const imgMatches = html.matchAll(/<img\s+([^>]*?)>/gi);
  for (const m of imgMatches) {
    const attrStr = m[1];
    const src = (attrStr.match(/src="([^"]*)"/i) || [])[1] || '';
    const alt = (attrStr.match(/alt="([^"]*)"/i) || [])[1] || '';
    const style = (attrStr.match(/style="([^"]*)"/i) || [])[1] || '';
    const width = (attrStr.match(/width="([^"]*)"/i) || [])[1] || '';
    const height = (attrStr.match(/height="([^"]*)"/i) || [])[1] || '';
    bodyImgs.push({ src, alt, style, width, height });
  }

  const bgImgs = [];
  const bgMatches = html.matchAll(/background-image:\s*url\((['"]?)(.*?)\1\)/gi);
  for (const m of bgMatches) {
    bgImgs.push(m[2]);
  }

  return { title, canonical, robots, desc, ogTitle, ogDesc, ogImage, ogSec, ogW, ogH, ogT, imgSrc, twImage, bodyImgs, bgImgs };
}

async function run() {
  console.log('==================================================');
  console.log('1. NEOCOAT RAW SSR HTML AUDIT');
  console.log('==================================================\n');

  for (const u of neocoatUrls) {
    console.log(`URL: ${u}`);
    const yetiRes = await fetchRaw(u, uas.yeti);
    const meta = extractMetaAndImgs(yetiRes.body);

    console.log(`  HTTP Status:      ${yetiRes.statusCode}`);
    console.log(`  Content-Type:     ${yetiRes.headers['content-type']}`);
    console.log(`  Byte Size:        ${yetiRes.length} bytes`);
    console.log(`  Title:            ${meta.title}`);
    console.log(`  Canonical:        ${meta.canonical}`);
    console.log(`  Robots:           ${meta.robots}`);
    console.log(`  Description:      ${meta.desc}`);
    console.log(`  og:image:         ${meta.ogImage}`);
    console.log(`  og:image:width:   ${meta.ogW}`);
    console.log(`  og:image:height:  ${meta.ogH}`);
    console.log(`  image_src:        ${meta.imgSrc}`);
    console.log(`  Body Imgs Count:  ${meta.bodyImgs.length}`);
    meta.bodyImgs.forEach((img, idx) => {
      console.log(`    [Img #${idx+1}] src: ${img.src} | alt: ${img.alt} | style: ${img.style}`);
    });
    console.log(`  CSS Backgrounds:  ${meta.bgImgs.length} (${meta.bgImgs.join(', ')})`);
    console.log('');
  }

  console.log('==================================================');
  console.log('2. BAREUMGONGGAN RAW SSR HTML AUDIT');
  console.log('==================================================\n');

  for (const u of barumUrls) {
    console.log(`URL: ${u}`);
    const yetiRes = await fetchRaw(u, uas.yeti);
    const meta = extractMetaAndImgs(yetiRes.body);

    console.log(`  HTTP Status:      ${yetiRes.statusCode}`);
    console.log(`  Content-Type:     ${yetiRes.headers['content-type']}`);
    console.log(`  Byte Size:        ${yetiRes.length} bytes`);
    console.log(`  Title:            ${meta.title}`);
    console.log(`  Canonical:        ${meta.canonical}`);
    console.log(`  Robots:           ${meta.robots}`);
    console.log(`  Description:      ${meta.desc}`);
    console.log(`  og:image:         ${meta.ogImage}`);
    console.log(`  og:image:width:   ${meta.ogW}`);
    console.log(`  og:image:height:  ${meta.ogH}`);
    console.log(`  image_src:        ${meta.imgSrc}`);
    console.log(`  Body Imgs Count:  ${meta.bodyImgs.length}`);
    meta.bodyImgs.forEach((img, idx) => {
      console.log(`    [Img #${idx+1}] src: ${img.src} | alt: ${img.alt} | style: ${img.style}`);
    });
    console.log('');
  }
}

run();
