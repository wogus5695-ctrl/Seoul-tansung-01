import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { getActiveRegions } from '../src/data/regionResolver.js';
import { serviceKeywords } from '../src/data/serviceKeywords.js';

const xlsxPath = path.join(process.cwd(), 'barumspace_sitemap_keywords.xlsx');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

try {
  // 1. Read Excel
  const workbook = XLSX.readFile(xlsxPath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = XLSX.utils.sheet_to_json(worksheet);
  const excelKParams = new Set(excelData.map(row => row['k 파라미터 원문']?.trim()));

  // 2. Read sitemap.xml
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const urlsInSitemap = [];
  const regex = /<loc>https:\/\/www\.barumspace\.co\.kr\/\?k=(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapContent)) !== null) {
    urlsInSitemap.push(decodeURIComponent(match[1]).trim());
  }
  const sitemapKParams = new Set(urlsInSitemap);

  // 3. Generate expected from Resolver + Keywords
  const activeRegions = getActiveRegions();
  const generatedKParams = [];
  activeRegions.forEach(reg => {
    serviceKeywords.forEach(tk => {
      generatedKParams.push(`${reg.urlRegion}-${tk.keyword}`);
    });
  });
  const generatedKSet = new Set(generatedKParams);

  console.log(`Excel K-Params count: ${excelKParams.size}`);
  console.log(`Sitemap.xml K-Params count: ${sitemapKParams.size}`);
  console.log(`Generated from Resolver count: ${generatedKSet.size}`);

  // Find Gaps
  const missingInSitemap = [...excelKParams].filter(k => !sitemapKParams.has(k));
  const missingInExcel = [...sitemapKParams].filter(k => !excelKParams.has(k));
  const resolverVsExcelGap = [...generatedKSet].filter(k => !excelKParams.has(k));
  const excelVsResolverGap = [...excelKParams].filter(k => !generatedKSet.has(k));

  console.log(`Missing in sitemap.xml (but in Excel): ${missingInSitemap.length}`);
  if (missingInSitemap.length > 0) {
    console.log('Sample:', missingInSitemap.slice(0, 5));
  }

  console.log(`Missing in Excel (but in sitemap.xml): ${missingInExcel.length}`);
  if (missingInExcel.length > 0) {
    console.log('Sample:', missingInExcel.slice(0, 5));
  }

  console.log(`Resolver vs Excel Gaps (Generated but not in Excel): ${resolverVsExcelGap.length}`);
  if (resolverVsExcelGap.length > 0) {
    console.log('Sample:', resolverVsExcelGap.slice(0, 5));
  }

  console.log(`Excel vs Resolver Gaps (Excel but not generated): ${excelVsResolverGap.length}`);
  if (excelVsResolverGap.length > 0) {
    console.log('Sample:', excelVsResolverGap.slice(0, 5));
  }

} catch (e) {
  console.error('Error running comparison:', e);
}
