// Node.js script to dynamically generate standard-compliant sitemap.xml.
// Reads direct active regions from regionResolver and serviceKeywords.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getActiveRegions, generateAbsoluteDynamicUrl } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base SITE_URL (Default to placeholder, can be replaced by env or set to production domain)
const SITE_URL = process.env.SITE_URL || 'https://www.barumspace.co.kr';

async function generateSitemap() {
  console.log('Generating sitemap.xml for target domain:', SITE_URL);

  const activeRegions = getActiveRegions();
  const urls = [];

  // 1. Index route /
  urls.push(`${SITE_URL}/`);

  // 2. Directory hub /sitemap-seoul & Privacy policy /privacy-policy
  urls.push(`${SITE_URL}/sitemap-seoul`);
  urls.push(`${SITE_URL}/privacy-policy`);

  // 3. Dynamic keywords combinations using correct urlRegion token
  let count = 0;
  activeRegions.forEach(reg => {
    serviceKeywords.forEach(tk => {
      urls.push(generateAbsoluteDynamicUrl(SITE_URL, reg.urlRegion, tk.keyword));
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

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`Success! Wrote ${urls.length} URLs to sitemap.xml successfully. (Dynamic keywords: ${count})`);
}

generateSitemap().catch(err => {
  console.error('Sitemap generation script failed:', err);
  process.exit(1);
});
