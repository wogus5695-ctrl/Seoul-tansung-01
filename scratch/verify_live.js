console.log('=== START LIVE PRODUCTION VERIFICATION (WAITING FOR VERCEL BUILD) ===');

const verifyLiveUrl = async (urlStr, expectedStatus, checkRedirect = false) => {
  try {
    const res = await fetch(urlStr, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      redirect: 'manual'
    });
    
    console.log(`URL: ${urlStr}`);
    console.log(`  - Response Status: ${res.status}`);
    
    if (checkRedirect && (res.status === 301 || res.status === 308 || res.status === 302)) {
      const loc = res.headers.get('Location');
      console.log(`  - Redirect Location: ${loc}`);
    }
    
    if (res.status === 200) {
      const text = await res.text();
      const title = text.match(/<title>(.*?)<\/title>/)?.[1] || 'No Title';
      const canonical = text.match(/<link rel="canonical" href="(.*?)"/)?.[1] || 'No Canonical';
      const ogUrl = text.match(/<meta property="og:url" content="(.*?)"/)?.[1] || 'No og:url';
      
      console.log(`  - Title: ${title}`);
      console.log(`  - Canonical: ${canonical}`);
      console.log(`  - og:url: ${ogUrl}`);
      
      const containsDongSuffix = text.includes('-dong-');
      console.log(`  - Has -dong- in content: ${containsDongSuffix}`);
    }
  } catch (e) {
    console.error(`  - FAILED to fetch: ${e.message}`);
  }
};

const main = async () => {
  console.log('Sleeping 75 seconds to allow Vercel build/deploy to finish...');
  await new Promise(r => setTimeout(r, 75000));
  
  const ts = Date.now();
  await verifyLiveUrl(`https://www.barumspace.co.kr/?k=%ED%99%94%EA%B3%A1%EB%B3%B8%EB%8F%99-%ED%98%84%EA%B4%80%EC%A4%84%EB%88%88%EC%8B%9C%EA%B3%B5&v=${ts}`, 200);
  await verifyLiveUrl(`https://www.barumspace.co.kr/?k=%ED%99%94%EA%B3%A1%EB%B3%B8-dong-%ED%98%84%EA%B4%80%EC%A4%84%EB%88%88%EC%8B%9C%EA%B3%B5&v=${ts}`, 301, true);
  await verifyLiveUrl(`https://www.barumspace.co.kr/sitemap-seoul?v=${ts}`, 200);
  
  console.log('=== END LIVE PRODUCTION VERIFICATION ===');
};

main();

