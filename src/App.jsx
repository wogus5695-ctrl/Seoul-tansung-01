import React, { useState, useEffect, useMemo } from 'react';
import { siteConfig } from './config';
import {
  Header,
  Footer,
  SectionContainer,
  PrimaryButton,
  SecondaryButton,
  ImagePlaceholder,
  Accordion,
  MobileFixedCTA,
  ServiceSection,
  SEOContentSection
} from './components/Common';

// Ingest datasets
import { seoulRegions } from './data/seoulRegions';
import { serviceKeywords } from './data/serviceKeywords';

// Space Guide static descriptions (1-2 sentences)
const SPACE_GUIDE_DATA = {
  balcony: { name: '베란다', img: 'BALCONY_IMAGE', desc: '외부 온도와 습기의 영향을 많이 받는 공간입니다. 벽면의 들뜸, 오염, 균열 여부를 먼저 확인합니다.' },
  laundry: { name: '세탁실', img: 'LAUNDRY_ROOM_IMAGE', desc: '물 사용과 환기 상태에 따라 벽면 오염이 발생하기 쉬운 공간입니다. 배관 주변과 기존 마감 상태를 함께 확인합니다.' },
  bathroom: { name: '욕실', img: 'BATHROOM_IMAGE', desc: '물과 세정제에 자주 노출되는 공간입니다. 타일 틈의 오염과 갈라짐, 기존 줄눈의 접착 상태를 확인합니다.' },
  toilet: { name: '화장실', img: 'TOILET_IMAGE', desc: '바닥과 벽면의 사용 환경에 맞춰 줄눈 상태를 점검합니다. 부분 보수와 전체 시공 중 적절한 범위를 안내합니다.' },
  entrance: { name: '현관', img: 'ENTRANCE_IMAGE', desc: '먼지와 외부 오염이 반복적으로 유입되는 공간입니다. 타일 색상과 관리 방식을 고려해 줄눈 색상을 선택합니다.' },
  utility: { name: '다용도실', img: 'UTILITY_ROOM_IMAGE', desc: '세탁기, 배관, 수납장 주변의 작업 공간을 먼저 확인합니다. 좁은 공간에서도 필요한 보양과 작업 동선을 검토합니다.' },
};

// Base FAQ catalog reference
const FAQ_CATALOG = {
  '기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?': '재시공 가능 여부는 기존 마감의 접착 상태를 확인한 후에 판단할 수 있습니다. 들뜬 부분을 정리하지 않고 바로 덧시공을 하게 되면 다시 떨어질 우려가 있으므로, 사전에 상태를 확인하고 필요한 부분 보수 또는 전체 재시공 범위를 결정해야 합니다.',
  '곰팡이나 결로가 있으면 바로 시공해도 되나요?': '표면만 덮어서 시공을 진행하면 원인이 해결되지 않아 마감 후에 다시 문제가 생길 수 있습니다. 결로나 누수 의심 원인을 먼저 확인해 조치를 취하고, 바탕면의 건조 상태가 완전히 확인된 후에 시공하는 것이 바람직합니다.',
  '탄성코트 시공 전에 짐을 모두 빼야 하나요?': '작업할 벽면 및 보양을 진행할 공간의 확보와 작업 동선이 마련되어야 합니다. 세탁기, 선반, 실외기 등 부피가 큰 짐들의 이동 가능 여부는 사전 사진 상담 시 상태를 확인한 후에 안내해 드립니다.',
  '일부 벽면만 부분 보수할 수 있나요?': '부분적인 보수가 가능한지의 여부는 손상된 범위와 기존 시공면의 색상 차이를 분석하여 판단합니다. 부분 시공을 할 경우 기존 면과의 미세한 색상이나 질감 차이가 관찰될 수 있어, 사진과 현장 상태를 기준으로 판단합니다.',
  '탄성코트 색상은 어떻게 선택하나요?': '기존 인테리어와의 배합을 분석하여 현장에서 샘플 조색 카드를 대조하며 선택합니다. 밝은 톤의 웜화이트 및 실버/내추럴 그레이 등 오염 관리에 적합한 색상 매칭을 안내합니다.',
  '시공 후 환기와 건조는 어떻게 해야 하나요?': '도포된 수지가 고르게 양생될 때까지 온도와 자연 기류 통풍 흐름을 안정적으로 유지해야 합니다. 자재 등급 및 양생 당일의 날씨 환경에 수렴하여 개별로 건조 완료 시점을 상세히 보고드립니다.',
  '기존 줄눈을 제거하고 시공하나요?': '기존 타일 사이 줄눈의 오염도, 갈라짐 정도, 접착 상태를 면밀히 분석한 후 작업을 시작합니다. 필요한 작업 범위 내에 있는 기존 백시멘트를 제거하고 틈새를 꼼꼼히 정리하는 과정을 거친 후에 다시 시공하게 됩니다.',
  '욕실과 현관에 같은 자재를 사용하나요?': '공간마다 물을 접하는 빈도와 오염물이 유입되는 경로가 다릅니다. 타일의 종류와 기존 마감재 상태도 다르기 때문에, 해당 공간의 환경에 가장 잘 부합하는 적합한 등급의 자재와 마감 색상을 선정하여 안내해 드립니다.',
  '줄눈 일부만 보수할 수 있나요?': '줄눈의 훼손 부위 접착 특성을 판단해 마감 탈락 위험성이 높지 않은 경우 국소 보수가 가능합니다. 단, 전체 균일도 유지를 위해 가능한 타일 면 단위 정리를 권장합니다.',
  '시공 후 언제부터 물을 사용할 수 있나요?': '정확한 사용 가능 시점은 현장에서 적용한 자재의 특성, 그리고 당일 현장의 온도와 습도 조건에 따라 다르게 나타납니다. 시공이 완료된 후 현장에서 양생 건조 관련 세부 주의사항과 함께 안내해 드립니다.',
  '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?': '타일의 메탈 느낌이나 은은한 미색에 맞춘 다채로운 메탈 조색, 펄 컬러 색조판을 구비하여 현장 대조 확인 후 선택할 수 있도록 조율합니다.',
  '오염된 줄눈 위에 바로 덧시공하나요?': '오염물이 고착된 노후 백시멘트 바로 위에 줄눈제를 바르면 부착력이 저하되어 금방 부스러져 떨어집니다. 반드시 기존 오염된 줄눈 틈을 긁어 정리한 후에 시공을 집행합니다.',
  '탄성코트 업체를 선택할 때 무엇을 확인해야 하나요?': '들뜬 마감을 철저히 긁어내는 전처리 밑작업 원칙을 고수하는지, 그리고 눈에 보이지 않는 균열 틈새 보강 절차를 성실히 진행하는지가 가장 핵심적인 선택 기준입니다.',
  '줄눈시공 업체의 견적은 어떤 내용을 비교해야 하나요?': '단순 최저 단가보다는 기존 노후 마감재 홈파기 정리 깊이, 변기 및 욕조 테두리 코킹 마감 범위가 견적서상에 명확히 수록되어 있는지를 면밀히 비교 확인해야 합니다.',
  '시공 전 기존 마감 상태를 확인하나요?': '벽체의 수분 함침 정도나 백시멘트의 딱딱하게 굳은 노후 수준에 맞춰 긁어내는 전용 장비와 마감 자재 배합이 달라지므로 시공 전 상태 진단은 반드시 필요합니다.',
  '시공 사례는 어떤 기준으로 확인해야 하나요?': '마감이 완료된 표면의 균일한 분사 두께, 타일 테두리선과 줄눈선이 일정하게 평행을 이루며 깔끔하게 정리되었는지의 실제 근접 디테일 사진을 확인하는 것이 좋습니다.',
  '부분 보수와 전체 시공은 어떻게 구분하나요?': '타일 틈의 갈라진 틈이 전체 욕실 면적의 극히 일부분인지 혹은 벽체 모서리 일부 페인트 박리가 전부인지 분석하여, 합리적인 조치 범위를 구분해 제안합니다.'
};

// Portfolio Structures
const PORTFOLIO_DATA = [
  { id: 1, serviceType: '탄성코트', spaceType: '베란다', title: '베란다 벽면 마감 사례', summary: '기존 마감 정돈 후 탄성코트 적용', beforeImage: 'ELASTIC_COATING_BEFORE', afterImage: 'ELASTIC_COATING_AFTER', detailImage: 'PORTFOLIO_IMAGE_01', checkpoints: '벽면의 국소적 들뜸 및 잔오염 확인', scope: '베란다 벽체 전면 밑작업 및 탄성 마감 분사' },
  { id: 2, serviceType: '줄눈시공', spaceType: '욕실', title: '공동 욕실 타일 틈새 마감 사례', summary: '기존 백시멘트 정리 후 줄눈 시공', beforeImage: 'GROUT_BEFORE', afterImage: 'GROUT_AFTER', detailImage: 'PORTFOLIO_IMAGE_02', checkpoints: '백시멘트 부식 및 미세 탈락 확인', scope: '욕실 바닥 타일 사이 기존 줄눈 정리 및 신규 줄눈 마감' },
  { id: 3, serviceType: '탄성코트', spaceType: '세탁실', title: '세탁실 벽면 마감 사례', summary: '배관 주변 기초 정리 후 분사 시공', beforeImage: 'ELASTIC_COATING_BEFORE', afterImage: 'ELASTIC_COATING_AFTER', detailImage: 'PORTFOLIO_IMAGE_03', checkpoints: '배관 결로 유입 및 곰팡이 흔적 확인', scope: '보양 및 하단 코킹 보수 후 탄성코트 시공' },
  { id: 4, serviceType: '줄눈시공', spaceType: '현관', title: '현관 타일 틈새 마감 사례', summary: '타일 컬러에 맞춘 줄눈 라인 정돈', beforeImage: 'GROUT_BEFORE', afterImage: 'GROUT_AFTER', detailImage: 'PORTFOLIO_IMAGE_04', checkpoints: '외부 오염물 유입 흔적 확인', scope: '현관 테두리 다크그레이 줄눈 시공 마감' },
];

function Breadcrumb({ region, task }) {
  return (
    <div style={{ fontSize: '0.85rem', opacity: 0.7, textAlign: 'left', marginBottom: '16px', display: 'flex', gap: '8px' }}>
      <a href="/" style={{ textDecoration: 'underline' }}>홈</a>
      <span>&gt;</span>
      <a href="/sitemap-seoul" style={{ textDecoration: 'underline' }}>서울시 시공</a>
      {region && (
        <>
          <span>&gt;</span>
          <span>{region}</span>
        </>
      )}
      {task && (
        <>
          <span>&gt;</span>
          <span>{task}</span>
        </>
      )}
    </div>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  
  const [beforeAfterTab, setBeforeAfterTab] = useState('elastic');
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  const [portfolioFilter, setPortfolioFilter] = useState('전체');
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  // Main Page Hero Image Auto Slide
  const [activeHeroSlide, setActiveHeroSlide] = useState(0); // 0: elastic, 1: grout

  // Sitemap Hub Search & Filter States
  const [sitemapFilter, setSitemapFilter] = useState('전체'); // '전체' | '탄성코트' | '줄눈시공'
  const [regionSearch, setRegionSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  
  // Track open state of each district (all closed by default)
  const [openDistricts, setOpenDistricts] = useState({});

  // Sync state with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Interval hook to slide Hero images on Main Page
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide(prev => (prev === 0 ? 1 : 0));
    }, 3500); // Swaps every 3.5s
    return () => clearInterval(interval);
  }, []);

  const navigate = (newPath, query = '') => {
    const fullUrl = newPath + (query ? `?${query}` : '');
    window.history.pushState({}, '', fullUrl);
    setPath(newPath);
    setSearchParams(new URLSearchParams(query));
    window.scrollTo(0, 0);
  };

  // Parse and validate 'k' parameter
  const kParam = searchParams.get('k')?.trim() || '';
  let parsedKeyword = null;
  let isKeywordInvalid = false;

  if (kParam) {
    const sortedKeywords = [...serviceKeywords].sort((a, b) => b.keyword.length - a.keyword.length);
    let matchedService = null;
    let extractedRegionName = '';

    for (const s of sortedKeywords) {
      if (kParam.endsWith(`-${s.keyword}`)) {
        matchedService = s;
        extractedRegionName = kParam.substring(0, kParam.length - s.keyword.length - 1);
        break;
      }
    }

    if (matchedService && extractedRegionName) {
      const matchedRegion = seoulRegions.find(
        r => r.displayName === extractedRegionName || r.normalizedName === extractedRegionName
      );

      if (matchedRegion) {
        parsedKeyword = {
          region: matchedRegion,
          service: matchedService
        };
      } else {
        isKeywordInvalid = true;
      }
    } else {
      isKeywordInvalid = true;
    }
  }

  // Pre-calculate Hub parameters and metrics for high performance
  const metrics = useMemo(() => {
    // 25 Districts (gu units)
    const uniqueDistricts = Array.from(new Set(seoulRegions.map(r => r.districtName))).sort();
    
    // Total Dongs (dong units)
    const dongsCount = seoulRegions.filter(r => r.regionType === 'dong').length;
    
    // Total regions (display names)
    const totalRegionsCount = seoulRegions.length;
    
    // Total tasks
    const totalTasksCount = serviceKeywords.length;
    
    // Total potential URL combinations
    const totalUrlsCount = totalRegionsCount * totalTasksCount;

    // Filter task categories
    const elasticTasks = serviceKeywords.filter(k => k.serviceGroup === 'elastic');
    const groutTasks = serviceKeywords.filter(k => k.serviceGroup === 'grout');

    // Group regions by District
    const groupedRegions = {};
    uniqueDistricts.forEach(dist => {
      groupedRegions[dist] = seoulRegions.filter(r => r.districtName === dist);
    });

    return {
      uniqueDistricts,
      dongsCount,
      totalRegionsCount,
      totalTasksCount,
      totalUrlsCount,
      elasticTasks,
      groutTasks,
      groupedRegions
    };
  }, []);

  // Determine active layouts
  const activeGroup = parsedKeyword ? parsedKeyword.service.serviceGroup : 'both';
  const activeIntent = parsedKeyword ? parsedKeyword.service.searchIntent : 'general';

  const currentFaqList = parsedKeyword 
    ? parsedKeyword.service.faqSet.map(q => ({ question: q, answer: FAQ_CATALOG[q] || '상세 시공 문의 시 전문 답변을 준비해 드립니다.' }))
    : [
        { question: '기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?', answer: FAQ_CATALOG['기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?'] },
        { question: '곰팡이나 결로가 있으면 바로 시공해도 되나요?', answer: FAQ_CATALOG['곰팡이나 결로가 있으면 바로 시공해도 되나요?'] },
        { question: '탄성코트 시공 전에 짐을 모두 빼야 하나요?', answer: FAQ_CATALOG['탄성코트 시공 전에 짐을 모두 빼야 하나요?'] },
        { question: '기존 줄눈을 제거하고 시공하나요?', answer: FAQ_CATALOG['기존 줄눈을 제거하고 시공하나요?'] },
        { question: '욕실과 현관에 같은 자재를 사용하나요?', answer: FAQ_CATALOG['욕실과 현관에 같은 자재를 사용하나요?'] },
        { question: '시공 후 언제부터 물을 사용할 수 있나요?', answer: FAQ_CATALOG['시공 후 언제부터 물을 사용할 수 있나요?'] },
        { question: '줄눈 일부만 보수할 수 있나요?', answer: FAQ_CATALOG['줄눈 일부만 보수할 수 있나요?'] },
        { question: '시공 전 기존 마감 상태를 확인하나요?', answer: FAQ_CATALOG['시공 전 기존 마감 상태를 확인하나요?'] }
      ];

  // Sync title, meta tags, and canonical dynamically on mount/update
  useEffect(() => {
    let titleStr = `탄성코트·줄눈시공 전문 | ${siteConfig.brandName}`;
    let descStr = `베란다·세탁실 탄성코트와 욕실·현관 줄눈시공을 안내합니다. 기존 벽면과 타일 상태를 확인하고 공간에 필요한 시공 범위를 상담해 드립니다.`;
    const defaultSiteUrl = 'https://bareum-space.com';
    
    // Schema generation arrays
    const schemas = [];

    const updateMetaTag = (selector, attr, val) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[property')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    // Remove any previous noindex tags if any
    const existingNoIndex = document.querySelector('meta[name="robots"]');
    if (existingNoIndex) existingNoIndex.remove();

    if (isKeywordInvalid) {
      // Step 16: Dynamic SEO noindex block for invalid URLs
      titleStr = '잘못된 요청 정보';
      descStr = '요청하신 시공 정보 또는 지역명이 정확하지 않습니다.';
      updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
    } else if (parsedKeyword) {
      const regionName = parsedKeyword.region.displayName;
      const taskName = parsedKeyword.service.keyword;
      
      if (parsedKeyword.service.serviceGroup === 'elastic') {
        titleStr = `${regionName} ${taskName} 시공 | 베란다·세탁실 벽면 마감`;
      } else {
        titleStr = `${regionName} ${taskName} | 기존 줄눈 제거와 마감 안내`;
      }
      if (parsedKeyword.service.searchIntent === 'agency') {
        titleStr = `${regionName} ${taskName} | 시공 전 확인 기준`;
      }
      
      descStr = `${regionName} ${taskName} 안내입니다. ${parsedKeyword.service.primarySpace} 구역의 기존 상태를 확인하고 환경에 최적화된 마감 시공 범위를 안내해 드립니다.`;

      // 1. Service schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': `${regionName} ${taskName}`,
        'provider': {
          '@type': 'Organization',
          'name': siteConfig.brandName
        },
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': parsedKeyword.region.districtName
        },
        'description': descStr
      });

      // 2. Breadcrumb schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': '홈', 'item': defaultSiteUrl },
          { '@type': 'ListItem', 'position': 2, 'name': '서울 지역별 안내', 'item': `${defaultSiteUrl}/sitemap-seoul` },
          { '@type': 'ListItem', 'position': 3, 'name': `${regionName} ${taskName}`, 'item': `${defaultSiteUrl}/?k=${encodeURIComponent(kParam)}` }
        ]
      });

      // 3. FAQPage schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': currentFaqList.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      });

    } else if (path === '/sitemap-seoul') {
      titleStr = `서울 탄성코트·줄눈시공 지역별 안내 | ${siteConfig.brandName}`;
      descStr = `서울 자치구와 동 단위 지역별 탄성코트·줄눈시공 페이지를 확인할 수 있습니다. 지역명과 시공 서비스를 선택해 필요한 정보를 확인해 보세요.`;

      // Sitemap Page Schemas
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': titleStr,
        'description': descStr,
        'url': `${defaultSiteUrl}/sitemap-seoul`
      });

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': '홈', 'item': defaultSiteUrl },
          { '@type': 'ListItem', 'position': 2, 'name': '서울 지역별 안내', 'item': `${defaultSiteUrl}/sitemap-seoul` }
        ]
      });
    } else {
      // Main Page schemas
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': titleStr,
        'url': defaultSiteUrl
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': siteConfig.brandName,
        'url': defaultSiteUrl
      });
    }

    document.title = titleStr;

    updateMetaTag('meta[name="description"]', 'content', descStr);
    updateMetaTag('meta[property="og:title"]', 'content', titleStr);
    updateMetaTag('meta[property="og:description"]', 'content', descStr);

    let canonicalUrl = window.location.origin + window.location.pathname;
    if (kParam && !isKeywordInvalid) {
      canonicalUrl += `?k=${encodeURIComponent(kParam)}`;
    }
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.setAttribute('rel', 'canonical');
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', canonicalUrl);

    // og:url synchronization
    updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);

    // Sync JSON-LD structured script tag
    let scriptEl = document.getElementById('jsonld-schema');
    if (scriptEl) scriptEl.remove();

    if (schemas.length > 0) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'jsonld-schema';
      scriptEl.type = 'application/ld+json';
      scriptEl.innerHTML = JSON.stringify(schemas);
      document.head.appendChild(scriptEl);
    }

  }, [parsedKeyword, path, kParam, isKeywordInvalid, currentFaqList]);

  const handleCTA = () => {
    window.open(siteConfig.consultationUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${siteConfig.phoneNumber.replace(/-/g, '')}`;
  };

  const breadcrumbRegion = parsedKeyword ? parsedKeyword.region.displayName : null;
  const breadcrumbTask = parsedKeyword ? parsedKeyword.service.keyword : null;

  const spaceGuideKeys = activeGroup === 'elastic' 
    ? ['balcony', 'laundry', 'utility'] 
    : activeGroup === 'grout' 
      ? ['bathroom', 'toilet', 'entrance', 'balcony'] 
      : ['balcony', 'laundry', 'bathroom', 'toilet', 'entrance', 'utility'];

  const activeSpaceKey = spaceGuideKeys[activeSpaceIndex] || spaceGuideKeys[0];

  const activePortfolios = activeGroup === 'both' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(p => p.serviceType === (activeGroup === 'elastic' ? '탄성코트' : '줄눈시공'));

  const filteredPortfolios = portfolioFilter === '전체'
    ? activePortfolios
    : activePortfolios.filter(p => p.serviceType === portfolioFilter);

  const relatedServicesLinks = parsedKeyword ? parsedKeyword.service.relatedServices.map(task => ({
    label: `${parsedKeyword.region.displayName} ${task}`,
    href: `/?k=${encodeURIComponent(parsedKeyword.region.displayName + '-' + task)}`
  })) : null;

  const relatedRegionsLinks = parsedKeyword ? seoulRegions.filter(
    r => r.districtName === parsedKeyword.region.districtName && r.displayName !== parsedKeyword.region.displayName && r.regionType === 'dong'
  ).slice(0, 6).map(reg => ({
    label: `${reg.displayName} ${parsedKeyword.service.keyword}`,
    href: `/?k=${encodeURIComponent(reg.displayName + '-' + parsedKeyword.service.keyword)}`
  })) : null;

  // Toggle district view
  const toggleDistrict = (distName) => {
    setOpenDistricts(prev => ({
      ...prev,
      [distName]: !prev[distName]
    }));
  };

  const setAllDistricts = (val) => {
    const next = {};
    metrics.uniqueDistricts.forEach(dist => {
      next[dist] = val;
    });
    setOpenDistricts(next);
  };

  // Dynamic layout check hook
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const renderContent = () => {
    if (isKeywordInvalid) {
      return (
        <SectionContainer padding="80px 20px">
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--forest-green-main)' }}>요청한 지역 또는 시공 서비스를 찾을 수 없습니다.</h2>
            <p style={{ marginBottom: '24px', opacity: 0.8 }}>등록된 지역과 서비스는 통합 페이지에서 확인해 주세요.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <PrimaryButton onClick={() => navigate('/')}>메인으로 돌아가기</PrimaryButton>
              <SecondaryButton onClick={() => navigate('/sitemap-seoul')}>지역 시공안내 보기</SecondaryButton>
            </div>
          </div>
        </SectionContainer>
      );
    }

    // B: Sitemap Hub Page (/sitemap-seoul)
    if (path === '/sitemap-seoul') {
      return (
        <SectionContainer padding="60px 20px">
          {/* Header titles */}
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--forest-green-sub)', letterSpacing: '1px', fontWeight: 'bold' }}>
              SEO DIRECTORY
            </span>
            <h1 style={{ marginTop: '8px', marginBottom: '16px', fontSize: '2.5rem' }}>
              서울 탄성코트·줄눈시공<br />지역별 페이지 안내
            </h1>
            <p style={{ opacity: 0.8, maxWidth: '720px', lineHeight: 1.6, fontSize: '1.05rem' }}>
              서울 자치구와 동 단위 지역별 탄성코트·줄눈시공 페이지를 확인할 수 있습니다. 지역명 또는 시공 서비스를 선택해 필요한 페이지로 이동해 주세요.
            </p>
          </div>

          {/* Database parameters display cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '40px'
          }}>
            {[
              { label: '등록된 자치구', value: `${metrics.uniqueDistricts.length} 개 구` },
              { label: '등록된 동 단위', value: `${metrics.dongsCount} 개 동` },
              { label: '등록 전체 지역명', value: `${metrics.totalRegionsCount} 개` },
              { label: '등록 작업명', value: `${metrics.totalTasksCount} 개` },
              { label: '생성 가능 전체 URL', value: `${metrics.totalUrlsCount.toLocaleString()} 개` }
            ].map((m, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--light-sand)',
                padding: '16px',
                borderRadius: '4px',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7, display: 'block', marginBottom: '4px' }}>{m.label}</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--forest-green-main)' }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Real-time search filters */}
          <div style={{
            backgroundColor: 'var(--light-sand)',
            padding: '24px',
            borderRadius: '6px',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['전체', '탄성코트', '줄눈시공'].map(btn => (
                <button
                  key={btn}
                  onClick={() => setSitemapFilter(btn)}
                  style={{
                    padding: '8px 24px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    backgroundColor: sitemapFilter === btn ? 'var(--forest-green-main)' : 'var(--white)',
                    color: sitemapFilter === btn ? 'var(--white)' : 'var(--charcoal-text)',
                    border: '1px solid var(--sand-beige)'
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
              gap: '16px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>지역명 검색</label>
                <input
                  type="text"
                  placeholder="예: 화곡본동, 강남구, 역삼동"
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid var(--sand-beige)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>작업명 검색</label>
                <input
                  type="text"
                  placeholder="예: 탄성코트업체, 욕실줄눈시공"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid var(--sand-beige)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {(regionSearch || taskSearch) && (
              <button
                onClick={() => { setRegionSearch(''); setTaskSearch(''); }}
                style={{ alignSelf: 'flex-start', fontSize: '0.85rem', color: 'var(--forest-green-sub)', textDecoration: 'underline' }}
              >
                검색 조건 초기화
              </button>
            )}
          </div>

          {/* Quick jump to districts */}
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--forest-green-sub)' }}>자치구 빠른 이동</h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {metrics.uniqueDistricts.map(dist => (
                <a
                  key={dist}
                  href={`#district-${dist}`}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--light-sand)',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: 'var(--charcoal-text)'
                  }}
                >
                  {dist}
                </a>
              ))}
            </div>
          </div>

          {/* Bulk accordion buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'flex-end' }}>
            <SecondaryButton style={{ minHeight: '36px', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setAllDistricts(true)}>
              모두 펼치기
            </SecondaryButton>
            <SecondaryButton style={{ minHeight: '36px', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setAllDistricts(false)}>
              모두 접기
            </SecondaryButton>
          </div>

          {/* Accordion Links directory layout (with search filtering processed purely via styles) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {metrics.uniqueDistricts.map(distName => {
              const regionList = metrics.groupedRegions[distName];
              
              // Filter check: are there ANY matching elements in this district?
              const matchesSearch = regionList.some(r => {
                const regionMatches = r.displayName.includes(regionSearch) || r.normalizedName.includes(regionSearch);
                const taskMatches = serviceKeywords.some(tk => tk.keyword.includes(taskSearch));
                return regionMatches && taskMatches;
              });

              return (
                <div
                  key={distName}
                  id={`district-${distName}`}
                  style={{
                    display: matchesSearch ? 'block' : 'none',
                    border: '1px solid var(--light-sand)',
                    backgroundColor: 'var(--white)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    textAlign: 'left'
                  }}
                >
                  {/* District Title bar */}
                  <button
                    onClick={() => toggleDistrict(distName)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'var(--white)',
                      border: 'none',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: 'var(--forest-green-main)'
                    }}
                  >
                    <span>{distName} ({regionList.length}개 지역)</span>
                    <span>{openDistricts[distName] ? '−' : '+'}</span>
                  </button>

                  {/* Links loop (Always rendered in DOM, toggled via style displays for crawlers) */}
                  <div style={{
                    display: openDistricts[distName] ? 'block' : 'none',
                    borderTop: '1px solid var(--light-sand)',
                    padding: '24px',
                    backgroundColor: 'var(--warm-white)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {regionList.map(reg => {
                        const isRegionMatched = reg.displayName.includes(regionSearch) || reg.normalizedName.includes(regionSearch);
                        
                        return (
                          <div
                            key={reg.displayName}
                            style={{
                              display: isRegionMatched ? 'block' : 'none',
                            }}
                          >
                            <h4 style={{ fontSize: '0.95rem', color: 'var(--forest-green-sub)', marginBottom: '10px' }}>
                              {reg.displayName} 시공 링크 목록
                            </h4>
                            
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                              gap: '8px'
                            }}>
                              {serviceKeywords.map(tk => {
                                const isFilterMatched = sitemapFilter === '전체' || tk.serviceGroup === (sitemapFilter === '탄성코트' ? 'elastic' : 'grout');
                                const isTaskSearchMatched = tk.keyword.includes(taskSearch);
                                
                                return (
                                  <a
                                    key={tk.keyword}
                                    href={`/?k=${encodeURIComponent(reg.displayName + '-' + tk.keyword)}`}
                                    style={{
                                      display: (isFilterMatched && isTaskSearchMatched) ? 'inline-block' : 'none',
                                      padding: '8px 12px',
                                      border: '1px solid var(--light-sand)',
                                      borderRadius: '4px',
                                      backgroundColor: 'var(--white)',
                                      fontSize: '0.85rem',
                                      color: 'var(--charcoal-text)'
                                    }}
                                  >
                                    {reg.displayName} {tk.keyword}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back to top links */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <a href="#" style={{ fontSize: '0.9rem', color: 'var(--forest-green-sub)', textDecoration: 'underline' }}>
              상단으로 바로 가기 ↑
            </a>
          </div>
        </SectionContainer>
      );
    }

    // C: Main Page & Dynamic Landing Page
    return (
      <>
        {parsedKeyword && (
          <div style={{ backgroundColor: 'var(--light-sand)', padding: '12px 20px', textAlign: 'center', fontSize: '0.9rem' }}>
            <strong>{parsedKeyword.region.displayName}</strong> 지역을 위한 맞춤형 <strong>{parsedKeyword.service.keyword}</strong> 제안입니다.
          </div>
        )}

        {/* 1. HERO SECTION */}
        <SectionContainer id="hero" padding="60px 20px">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '45fr 55fr' : '1fr',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--forest-green-sub)', letterSpacing: '1px', fontWeight: '600' }}>
                탄성코트 · 줄눈시공 전문
              </span>
              <h1 style={{ lineHeight: '1.2', fontSize: isDesktop ? '3rem' : '2.25rem' }}>
                {parsedKeyword 
                  ? `${parsedKeyword.region.displayName} ${parsedKeyword.service.keyword}`
                  : '공간을 오래 깨끗하게 만드는'
                }
                <br />
                {parsedKeyword 
                  ? parsedKeyword.service.heroTitleTemplate
                  : '탄성코트·줄눈시공'
                }
              </h1>
              <p style={{ opacity: 0.85, fontSize: '1.05rem', lineHeight: 1.6 }}>
                {parsedKeyword 
                  ? parsedKeyword.service.heroDescriptionTemplate
                  : '베란다와 세탁실 벽면부터 욕실과 현관의 타일 틈까지, 기존 상태를 확인하고 공간에 필요한 마감 시공을 안내합니다.'
                }
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <PrimaryButton style={{ flex: 1 }} onClick={handleCTA}>사진으로 시공 상담</PrimaryButton>
                <SecondaryButton style={{ flex: 1 }} onClick={handlePhoneCall}>전화로 바로 문의</SecondaryButton>
              </div>
            </div>

            <div>
              <ImagePlaceholder 
                label={parsedKeyword 
                  ? parsedKeyword.service.imagePlaceholderKey 
                  : (activeHeroSlide === 0 ? 'ELASTIC_COATING_HERO' : 'GROUT_HERO')
                } 
                ratio="4:5" 
                size="Main image (4:5 / Recommended: 800x1000)" 
              />
            </div>
          </div>
        </SectionContainer>

        {/* 2. SERVICE SELECTION SECTION */}
        {activeGroup === 'both' && (
          <SectionContainer id="service-selection" background="sand" padding="80px 20px">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ marginBottom: '12px' }}>전문 시공 분야 제안</h2>
              <p style={{ opacity: 0.8 }}>각 공간별 특화 마감재 적용으로 습기와 오염의 영향을 관리합니다.</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
              gap: '40px'
            }}>
              {/* Elastic Coating Panel */}
              <div style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px'
              }}>
                <div>
                  <ImagePlaceholder label="ELASTIC_COATING_SERVICE_IMAGE" ratio="16:9" size="Recommended: 600x338" />
                  <h3 style={{ margin: '20px 0 10px 0', fontSize: '1.4rem' }}>벽면 마감을 위한 탄성코트</h3>
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    베란다와 세탁실의 기존 도장 상태를 확인하고, 바탕면 정리부터 탄성코트 마감까지 필요한 범위를 안내합니다.
                  </p>
                  <div style={{ borderTop: '1px solid var(--light-sand)', paddingTop: '16px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                    <p><strong>적용 공간:</strong> 베란다 · 세탁실 · 다용도실</p>
                    <p><strong>확인 사항:</strong> 들뜸 · 오염 · 균열 · 기존 도장 상태</p>
                    <p><strong>시공 방향:</strong> 바탕면 상태에 맞춘 벽면 마감</p>
                  </div>
                </div>
                <SecondaryButton onClick={() => {
                  const el = document.querySelector('#elastic-coating');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>탄성코트 시공 정보 보기</SecondaryButton>
              </div>

              {/* Grout Art Panel */}
              <div style={{
                backgroundColor: 'var(--white)',
                padding: '30px',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                marginTop: isDesktop ? '40px' : '0'
              }}>
                <div>
                  <ImagePlaceholder label="GROUT_SERVICE_IMAGE" ratio="16:9" size="Recommended: 600x338" />
                  <h3 style={{ margin: '20px 0 10px 0', fontSize: '1.4rem' }}>타일 틈새를 정돈하는 줄눈시공</h3>
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                    욕실과 현관 등 타일 틈의 기존 줄눈 상태를 확인하고, 공간의 사용 환경에 맞는 자재와 색상을 안내합니다.
                  </p>
                  <div style={{ borderTop: '1px solid var(--light-sand)', paddingTop: '16px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                    <p><strong>적용 공간:</strong> 욕실 · 화장실 · 현관 · 베란다</p>
                    <p><strong>확인 사항:</strong> 오염 · 갈라짐 · 탈락 · 기존 줄눈 상태</p>
                    <p><strong>시공 방향:</strong> 기존 줄눈 정리 후 공간별 마감</p>
                  </div>
                </div>
                <SecondaryButton onClick={() => {
                  const el = document.querySelector('#grout');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>줄눈시공 정보 보기</SecondaryButton>
              </div>
            </div>
          </SectionContainer>
        )}

        {/* 2b. SINGLE SERVICE SPECIFIC PANELS */}
        {activeGroup === 'elastic' && (
          <SectionContainer id="elastic-coating" background="sand" padding="80px 20px">
            <ServiceSection
              label="ECO ELASTIC PAINT"
              title="벽면 마감을 위한 탄성코트"
              description="베란다와 세탁실의 기존 도장 상태를 확인하고, 바탕면 정리부터 탄성코트 마감까지 필요한 범위를 안내합니다."
            >
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: '20px', marginTop: '20px', textAlign: 'left' }}>
                <ImagePlaceholder label="ELASTIC_COATING_SERVICE_BEFORE" ratio="4:3" size="Before 이미지" />
                <ImagePlaceholder label="ELASTIC_COATING_SERVICE_AFTER" ratio="4:3" size="After 이미지" />
              </div>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '0.95rem' }}>
                <p><strong>적용 공간:</strong> 베란다 · 세탁실 · 다용도실</p>
                <p><strong>확인 사항:</strong> 들뜸 · 오염 · 균열 · 기존 도장 상태</p>
                <p><strong>시공 방향:</strong> 바탕면 상태에 맞춘 벽면 마감</p>
              </div>
            </ServiceSection>
          </SectionContainer>
        )}

        {activeGroup === 'grout' && (
          <SectionContainer id="grout" background="sand" padding="80px 20px">
            <ServiceSection
              label="PREMIUM GROUT ART"
              title="타일 틈새를 정돈하는 줄눈시공"
              description="욕실과 현관 등 타일 틈의 기존 줄눈 상태를 확인하고, 공간의 사용 환경에 맞는 자재와 색상을 안내합니다."
            >
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: '20px', marginTop: '20px', textAlign: 'left' }}>
                <ImagePlaceholder label="GROUT_SERVICE_BEFORE" ratio="4:3" size="Before 이미지" />
                <ImagePlaceholder label="GROUT_SERVICE_AFTER" ratio="4:3" size="After 이미지" />
              </div>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '0.95rem' }}>
                <p><strong>적용 공간:</strong> 욕실 · 화장실 · 현관 · 베란다</p>
                <p><strong>확인 사항:</strong> 오염 · 갈라짐 · 탈락 · 기존 줄눈 상태</p>
                <p><strong>시공 방향:</strong> 기존 줄눈 정리 후 공간별 마감</p>
              </div>
            </ServiceSection>
          </SectionContainer>
        )}

        {/* 3. BEFORE & AFTER SECTION */}
        <SectionContainer id="before-after" padding="80px 20px">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--forest-green-sub)', letterSpacing: '1px', fontWeight: 'bold' }}>
              BEFORE & AFTER
            </span>
            <h2 style={{ marginTop: '8px' }}>시공 전 상태와 완료 후 마감을 비교해 보세요</h2>
            <p style={{ opacity: 0.8, marginTop: '12px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              시공 결과는 기존 벽면과 타일 상태, 보수 범위, 선택한 자재에 따라 달라질 수 있습니다. 실제 시공 전후 사진을 기준으로 필요한 작업 범위를 확인해 주세요.
            </p>
          </div>

          {activeGroup === 'both' && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
              <button
                onClick={() => setBeforeAfterTab('elastic')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  backgroundColor: beforeAfterTab === 'elastic' ? 'var(--forest-green-main)' : 'var(--light-sand)',
                  color: beforeAfterTab === 'elastic' ? 'var(--white)' : 'var(--charcoal-text)',
                  transition: 'all 0.2s'
                }}
              >
                베란다·세탁실 벽면 마감
              </button>
              <button
                onClick={() => setBeforeAfterTab('grout')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  backgroundColor: beforeAfterTab === 'grout' ? 'var(--forest-green-main)' : 'var(--light-sand)',
                  color: beforeAfterTab === 'grout' ? 'var(--white)' : 'var(--charcoal-text)',
                  transition: 'all 0.2s'
                }}
              >
                욕실·현관 타일 틈새 마감
              </button>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: '30px',
            textAlign: 'left'
          }}>
            {(activeGroup === 'elastic' || (activeGroup === 'both' && beforeAfterTab === 'elastic')) ? (
              <>
                <div>
                  <ImagePlaceholder label="ELASTIC_COATING_BEFORE" ratio="4:3" size="Recommended: 600x450" />
                  <p style={{ marginTop: '12px', fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>
                    <strong>시공 전:</strong> 기존 도장의 들뜸과 오염 상태를 확인하고 바탕면을 정리한 뒤 마감합니다.
                  </p>
                </div>
                <div>
                  <ImagePlaceholder label="ELASTIC_COATING_AFTER" ratio="4:3" size="Recommended: 600x450" />
                  <p style={{ marginTop: '12px', fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>
                    <strong>시공 후:</strong> 정돈된 세라믹 탄성 마감 도포면 구현 예시
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <ImagePlaceholder label="GROUT_BEFORE" ratio="4:3" size="Recommended: 600x450" />
                  <p style={{ marginTop: '12px', fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>
                    <strong>시공 전:</strong> 기존 줄눈 상태를 확인하고 필요한 범위는 제거와 정리 후 다시 시공합니다.
                  </p>
                </div>
                <div>
                  <ImagePlaceholder label="GROUT_AFTER" ratio="4:3" size="Recommended: 600x450" />
                  <p style={{ marginTop: '12px', fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.5 }}>
                    <strong>시공 후:</strong> 정밀하고 정돈된 타일 틈새 방오 코팅 마감 예시
                  </p>
                </div>
              </>
            )}
          </div>
        </SectionContainer>

        {/* 4. SPACE GUIDE SECTION */}
        {activeGroup !== 'grout' && (
          <SectionContainer id="space-guide" background="sand" padding="80px 20px">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2>공간별 시공 안내 가이드</h2>
            <p style={{ opacity: 0.8, marginTop: '8px' }}>거주 공간별 환경 특징과 확인해야 할 마감 상태를 상세히 안내합니다.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '250px 1fr' : '1fr',
            gap: '40px'
          }}>
            <div style={{ display: 'flex', flexDirection: isDesktop ? 'column' : 'row', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
              {spaceGuideKeys.map((k, idx) => (
                <button
                  key={k}
                  onClick={() => setActiveSpaceIndex(idx)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 20px',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    backgroundColor: activeSpaceIndex === idx ? 'var(--forest-green-main)' : 'var(--white)',
                    color: activeSpaceIndex === idx ? 'var(--white)' : 'var(--charcoal-text)',
                    border: '1px solid var(--light-sand)',
                    fontWeight: activeSpaceIndex === idx ? '600' : 'normal',
                    width: isDesktop ? '100%' : 'auto',
                    minWidth: isDesktop ? 'none' : '120px'
                  }}
                >
                  {SPACE_GUIDE_DATA[k].name}
                </button>
              ))}
            </div>

            <div style={{
              backgroundColor: 'var(--white)',
              padding: '30px',
              borderRadius: '6px',
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 1.2fr' : '1fr',
              gap: '24px',
              alignItems: 'center'
            }}>
              <ImagePlaceholder 
                label={parsedKeyword ? `${parsedKeyword.region.displayName}_${SPACE_GUIDE_DATA[activeSpaceKey].img}` : SPACE_GUIDE_DATA[activeSpaceKey].img} 
                ratio="4:3" 
                size="Recommended: 500x375" 
              />
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.4rem' }}>{SPACE_GUIDE_DATA[activeSpaceKey].name} 안내</h3>
                <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {SPACE_GUIDE_DATA[activeSpaceKey].desc}
                </p>
                <div>
                  <SecondaryButton onClick={handleCTA} style={{ fontSize: '0.9rem', padding: '10px 20px', minHeight: '40px' }}>
                    상세 정보 보기
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
        )}

        {/* 5. QUALITY STANDARD SECTION */}
        <SectionContainer id="quality-standard" padding="80px 20px">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2>시공 품질 기준</h2>
            <p style={{ opacity: 0.8, marginTop: '8px' }}>기초 분석부터 세밀한 확인까지 모든 마감 단계의 품질 기준을 준수합니다.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {[
              { num: '01', title: '기존 상태 확인', desc: '사진과 현장 상태를 통해 기존 도장, 타일, 줄눈의 손상 범위를 확인합니다.' },
              { num: '02', title: '바탕면과 틈새 정리', desc: '들뜬 페인트 도장과 오염된 부분, 기존 줄눈 등 마감에 영향을 주는 요소를 정돈합니다.' },
              { num: '03', title: '필요한 보수 범위 확인', desc: '단순 마감이 가능한지, 아니면 균열 및 미세 결로 원인을 사전에 파악해야 하는지 정확히 구분합니다.' },
              { num: '04', title: '자재와 색상 선택', desc: '공간의 사용 빈도, 습기 발생 여부 및 타일과 인테리어 톤의 배합을 고려하여 자재와 최적의 마감 조색을 제안합니다.' },
              { num: '05', title: '최종 마감 확인', desc: '도포 깊이와 마감 표면 광택 상태를 확인하고, 경화 건조 과정에서의 안심 유의사항을 정밀 전달합니다.' }
            ].map((step, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '100px 300px 1fr' : '1fr',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--light-sand)',
                alignItems: 'baseline',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--sand-beige)', lineHeight: 1 }}>
                  {step.num}
                </span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--forest-green-main)' }}>{step.title}</h3>
                <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </SectionContainer>

        {/* 6. PROCESS SECTION */}
        <SectionContainer id="process" background="sand" padding="80px 20px">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: isDesktop ? '2rem' : '1.6rem', color: 'var(--forest-green-main)', marginBottom: '12px', lineHeight: '1.3' }}>
              상담부터 마감까지<br />5단계로 확인하고 진행합니다
            </h2>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--charcoal-text)' }}>
              공간 상태와 시공 범위를 먼저 확인한 뒤,<br />단계별로 필요한 작업을 진행합니다.
            </p>
          </div>

          {isDesktop ? (
            /* PC: 5 steps horizontal flow with circular numbers and connector lines */
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              width: '100%',
              padding: '20px 0'
            }}>
              {/* Connected Line Background */}
              <div style={{
                position: 'absolute',
                top: '40px',
                left: '10%',
                right: '10%',
                height: '2px',
                backgroundColor: 'rgba(24, 63, 53, 0.2)',
                zIndex: 1
              }}></div>

              {[
                { num: '01', title: '사진 상담', desc: '공간 전체와 문제가 있는 부분의 사진을 확인합니다.' },
                { num: '02', title: '기존 상태 확인', desc: '벽면과 타일, 기존 도장과 줄눈의 상태를 점검합니다.' },
                { num: '03', title: '범위·자재 안내', desc: '필요한 작업 범위와 적용할 자재·색상을 안내합니다.' },
                { num: '04', title: '바탕 정리·시공', desc: '기존 마감을 정리한 뒤 공간에 맞는 방식으로 시공합니다.' },
                { num: '05', title: '마감 검수', desc: '완료 상태를 확인하고 건조와 관리 방법을 안내합니다.' }
              ].map((step, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  width: '18%',
                  textAlign: 'center',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  {/* Circular Number Element */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forest-green-main)',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    marginBottom: '16px',
                    boxShadow: '0 0 0 4px var(--warm-white)'
                  }}>
                    {step.num}
                  </div>
                  {/* Step Title */}
                  <h4 style={{
                    fontSize: '1.05rem',
                    color: 'var(--forest-green-main)',
                    fontWeight: '700',
                    marginBottom: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    {step.title}
                  </h4>
                  {/* Step Description */}
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--charcoal-text)',
                    lineHeight: '1.5',
                    padding: '0 4px',
                    wordBreak: 'keep-all'
                  }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* Mobile: Vertical timeline flow */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              paddingLeft: '20px',
              textAlign: 'left'
            }}>
              {/* Vertical Connector Line */}
              <div style={{
                position: 'absolute',
                top: '20px',
                bottom: '40px',
                left: '36px',
                width: '2px',
                backgroundColor: 'rgba(24, 63, 53, 0.2)',
                zIndex: 1
              }}></div>

              {[
                { num: '01', title: '사진 상담', desc: '공간 전체와 문제가 있는 부분의 사진을 확인합니다.' },
                { num: '02', title: '기존 상태 확인', desc: '벽면과 타일, 기존 도장과 줄눈의 상태를 점검합니다.' },
                { num: '03', title: '범위·자재 안내', desc: '필요한 작업 범위와 적용할 자재·색상을 안내합니다.' },
                { num: '04', title: '바탕 정리·시공', desc: '기존 마감을 정리한 뒤 공간에 맞는 방식으로 시공합니다.' },
                { num: '05', title: '마감 검수', desc: '완료 상태를 확인하고 건조와 관리 방법을 안내합니다.' }
              ].map((step, idx, arr) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: idx === arr.length - 1 ? '0' : '36px',
                  position: 'relative',
                  zIndex: 2,
                  alignItems: 'flex-start'
                }}>
                  {/* Circular Number Element */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--forest-green-main)',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    boxShadow: '0 0 0 3px var(--warm-white)'
                  }}>
                    {step.num}
                  </div>
                  {/* Title and Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      color: 'var(--forest-green-main)',
                      fontWeight: '700'
                    }}>
                      {step.title}
                    </h4>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--charcoal-text)',
                      lineHeight: '1.5',
                      margin: 0,
                      wordBreak: 'keep-all'
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionContainer>



        {/* 8. DETAILED INFORMATION SECTION */}
        <SectionContainer id="detailed-information" background="sand" padding="80px 20px">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2>세부 시공 가이드라인 안내</h2>
            <p style={{ opacity: 0.8, marginTop: '8px' }}>공간 관리 편의성과 오랜 마감 유지를 위해 사전에 확인해야 할 세부 정보들입니다.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(activeGroup === 'elastic' || activeGroup === 'both') && (
              <>
                <details style={styles.detailAccordion}>
                  <summary style={styles.detailSummary}>
                    <span>시공 전 벽면 상태 확인</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--forest-green-sub)' }}>상세 정보 보기</span>
                  </summary>
                  <div style={styles.detailContent}>
                    <ul>
                      <li>기존 페인트와 탄성코트의 들뜸 상태가 관찰되는지 사전 타진 검사가 수반되어야 합니다.</li>
                      <li>균열 및 오염의 손상 깊이와 범위를 파악해 실리콘 보강 계획을 수립합니다.</li>
                      <li>단순 결로와 외부 결손으로 인한 내부 누수 의심 흔적을 정확히 구분하여야 합니다.</li>
                      <li style={{ color: 'var(--forest-green-main)', fontWeight: '600' }}>※ 만약 마감 부위에 누수 원인이 심하게 의심되는 경우에는 도포를 미루고 전문적인 원인 진단과 보수가 선행되어야 합니다.</li>
                    </ul>
                  </div>
                </details>
                <details style={styles.detailAccordion}>
                  <summary style={styles.detailSummary}>
                    <span>기존 탄성코트 재시공 판단 기준</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--forest-green-sub)' }}>상세 정보 보기</span>
                  </summary>
                  <div style={styles.detailContent}>
                    <ul>
                      <li>기존 페인트 코팅층의 밀착력이 상실되어 도막이 들뜨고 부풀어 오르는 현상이 발견되는 경우</li>
                      <li>손가락으로 눌렀을 때 표면 바스락거림과 내부 빈 공간의 탈락 징후가 인지될 때</li>
                      <li>기존 노화된 마감 페인트면 위에 긁어내는 전처리를 누락한 채 무조건적인 덧시공을 하지 않습니다.</li>
                    </ul>
                  </div>
                </details>
              </>
            )}

            {(activeGroup === 'grout' || activeGroup === 'both') && (
              <>
                <details style={styles.detailAccordion}>
                  <summary style={styles.detailSummary}>
                    <span>기존 줄눈 상태 확인 및 제거 여부</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--forest-green-sub)' }}>상세 정보 보기</span>
                  </summary>
                  <div style={styles.detailContent}>
                    <ul>
                      <li>작업 전 타일 틈 사이 기존 백시멘트를 정해진 깊이만큼 깨끗하게 긁어내 제거하는 공정 검토</li>
                      <li>타일 옆면의 기존 백시멘트를 정교한 깊이로 정돈해 채워 넣는 것이 장기적인 내구성의 기준입니다.</li>
                      <li>줄눈은 표면 관리의 청결함을 보완하는 것으로, 전체 타일의 방수 공사를 대체하는 것은 아닙니다.</li>
                    </ul>
                  </div>
                </details>
                <details style={styles.detailAccordion}>
                  <summary style={styles.detailSummary}>
                    <span>공간별 자재와 색상 선택 기준</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--forest-green-sub)' }}>상세 정보 보기</span>
                  </summary>
                  <div style={styles.detailContent}>
                    <ul>
                      <li>습기에 24시간 노출되는 욕실 바닥과 흙먼지 유입이 심한 현관의 오염원 체크</li>
                      <li>베란다와 같이 온도 변화에 유연하게 대처할 수 있는 탄성력 높은 줄눈제 배치</li>
                      <li>타일 마감재 패턴과 조화로운 메탈릭 실버, 다크 그레이 등 맞춤형 조색 선택</li>
                    </ul>
                  </div>
                </details>
              </>
            )}

            {activeIntent === 'agency' && (
              <details style={styles.detailAccordion}>
                <summary style={styles.detailSummary}>
                  <span>업체 선택 전 확인할 기준</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--forest-green-sub)' }}>상세 정보 보기</span>
                </summary>
                <div style={styles.detailContent}>
                  <ul>
                    <li>과장된 영구적 보증 대신 시공 전 바탕면 정리 범위를 정직하게 설명하는가</li>
                    <li>시공 견적 상에 마감 범위와 전처리 깊이 등의 상세 단가가 명시되어 있는가</li>
                    <li>제공하는 실제 시공 사례의 근접 촬영 컷을 통해 도포 표면 균일도를 비교해 보십시오.</li>
                  </ul>
                </div>
              </details>
            )}

            <details style={styles.detailAccordion}>
              <summary style={styles.detailSummary}>
                <span>시공 후 건조와 관리 방법</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--forest-green-sub)' }}>상세 정보 보기</span>
              </summary>
              <div style={styles.detailContent}>
                <ul>
                  <li>시공 직후 일체의 틈새 물 접촉 및 도포면 물리적 접촉이 가지 않도록 사전 양생 수칙 엄수</li>
                  <li>자극적인 고농도 산성 락스 세정보다는 약알칼리/중성 세제와 함께 부드러운 스폰지로 가볍게 관리</li>
                  <li>양생 시간은 현장의 자재 수지 경화 특징과 현장 온습도 지표에 맞춰 최종 완료 시 개별 보고</li>
                </ul>
              </div>
            </details>
          </div>
        </SectionContainer>

        {/* 9. FAQ SECTION */}
        <SectionContainer id="faq" padding="80px 20px">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2>자주 묻는 질문 (FAQ)</h2>
            <p style={{ opacity: 0.8, marginTop: '8px' }}>시공 문의 전에 미리 확인해 보시면 도움이 되는 질문들입니다.</p>
          </div>
          <Accordion items={currentFaqList} />
        </SectionContainer>

        {/* 10. FINAL CONSULTATION SECTION */}
        <SectionContainer id="consultation" background="sand" padding="100px 20px">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: '40px',
            alignItems: 'center',
            textAlign: 'left'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--forest-green-sub)', letterSpacing: '1px', fontWeight: 'bold' }}>
                CONSULTATION
              </span>
              <h2 style={{ fontSize: '2rem', margin: '8px 0 16px 0', lineHeight: 1.25 }}>
                {parsedKeyword 
                  ? `${parsedKeyword.region.displayName} 시공 상담 문의`
                  : '사진을 보내주시면 필요한 시공 범위부터 확인합니다'
                }
              </h2>
              <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '24px', fontSize: '1.02rem' }}>
                공간 전체 사진과 문제가 있는 부분을 함께 보내주세요. 기존 마감 상태를 확인한 뒤 상담에 필요한 내용을 안내합니다.
              </p>
              
              <div style={{ backgroundColor: 'var(--white)', padding: '20px', borderRadius: '4px', marginBottom: '24px', fontSize: '0.9rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--forest-green-main)' }}>사진 상담 접수 시 확인 정보</p>
                <ul style={{ paddingLeft: '20px', lineHeight: 1.6, opacity: 0.85 }}>
                  <li>공간 전체가 보이는 원거리 구도 사진</li>
                  <li>들뜸, 곰팡이, 타일 깨짐 등 문제가 있는 부분의 정밀 밀착 컷</li>
                  <li>실외기 주변부, 세탁 배관 결로 부위, 창틀 코킹 주변부 사진</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <PrimaryButton onClick={handleCTA}>사진 상담하기</PrimaryButton>
                <SecondaryButton onClick={handlePhoneCall}>전화 상담하기</SecondaryButton>
              </div>
            </div>
            <div>
              <ImagePlaceholder 
                label={activeGroup === 'grout' 
                  ? 'GROUT_CONSULTATION_IMAGE_PATTERN' 
                  : (activeGroup === 'elastic' ? 'ELASTIC_CONSULTATION_IMAGE_PATTERN' : 'CONSULTATION_IMAGE_PATTERN')
                } 
                ratio="16:9" 
                size="Recommended: 800x450" 
              />
            </div>
          </div>
        </SectionContainer>

        {/* 11. INTERNAL LINKING SECTION */}
        {parsedKeyword && (
          <SectionContainer background="white" padding="40px 20px">
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {relatedServicesLinks && relatedServicesLinks.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--forest-green-sub)' }}>관련 서비스 정보</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {relatedServicesLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          const url = new URL(e.target.href);
                          navigate('/', url.search.substring(1));
                        }}
                        style={{
                          fontSize: '0.85rem',
                          padding: '6px 12px',
                          border: '1px solid var(--light-sand)',
                          borderRadius: '4px',
                          backgroundColor: 'var(--warm-white)',
                          color: 'var(--charcoal-text)'
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {relatedRegionsLinks && relatedRegionsLinks.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--forest-green-sub)' }}>인근 시공 지역 바로가기</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {relatedRegionsLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          const url = new URL(e.target.href);
                          navigate('/', url.search.substring(1));
                        }}
                        style={{
                          fontSize: '0.85rem',
                          padding: '6px 12px',
                          border: '1px solid var(--light-sand)',
                          borderRadius: '4px',
                          backgroundColor: 'var(--warm-white)',
                          color: 'var(--charcoal-text)'
                        }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>
        )}

        {/* Dynamic SEO section container */}
        {parsedKeyword && (
          <SEOContentSection keywordInfo={{ region: parsedKeyword.region.displayName, service: parsedKeyword.service.keyword }} />
        )}
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onNavigate={navigate} currentPath={path} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <Footer onNavigate={navigate} />
      {/* Hide Fixed CTA only on sitemap directory page */}
      {path !== '/sitemap-seoul' && (
        <MobileFixedCTA onPhoneClick={handlePhoneCall} onChatClick={handleCTA} />
      )}
    </div>
  );
}

const styles = {
  detailAccordion: {
    backgroundColor: 'var(--white)',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid var(--light-sand)',
    textAlign: 'left'
  },
  detailSummary: {
    fontWeight: '600',
    color: 'var(--forest-green-main)',
    cursor: 'pointer',
    fontSize: '1.05rem',
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailContent: {
    marginTop: '14px',
    borderTop: '1px solid var(--light-sand)',
    paddingTop: '14px',
    fontSize: '0.9rem',
    opacity: 0.85,
    lineHeight: 1.65
  }
};

export default App;
