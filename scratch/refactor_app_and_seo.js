import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.join(__dirname, '..');

// 1. Refactor src/App.jsx
let appContent = fs.readFileSync(path.join(workspaceRoot, 'src/App.jsx'), 'utf-8');

// Normalize line endings to \n
appContent = appContent.replace(/\r\n/g, '\n');

// Replace metrics useMemo
const metricsOldStart = '  // Pre-calculate Hub parameters and metrics for high performance\n  const metrics = useMemo(() => {';
const metricsOldEnd = '  }, []);';

const startIdx = appContent.indexOf(metricsOldStart);
const endIdx = appContent.indexOf(metricsOldEnd, startIdx) + metricsOldEnd.length;

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find metrics block in App.jsx. Index values:', startIdx, endIdx);
  process.exit(1);
}

const newMetricsCode = `  // Pre-calculate Hub parameters and metrics for high performance
  const metrics = useMemo(() => {
    const list = getActiveRegions();
    
    // Total Dongs (dong units)
    const dongsCount = list.filter(r => r.type === 'dong').length;
    
    // Total regions (display names)
    const totalRegionsCount = list.length;
    
    // Total tasks
    const totalTasksCount = serviceKeywords.length;
    
    // Total potential URL combinations
    const totalUrlsCount = totalRegionsCount * totalTasksCount;

    // Construct hierarchy
    const metroGroups = {
      '서울권': { label: '서울권', cities: {} },
      '경기권': { label: '경기권', cities: {} },
      '인천권': { label: '인천권', cities: {} }
    };

    list.forEach(r => {
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

    const uniqueDistricts = [];
    Object.keys(metroGroups).forEach(mKey => {
      Object.keys(metroGroups[mKey].cities).forEach(cKey => {
        uniqueDistricts.push(cKey);
      });
    });

    return {
      dongsCount,
      totalRegionsCount,
      totalTasksCount,
      totalUrlsCount,
      metroGroups,
      uniqueDistricts
    };
  }, []);`;

appContent = appContent.substring(0, startIdx) + newMetricsCode + appContent.substring(endIdx);

// Also let's fix handleToggleAll in App.jsx (define it so it calls setAllDistricts)
const toggleHook = '  // Toggle district view\n  const toggleDistrict = (distName) => {\n    setOpenDistricts(prev => ({\n      ...prev,\n      [distName]: !prev[distName]\n    }));\n  };';
const toggleHookIndex = appContent.indexOf(toggleHook);
if (toggleHookIndex !== -1) {
  const newToggleHook = `  // Toggle district view
  const toggleDistrict = (distName) => {
    setOpenDistricts(prev => ({
      ...prev,
      [distName]: !prev[distName]
    }));
  };

  const handleToggleAll = (val) => {
    const next = {};
    metrics.uniqueDistricts.forEach(dist => {
      next[dist] = val;
    });
    setOpenDistricts(next);
  };`;
  appContent = appContent.replace(toggleHook, newToggleHook);
}

// Now replace sitemap-seoul render block in App.jsx
const sitemapRenderStart = '    // B: Sitemap Hub Page (/sitemap-seoul)\n    if (path === \'/sitemap-seoul\') {';
const sitemapRenderEnd = '    // C: Main Page & Dynamic Landing Page';

const sitemapStartIdx = appContent.indexOf(sitemapRenderStart);
const sitemapEndIdx = appContent.indexOf(sitemapRenderEnd);

if (sitemapStartIdx === -1 || sitemapEndIdx === -1) {
  console.error('Could not find sitemap render block in App.jsx');
  process.exit(1);
}

const newSitemapRenderCode = `    // B: Sitemap Hub Page (/sitemap-seoul)
    if (path === '/sitemap-seoul') {
      return (
        <SectionContainer padding="60px 20px">
          {/* Header titles */}
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--forest-green-sub)', letterSpacing: '1px', fontWeight: 'bold' }}>
              SEO DIRECTORY
            </span>
            <h1 style={{ marginTop: '8px', marginBottom: '16px', fontSize: '2.5rem' }}>
              수도권 탄성코트·줄눈시공<br />지역별 페이지 안내
            </h1>
            <p style={{ opacity: 0.8, maxWidth: '720px', lineHeight: 1.6, fontSize: '1.05rem' }}>
              서울·경기·인천 주요 시·구·읍·면·동 단위의 탄성코트 및 줄눈시공 서비스 페이지를 확인할 수 있습니다.
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
              { label: '등록된 행정구역', value: \`\${metrics.uniqueDistricts.length} 개 시/구\` },
              { label: '등록된 동 단위', value: \`\${metrics.dongsCount} 개 동\` },
              { label: '등록 전체 지역명', value: \`\${metrics.totalRegionsCount} 개\` },
              { label: '등록 작업명', value: \`\${metrics.totalTasksCount} 개\` },
              { label: '생성 가능 전체 URL', value: \`\${metrics.totalUrlsCount.toLocaleString()} 개\` }
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

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px dashed var(--sand-beige)', paddingTop: '16px' }}>
              {['전체', '서울', '인천', '경기'].map(btn => (
                <button
                  key={btn}
                  onClick={() => setMetroFilter(btn)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    backgroundColor: metroFilter === btn ? 'var(--forest-green-sub)' : 'var(--white)',
                    color: metroFilter === btn ? 'var(--white)' : 'var(--charcoal-text)',
                    border: '1px solid var(--sand-beige)'
                  }}
                >
                  {btn} 권역
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
          </div>

          {/* Quick jump to cities */}
          <div style={{ textAlign: 'left', marginBottom: '40px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--forest-green-sub)' }}>시/구 빠른 이동</h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {metrics.uniqueDistricts.map(dist => (
                <a
                  key={dist}
                  href={\`#city-\${dist}\`}
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
            <SecondaryButton style={{ minHeight: '36px', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => handleToggleAll(true)}>
              모두 펼치기
            </SecondaryButton>
            <SecondaryButton style={{ minHeight: '36px', padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => handleToggleAll(false)}>
              모두 접기
            </SecondaryButton>
          </div>

          {/* Hierarchical links listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {Object.keys(metrics.metroGroups).map(metroKey => {
              const metroVal = metroFilter === '서울' ? '서울권' : (metroFilter === '경기' ? '경기권' : (metroFilter === '인천' ? '인천권' : '전체'));
              if (metroFilter !== '전체' && metroKey !== metroVal) return null;

              const metro = metrics.metroGroups[metroKey];
              return (
                <div key={metroKey} style={{ textAlign: 'left' }}>
                  <h2 style={{
                    fontSize: '1.6rem',
                    color: 'var(--forest-green-main)',
                    borderBottom: '2px solid var(--forest-green-main)',
                    paddingBottom: '8px',
                    marginBottom: '20px'
                  }}>{metro.label}</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.keys(metro.cities).map(cityKey => {
                      const city = metro.cities[cityKey];
                      
                      // Count children
                      let childCount = 0;
                      let keywordLinkCount = 0;
                      Object.keys(city.districts).forEach(dk => {
                        childCount += city.districts[dk].regions.length;
                        keywordLinkCount += city.districts[dk].regions.length * 12;
                      });

                      const isOpen = !!openDistricts[cityKey];

                      return (
                        <div
                          key={cityKey}
                          id={\`city-\${cityKey}\`}
                          style={{
                            border: '1px solid var(--light-sand)',
                            backgroundColor: 'var(--white)',
                            borderRadius: '6px',
                            overflow: 'hidden'
                          }}
                        >
                          {/* City header toggle */}
                          <button
                            onClick={() => toggleDistrict(cityKey)}
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
                              color: 'var(--forest-green-main)',
                              cursor: 'pointer'
                            }}
                          >
                            <div>
                              <span>{cityKey}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 'normal', opacity: 0.7, marginLeft: '10px' }}>
                                (하위 지역: {childCount}개 / 검색 지역명: {childCount}개 / 최종 링크: {keywordLinkCount.toLocaleString()}개)
                              </span>
                            </div>
                            <span>{isOpen ? '−' : '+'}</span>
                          </button>

                          {/* Accordion body */}
                          {isOpen && (
                            <div style={{
                              borderTop: '1px solid var(--light-sand)',
                              padding: '24px',
                              backgroundColor: 'var(--warm-white)'
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {Object.keys(city.districts).map(distKey => {
                                  const district = city.districts[distKey];
                                  return (
                                    <div key={distKey}>
                                      {distKey !== '전체' && (
                                        <h3 style={{
                                          fontSize: '1.05rem',
                                          color: 'var(--forest-green-sub)',
                                          borderLeft: '4px solid var(--forest-green-sub)',
                                          paddingLeft: '8px',
                                          marginBottom: '14px',
                                          fontWeight: 'bold'
                                        }}>{distKey}</h3>
                                      )}
                                      
                                      <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                                        gap: '12px'
                                      }}>
                                        {district.regions.map(reg => {
                                          const isRegionMatched = reg.displayName.includes(regionSearch) || reg.officialName.includes(regionSearch);
                                          if (!isRegionMatched) return null;

                                          const isDongOpen = !!openDistricts[\`dong-\${reg.id}\`];

                                          return (
                                            <div
                                              key={reg.id}
                                              style={{
                                                border: '1px solid var(--light-sand)',
                                                borderRadius: '4px',
                                                backgroundColor: 'var(--white)',
                                                padding: '12px 16px'
                                              }}
                                            >
                                              <div
                                                onClick={() => setOpenDistricts(prev => ({ ...prev, [\`dong-\${reg.id}\`]: !prev[\`dong-\${reg.id}\`] }))}
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  cursor: 'pointer',
                                                  fontWeight: '600',
                                                  color: 'var(--charcoal-text)',
                                                  fontSize: '0.9rem'
                                                }}
                                              >
                                                <span>{reg.name}</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{isDongOpen ? '접기' : '키워드 링크 보기 (12)'}</span>
                                              </div>

                                              {isDongOpen && (
                                                <div style={{
                                                  marginTop: '12px',
                                                  paddingTop: '12px',
                                                  borderTop: '1px dashed var(--light-sand)',
                                                  display: 'flex',
                                                  flexDirection: 'column',
                                                  gap: '6px'
                                                }}>
                                                  {serviceKeywords.map(tk => {
                                                    const isFilterMatched = sitemapFilter === '전체' || tk.serviceGroup === (sitemapFilter === '탄성코트' ? 'elastic' : 'grout');
                                                    const isTaskSearchMatched = tk.keyword.includes(taskSearch);
                                                    if (!isFilterMatched || !isTaskSearchMatched) return null;

                                                    return (
                                                      <a
                                                        key={tk.keyword}
                                                        href={\`/?k=\${encodeURIComponent(reg.urlRegion + '-' + tk.keyword)}\`}
                                                        style={{
                                                          fontSize: '0.85rem',
                                                          color: 'var(--forest-green-sub)',
                                                          textDecoration: 'none',
                                                          padding: '4px 0'
                                                        }}
                                                      >
                                                        {reg.displayName} {tk.keyword}
                                                      </a>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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

    // C: Main Page & Dynamic Landing Page`;

appContent = appContent.substring(0, sitemapStartIdx) + newSitemapRenderCode + appContent.substring(sitemapEndIdx);

fs.writeFileSync(path.join(workspaceRoot, 'src/App.jsx'), appContent, 'utf-8');
console.log('Successfully refactored src/App.jsx');

