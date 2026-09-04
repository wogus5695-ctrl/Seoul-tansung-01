import XLSX from 'xlsx';
import path from 'path';

const xlsxPath = path.join(process.cwd(), 'barumspace_sitemap_keywords.xlsx');

try {
  const workbook = XLSX.readFile(xlsxPath);
  console.log('Sheet Names:', workbook.SheetNames);
  
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('Total Rows:', jsonData.length);
  if (jsonData.length > 0) {
    console.log('First Row Keys:', Object.keys(jsonData[0]));
    console.log('Sample Data (First 3 rows):', jsonData.slice(0, 3));
  }
} catch (e) {
  console.error('Error reading xlsx:', e);
}
