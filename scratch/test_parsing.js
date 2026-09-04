import handler from '../api/seo.js';
import { parseAndValidateK } from '../src/data/regionResolver.js';

console.log('=== START URL PARSING AND VALIDATION TEST ===');

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

const testParsing = async (urlStr) => {
  mockRes.statusCode = 200;
  mockRes.headers = {};
  mockRes.body = '';
  
  const mockReq = {
    url: urlStr,
    headers: {
      host: 'www.barumspace.co.kr'
    }
  };
  
  await handler(mockReq, mockRes);
  
  // Extract parsed info if 200 OK
  const url = new URL(urlStr, 'http://www.barumspace.co.kr');
  const k = url.searchParams.get('k') || '';
  const result = parseAndValidateK(k);
  
  console.log(`URL: ${urlStr}`);
  console.log(`  - HTTP Status: ${mockRes.statusCode}`);
  if (result.isValid) {
    console.log(`  - Parsed Region: ${result.region.name} (keywordName)`);
    console.log(`  - Parsed Service: ${result.service.keyword}`);
  } else {
    console.log(`  - Parsed Result: Invalid Keyword combination`);
  }
};

const main = async () => {
  await testParsing('/?k=%ED%99%94%EA%B3%A1%EB%B3%B8%EB%8F%99-%ED%98%84%EA%B4%80%EC%A4%84%EB%88%88%EC%8B%9C%EA%B3%B5');
  await testParsing('/?k=%ED%99%94%EA%B3%A1%EB%B3%B8%EB%8F%99-%EC%95%84%ED%8C%A8%ED%8A%B8%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8'); // typo
  await testParsing('/?k=%EA%B0%95%EB%82%A8-%EC%8B%A0%EC%82%AC%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8');
  await testParsing('/?k=%EC%9E%84%EC%9D%98%EC%9D%98%EC%9E%98%EB%AA%BB%EB%90%9C%EA%B0%92');
  
  console.log('=== END URL PARSING AND VALIDATION TEST ===');
};

main();

