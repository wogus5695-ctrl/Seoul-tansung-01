import { parseAndValidateK } from '../src/data/regionResolver.js';

const urls = [
  '남현동-탄성코트시공',
  '남현동-탄성코트',
  '당왕동-탄성코트',
  '석정동-탄성코트',
  '안성-숭인동-탄성코트',
  '숭인동-탄성코트',
  '안성시-숭인동-탄성코트',
  '안성-영동-탄성코트',
  '영동-탄성코트',
  '옥산동-탄성코트'
];

for (const u of urls) {
  const res = parseAndValidateK(u, true);
  console.log(`${u} -> isValid: ${res.isValid}${res.isValid ? `, region: ${res.region.name} (${res.region.urlRegion}), service: ${res.service.keyword}` : ''}`);
}
