const url = new URL('/?k=%EC%95%88%EC%96%91-%EB%B9%84%EC%82%B5%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8', 'http://www.barumspace.co.kr');
console.log('kParam:', url.searchParams.get('k'));

