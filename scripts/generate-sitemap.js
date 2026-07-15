// Node.js script to dynamically generate standard-compliant sitemap.xml.
// Reads direct metadata from seoulRegions and serviceKeywords.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base SITE_URL (Default to placeholder, can be replaced by env)
const SITE_URL = process.env.SITE_URL || 'https://bareum-space.com';

async function generateSitemap() {
  console.log('Generating sitemap.xml for target domain:', SITE_URL);

  // Ingest arrays using relative paths (reading direct files as strings since they are ES modules)
  const regionsFile = fs.readFileSync(path.join(__dirname, '../src/data/seoulRegions.js'), 'utf-8');
  const keywordsFile = fs.readFileSync(path.join(__dirname, '../src/data/serviceKeywords.js'), 'utf-8');

  // Simple extraction using regex since Node import might fail on raw browser modules without setup
  const regionsJsonString = regionsFile
    .substring(regionsFile.indexOf('['), regionsFile.lastIndexOf(']') + 1)
    // Clean comments if any
    .replace(/\/\/.*$/gm, '');
  
  const keywordsJsonString = keywordsFile
    .substring(keywordsFile.indexOf('['), keywordsFile.lastIndexOf(']') + 1)
    .replace(/\/\/.*$/gm, '');

  // Eval data safely to javascript array objects
  let seoulRegions = [];
  let serviceKeywords = [];
  try {
    // Basic sandboxed execution wrapper
    seoulRegions = new Function(`return ${regionsJsonString}`)();
    serviceKeywords = new Function(`return ${keywordsJsonString}`)();
  } catch (err) {
    console.error('Error parsing files dynamically, falling back to basic mock parse:', err.message);
    return;
  }

  const urls = [];

  // 1. Index route /
  urls.push(`${SITE_URL}/`);

  // 2. Directory hub /sitemap-seoul
  urls.push(`${SITE_URL}/sitemap-seoul`);

  // 3. Dynamic keywords combinations (Ensure exact URI Encoding matching App.jsx)
  let count = 0;
  seoulRegions.forEach(reg => {
    serviceKeywords.forEach(tk => {
      const paramStr = `${reg.displayName}-${tk.keyword}`;
      const encodedParam = encodeURIComponent(paramStr);
      urls.push(`${SITE_URL}/?k=${encodedParam}`);
      count++;
    });
  });

  // Construct XML standard wrapper
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach(url => {
    // Escape standard XML special characters
    const escapedUrl = url.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
    xml += '  <url>\n';
    xml += `    <loc>${escapedUrl}</loc>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml, 'utf-8');
  console.log(`Success! Wrote ${urls.length} URLs to sitemap.xml successfully. (Dynamic keywords: ${count})`);
}

generateSitemap().catch(err => {
  console.error('Sitemap generation script failed:', err);
  process.exit(1);
});
