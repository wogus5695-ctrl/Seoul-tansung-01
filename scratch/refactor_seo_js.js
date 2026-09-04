import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

// 2. Refactor api/seo.js
let seoContentFile = fs.readFileSync(path.join(workspaceRoot, 'api/seo.js'), 'utf-8');

// Normalize line endings to \n
seoContentFile = seoContentFile.replace(/\r\n/g, '\n');

const seoStartBlock = '    // Fetch all active production regions\n    const activeList = getActiveRegions();\n    const seoulList = activeList.filter(r => r.metro === \'서울\');';
const seoEndBlock = '    html = html.replace(\'<div id="root"></div>\', \'<div id="root">\' + seoContent + \'</div>\');\n\n    res.setHeader(\'Content-Type\', \'text/html; charset=utf-8\');\n    return res.status(200).send(html);\n  }';

const startIdx = seoContentFile.indexOf(seoStartBlock);
const endIdx = seoContentFile.indexOf(seoEndBlock);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find sitemap-seoul rendering block in api/seo.js');
  process.exit(1);
}

const newSeoCode = `    // Fetch all active production regions
    const activeList = getActiveRegions();
    
    // Grouping
    const metroGroups = {
      '서울권': { label: '서울권', cities: {} },
      '경기권': { label: '경기권', cities: {} },
      '인천권': { label: '인천권', cities: {} }
    };

    activeList.forEach(r => {
      const metroKey = r.metro === '서울' ? '서울권' : (r.metro === '인천' ? '인천권' : '경기권');
      const group = metroGroups[metroKey];
      
      if (r.metro === '서울' || r.metro === '인천') {
        const cityKey = r.groupName;
        if (!group.cities[cityKey]) {
          group.cities[cityKey] = {
            name: cityKey,
            districts: {
              '전체': { name: '전체', regions: [] }
            }
          };
        }
        group.cities[cityKey].districts['전체'].regions.push(r);
      } else {
        // Gyeonggi
        const cityKey = r.city;
        if (!group.cities[cityKey]) {
          group.cities[cityKey] = {
            name: cityKey,
            districts: {}
          };
        }
        
        const isDistrict = r.groupName && r.groupName.endsWith('구') && r.groupName !== r.city;
        const distKey = isDistrict ? r.groupName : '시 단위';
        
        if (!group.cities[cityKey].districts[distKey]) {
          group.cities[cityKey].districts[distKey] = {
            name: distKey,
            regions: []
          };
        }
        group.cities[cityKey].districts[distKey].regions.push(r);
      }
    });

    let seoContent = '<div style="padding: 40px; max-width: 1200px; margin: 0 auto; font-family: sans-serif;">';
    seoContent += '<h1 style="font-size: 2rem; color: #183f35; margin-bottom: 20px;">서울·인천·경기 탄성코트·줄눈시공 지역별 페이지 안내</h1>';
    seoContent += '<p style="color: #666; margin-bottom: 40px;">서울·인천·경기 주요 시·구·읍·면·동 단위의 탄성코트 및 줄눈시공 서비스 페이지 안내 목록입니다.</p>';

    for (const metroKey of Object.keys(metroGroups)) {
      const metro = metroGroups[metroKey];
      seoContent += '<div style="margin-bottom: 50px;">';
      seoContent += '<h2 style="font-size: 1.6rem; color: #183f35; border-bottom: 3px solid #183f35; padding-bottom: 10px; margin-bottom: 24px;">' + metro.label + '</h2>';

      for (const cityKey of Object.keys(metro.cities)) {
        const city = metro.cities[cityKey];
        
        // Count children
        let childCount = 0;
        Object.keys(city.districts).forEach(dk => {
          childCount += city.districts[dk].regions.length;
        });

        seoContent += '<div style="margin-bottom: 30px; border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px; background: #fff;">';
        seoContent += '<h3 style="font-size: 1.3rem; color: #183f35; margin: 0 0 16px 0; border-bottom: 1px dashed #e5e5e5; padding-bottom: 8px;">' + cityKey + ' <span style="font-size: 0.9rem; color: #666; font-weight: normal;">(하위 지역: ' + childCount + '개)</span></h3>';

        for (const distKey of Object.keys(city.districts)) {
          const district = city.districts[distKey];
          
          if (distKey !== '전체') {
            seoContent += '<h4 style="font-size: 1.05rem; color: #183f35; margin-top: 16px; margin-bottom: 8px;">[' + distKey + ']</h4>';
          }

          seoContent += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">';
          
          district.regions.forEach(reg => {
            seoContent += '<div style="border: 1px solid #eee; padding: 12px; border-radius: 4px; background: #fafafa;">';
            seoContent += '<h5 style="font-size: 0.9rem; color: #333; font-weight: bold; margin: 0 0 8px 0;">' + reg.name + '</h5>';
            seoContent += '<ul style="list-style: none; padding: 0; margin: 0; line-height: 1.6; font-size: 0.85rem;">';
            serviceKeywords.forEach(k => {
              const encoded = encodeURIComponent(reg.urlRegion + '-' + k.keyword);
              seoContent += '<li><a href="/?k=' + encoded + '" style="color: #0076ff; text-decoration: none;">' + reg.displayName + ' ' + k.keyword + '</a></li>';
            });
            seoContent += '</ul></div>';
          });

          seoContent += '</div>';
        }
        seoContent += '</div>';
      }
      seoContent += '</div>';
    }
    seoContent += '</div>';

    html = html.replace('<div id="root"></div>', '<div id="root">' + seoContent + '</div>');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }`;

seoContentFile = seoContentFile.substring(0, startIdx) + newSeoCode + seoContentFile.substring(endIdx + seoEndBlock.length);

fs.writeFileSync(path.join(workspaceRoot, 'api/seo.js'), seoContentFile, 'utf-8');
console.log('Successfully refactored api/seo.js');

