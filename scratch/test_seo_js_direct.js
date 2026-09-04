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
  url: '/?k=%EC%95%88%EC%96%91-%EB%B9%84%EC%82%B5%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8', // 안양-비산동-탄성코트
  headers: {
    host: 'www.barumspace.co.kr'
  }
};

handler(mockReq, mockRes).then(() => {
  console.log('Final mock execution status code:', mockRes.statusCode);
  console.log('Final mock execution headers:', mockRes.headers);
});

