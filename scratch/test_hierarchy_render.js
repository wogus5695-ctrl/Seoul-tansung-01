import { getActiveRegions } from '../src/data/regionResolver.js';

const list = getActiveRegions();

console.log('Total active regions:', list.length);

const hierarchy = {
  서울: {},
  인천: {},
  경기: {}
};

list.forEach(r => {
  const metro = r.metro; // 서울, 인천, 경기
  if (!hierarchy[metro]) return;

  if (metro === '서울') {
    // Group by groupName (e.g. 강남구)
    const cityKey = r.groupName;
    if (!hierarchy[metro][cityKey]) {
      hierarchy[metro][cityKey] = {
        name: cityKey,
        type: 'city',
        regions: []
      };
    }
    hierarchy[metro][cityKey].regions.push(r);
  } else if (metro === '인천') {
    // Group by groupName (e.g. 부평구)
    const cityKey = r.groupName;
    if (!hierarchy[metro][cityKey]) {
      hierarchy[metro][cityKey] = {
        name: cityKey,
        type: 'city',
        regions: []
      };
    }
    hierarchy[metro][cityKey].regions.push(r);
  } else if (metro === '경기') {
    // Group by city (e.g. 안양시)
    const cityKey = r.city;
    if (!hierarchy[metro][cityKey]) {
      hierarchy[metro][cityKey] = {
        name: cityKey,
        type: 'city',
        districts: {}
      };
    }
    // Check if it belongs to a district
    // Gyeonggi districts: e.g. 동안구, 만안구 (ends with '구')
    // If the region's groupName ends with '구' and is not equal to city name:
    const isDistrict = r.groupName && r.groupName.endsWith('구') && r.groupName !== r.city;
    if (isDistrict) {
      const distKey = r.groupName;
      if (!hierarchy[metro][cityKey].districts[distKey]) {
        hierarchy[metro][cityKey].districts[distKey] = {
          name: distKey,
          regions: []
        };
      }
      hierarchy[metro][cityKey].districts[distKey].regions.push(r);
    } else {
      // Belongs to city level (e.g. 안양시 itself, or 안양 alias, or dongs directly under city without general districts like 김포시 dongs)
      const distKey = '시 단위';
      if (!hierarchy[metro][cityKey].districts[distKey]) {
        hierarchy[metro][cityKey].districts[distKey] = {
          name: '시 단위',
          regions: []
        };
      }
      hierarchy[metro][cityKey].districts[distKey].regions.push(r);
    }
  }
});

console.log('Hierarchy processed.');
console.log('Seoul groups:', Object.keys(hierarchy.서울).length);
console.log('Incheon groups:', Object.keys(hierarchy.인천).length);
console.log('Gyeonggi cities count:', Object.keys(hierarchy.경기).length);

// Sample check for 안양시
console.log('Anyang-si districts:', Object.keys(hierarchy.경기['안양시'].districts));
console.log('Anyang-si "시 단위" regions:', hierarchy.경기['안양시'].districts['시 단위'].regions.map(r => r.name));
console.log('Anyang-si "동안구" regions:', hierarchy.경기['안양시'].districts['동안구'].regions.map(r => r.name));

