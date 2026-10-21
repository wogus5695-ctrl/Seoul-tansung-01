/**
 * BARUMSPACE EDITORIAL ARTICLE REGISTRY (SSoT)
 * 
 * Defines informational decision-focused editorial articles.
 * Strictly separated from commercial dynamic landing pages (?k=).
 * 
 * In RSS-1: All 12 Pilot articles are in 'draft' status with isPublished: false.
 */

export const PILOT_EDITORIAL_ARTICLES = [
  {
    editorialId: 'nowon_elastic__paint-vs-elastic-selection',
    queryTargetId: 'nowon_elastic',
    topicId: 'paint-vs-elastic-selection',
    slug: 'nowon-elastic-coating-vs-paint-choice',
    regionId: 'nowon',
    regionName: '노원구',
    urlRegion: '노원구',
    serviceKeyword: '탄성코트',
    targetQuery: '노원구 탄성코트',
    searchIntent: 'informational_decision',
    title: '노원구 탄성코트, 일반 페인트 도색과 어떤 경우에 선택이 달라질까?',
    metaDescription: '노원구 베란다 도장 전 기존 벽면 상태와 목적에 따른 탄성코트와 일반 페인트 선택 기준 및 필수 점검 사항을 안내합니다.',
    h1: '노원구 탄성코트, 일반 페인트 도색과 선택이 달라지는 기준',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    publishedAt: '2026-10-21T09:00:00+09:00',
    modifiedAt: '2026-10-21T09:00:00+09:00',
    intro: '베란다나 다용도실의 벽면 도장이 낡거나 오염되었을 때, 단순한 일반 수성페인트 재도색으로 충분한지 아니면 탄성코트를 적용해야 하는지 고민하는 경우가 많습니다. 두 마감 방식은 비용, 도막의 내구성, 표면 질감, 그리고 시공 전 바탕면 상태에 따라 적합한 환경이 뚜렷하게 나뉩니다. 공간의 환경과 기존 도장 상태를 객관적으로 비교해 합리적인 결정을 내릴 수 있는 기준을 정리해 드립니다.',
    relatedLandingTargets: [
      {
        urlRegion: '노원구',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EB%85%B8%EC%9B%90%EA%B5%AC-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '노원구 탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '일반 페인트와 탄성코트는 무엇을 기준으로 비교해야 할까?',
        paragraphs: [
          '일반 수성페인트는 붓이나 롤러를 이용해 평평하고 얇은 도막을 형성하는 방식으로, 자재비가 저렴하고 부분적인 덧칠이나 셀프 보수가 비교적 수월하다는 장점이 있습니다. 반면 도막이 얇기 때문에 벽체의 미세 균열이나 거친 콘크리트 표면이 그대로 드러나며, 온도 차로 인한 수축과 팽창에 유연하게 대응하기 어렵습니다.',
          '탄성코트(바이오 세라믹 계열)는 전용 콤프레샤 분사 장비를 이용해 일정한 두께의 엠보싱 도막을 형성합니다. 표면 질감이 입체적이고 세라믹 다공질 입자가 포함되어 있어 공간의 시각적 완성도가 높고 미세한 벽면 요철을 가려주는 효과가 있습니다. 다만 일반 페인트에 비해 초기 시공 비용이 높고 전문 장비와 보양 작업이 필수적입니다.'
        ]
      },
      {
        title: '일반 페인트 재도색으로 충분할 수 있는 경우',
        paragraphs: [
          '모든 베란다 벽면에 탄성코트가 반드시 필요한 것은 아닙니다. 기존 벽면이 건조하고 누수나 들뜸 흔적이 거의 없으며, 단순한 생활 오염이나 색상 변색을 리프레시하고자 하는 목적이라면 일반 수성페인트 재도색만으로도 충분히 깨끗한 공간을 유지할 수 있습니다.',
          '특히 창문을 상시 개방해 통풍이 원활한 환경이거나, 단기 임대 주택 또는 거주 기간이 짧아 최소한의 비용으로 깔끔한 마감을 원할 때는 경제적인 일반 페인트 도색이 합리적인 선택이 될 수 있습니다.'
        ]
      },
      {
        title: '탄성코트를 검토해볼 수 있는 경우',
        paragraphs: [
          '외부 기온 변화에 직접 노출되는 외벽 베란다, 세탁기나 건조기 사용으로 일시적인 습도 상승이 잦은 다용도실 등에서는 탄성코트 시공을 검토해볼 수 있습니다.',
          '도막 자체의 미세 탄성이 잔잔한 크랙의 노출을 완화해주고, 오돌토돌한 세라믹 엠보 마감이 벽체의 미세 얼룩이나 손자국을 가려주어 장기적인 공간 유지 관리가 수월해집니다. 이사나 인테리어를 진행하면서 베란다를 보다 정돈된 주거 공간으로 활용하고자 할 때 선호도가 높습니다.'
        ]
      },
      {
        title: '기존 도막이 들뜨거나 벗겨졌다면 무엇을 먼저 확인해야 할까?',
        paragraphs: [
          '벽면의 페인트가 부풀어 오르거나 껍질처럼 벗겨지는 현상이 있다면, 어떤 마감재를 선택하든 칠 자체보다 \'바탕면 상태와 들뜸 원인\'을 먼저 진단해야 합니다.',
          '외부 샷시 코킹(실리콘) 노후화로 빗물이 스며들었거나, 콘크리트 자체의 균열로 수분이 유입되는 상태라면 겉면에 탄성코트를 두껍게 덮어도 얼마 지나지 않아 다시 탈락하게 됩니다. 손상된 구도막을 헤라나 스크래퍼로 단단한 면이 나올 때까지 긁어내고, 균열 보수 및 하도 프라이머 처리를 거치는 전처리 공정이 시공의 성패를 좌우합니다.'
        ]
      },
      {
        title: '탄성코트 문의 전에 소비자가 미리 확인하면 좋은 사항',
        paragraphs: [
          '업체에 견적이나 시공 가능 여부를 문의하기 전, 현장 상태를 몇 가지 항목으로 정리해 두면 보다 정확하고 현실적인 안내를 받을 수 있습니다.',
          '시공하려는 공간(베란다 개수, 실외기실 포함 여부), 샷시 교체 여부, 벽면의 기존 칠 종류(수성페인트인지 기존 탄성코트인지), 손상 부위의 면적 등을 미리 파악해 두어야 합니다. 특히 말로 설명하는 것보다 스마트폰으로 원거리 전체 사진과 근접 사진을 함께 준비하는 것이 가장 효과적입니다.'
        ]
      },
      {
        title: '업체 상담 시 전달하면 좋은 정보',
        paragraphs: [
          '상담 시 "베란다 전체를 보여주는 넓은 구도의 사진", "벗겨짐이나 곰팡이가 심한 부위의 근접 사진", "창문 모서리나 샷시 주변 사진"을 함께 전달하면 현장 방문 전에도 밑작업에 필요한 소요 시간과 정확한 범위를 파악할 수 있습니다.',
          '또한 이사 일정이나 도배, 장판, 입주청소 등 다른 인테리어 공정 일정을 함께 공유하면 양생 시간(건조 기간)을 확보할 수 있는 최적의 작업 일정을 조율할 수 있습니다.'
        ]
      }
    ],
    checklist: [
      '시공 대상 공간 범위 확인 (앞베란다, 세탁실, 실외기실 등 공간 개수)',
      '기존 벽면 도막 상태 확인 (가루 묻어남, 들뜸, 부풀어 오른 부위 유무)',
      '누수 의심 부위 점검 (창틀 주변 실리콘 갈라짐, 외벽 코너 젖음 흔적)',
      '현장 사진 촬영 (공간 전체 구도 원거리 사진 1장 + 결함 부위 근접 사진 1장)',
      '이사 및 타 공정 스케줄 정리 (도배, 마루, 입주청소 작업 일정)',
      '시공 공간 내 짐 보관 여부 및 세탁기·선반 이동 가능 여부 확인'
    ],
    faqs: [
      {
        q: '일반 수성페인트로 칠해진 벽면 위에 탄성코트를 바로 시공할 수 있나요?',
        a: '기존 수성페인트의 접착력이 양호하고 들뜸이나 부식이 없는 상태라면 표면 이물질 제거 후 시공이 가능합니다. 그러나 도막이 부풀어 있거나 가루가 심하게 묻어나는 상태라면 부실한 도막을 긁어내고 프라이머 밑작업을 선행한 후 분사해야 하자가 발생하지 않습니다.'
      },
      {
        q: '기존 페인트가 일부분만 벗겨져 있는데, 전체 벽면을 다 긁어내야 하나요?',
        a: '콘크리트에 단단히 밀착되어 있는 정상 부위까지 무리하게 긁어낼 필요는 없습니다. 다만 손으로 건드렸을 때 쉽게 떨어져 나오는 들뜬 부위는 주변 경계까지 충분히 긁어내고, 단차가 생기는 경계면을 퍼티로 메워 평탄화하는 작업이 필요합니다.'
      },
      {
        q: '이사 전 인테리어를 할 때 탄성코트 시공과 상담은 언제 진행하는 것이 적절한가요?',
        a: '탄성코트는 뿜칠 분사 특성상 도료 미립자가 날릴 수 있으므로 도배나 바닥재, 입주청소 공정보다 앞서 시공해야 합니다. 샷시 교체가 예정되어 있다면 샷시 코킹이 마른 직후에 일정을 잡는 것이 좋으며, 충분한 자연 건조를 위해 입주 7~10일 전 상담을 완료하는 것을 권장합니다.'
      }
    ]
  },
  {
    editorialId: 'nowon_balcony_elastic__move-in-schedule-timing',
    queryTargetId: 'nowon_balcony_elastic',
    topicId: 'move-in-schedule-timing',
    slug: 'nowon-balcony-elastic-coating-schedule-timing',
    regionId: 'nowon',
    regionName: '노원구',
    urlRegion: '노원구',
    serviceKeyword: '베란다탄성코트',
    targetQuery: '노원구 베란다탄성코트',
    searchIntent: 'informational_decision',
    title: '노원구 베란다탄성코트, 이사·입주 인테리어 과정에서 언제 시공해야 할까?',
    h1: '노원구 베란다탄성코트, 이사 및 인테리어 공정별 시공 시점 기준',
    metaDescription: '노원구 아파트 및 주택 이사 시 베란다 탄성코트의 적정 시공 일정과 입주 전후 공정 조율 기준을 안내합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '노원구',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EB%85%B8%EC%9B%90%EA%B5%AC-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '노원구 베란다탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'sanggye_elastic__existing-coating-peeling-reapplication',
    queryTargetId: 'sanggye_elastic',
    topicId: 'existing-coating-peeling-reapplication',
    slug: 'sanggye-elastic-coating-peeling-reapplication',
    regionId: 'sanggye',
    regionName: '상계동',
    urlRegion: '상계동',
    serviceKeyword: '탄성코트',
    targetQuery: '상계동 탄성코트',
    searchIntent: 'informational_decision',
    title: '상계동 탄성코트, 기존 도막이 들뜨거나 벗겨졌을 때 재시공 판단 기준',
    h1: '상계동 탄성코트, 기존 칠 탈락 시 재시공 여부를 판단하는 방법',
    metaDescription: '상계동 베란다 벽면의 기존 탄성코트 박리 및 부풂 현상 발생 시 덧시공 가능 여부와 전면 재시공 판단 기준을 정리해 드립니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '상계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EC%83%81%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '상계동 탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'sanggye_balcony_elastic__pre-consultation-photo-checklist',
    queryTargetId: 'sanggye_balcony_elastic',
    topicId: 'pre-consultation-photo-checklist',
    slug: 'sanggye-balcony-elastic-pre-consultation-checklist',
    regionId: 'sanggye',
    regionName: '상계동',
    urlRegion: '상계동',
    serviceKeyword: '베란다탄성코트',
    targetQuery: '상계동 베란다탄성코트',
    searchIntent: 'informational_decision',
    title: '상계동 베란다탄성코트, 견적 문의 전 어떤 사진과 상태를 미리 확인해야 할까?',
    h1: '상계동 베란다탄성코트 상담 전 준비해야 할 현장 사진과 확인 항목',
    metaDescription: '상계동 베란다 탄성코트 상담 시 정확한 견적 산출을 위해 촬영해야 하는 부위와 사전 점검 체크리스트를 안내합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '상계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EC%83%81%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '상계동 베란다탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'junggye_elastic__consultation-information-guidelines',
    queryTargetId: 'junggye_elastic',
    topicId: 'consultation-information-guidelines',
    slug: 'junggye-elastic-coating-consultation-information',
    regionId: 'junggye',
    regionName: '중계동',
    urlRegion: '중계동',
    serviceKeyword: '탄성코트',
    targetQuery: '중계동 탄성코트',
    searchIntent: 'informational_decision',
    title: '중계동 탄성코트 상담 시 업체에 어떤 정보를 전달해야 정확한 진단이 가능할까?',
    h1: '중계동 탄성코트 상담 전 업체에 공유해야 할 핵심 현장 정보',
    metaDescription: '중계동 탄성코트 상담 시 샷시 교체 여부, 곰팡이 범위, 짐 유무 등 정확한 견적을 위해 전달해야 할 정보를 정리합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '중계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EC%A4%91%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '중계동 탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'junggye_balcony_elastic__paint-removal-prerequisite-criteria',
    queryTargetId: 'junggye_balcony_elastic',
    topicId: 'paint-removal-prerequisite-criteria',
    slug: 'junggye-balcony-elastic-paint-removal-criteria',
    regionId: 'junggye',
    regionName: '중계동',
    urlRegion: '중계동',
    serviceKeyword: '베란다탄성코트',
    targetQuery: '중계동 베란다탄성코트',
    searchIntent: 'informational_decision',
    title: '중계동 베란다탄성코트, 기존 도막을 완전히 긁어내고 시공해야 하는 경우는?',
    h1: '중계동 베란다탄성코트, 기존 페인트 완전 박리가 필요한 상태와 기준',
    metaDescription: '중계동 베란다 도장면의 부착력 저하와 누수 흔적에 따른 기존 칠 제거 필요성과 기초 밑작업 기준을 설명합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '중계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EC%A4%91%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '중계동 베란다탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'hagye_elastic__elastic-vs-paint-pros-cons-choice',
    queryTargetId: 'hagye_elastic',
    topicId: 'elastic-vs-paint-pros-cons-choice',
    slug: 'hagye-elastic-coating-vs-paint-comparison',
    regionId: 'hagye',
    regionName: '하계동',
    urlRegion: '하계동',
    serviceKeyword: '탄성코트',
    targetQuery: '하계동 탄성코트',
    searchIntent: 'informational_decision',
    title: '하계동 탄성코트와 일반 페인트 도색, 기능적 장단점과 공간별 선택 기준',
    h1: '하계동 탄성코트와 수성페인트의 차이점 및 베란다 환경별 선택 기준',
    metaDescription: '하계동 아파트 베란다 환경에 맞춘 탄성코트의 결로 완화 기능과 일반 페인트의 경제성을 객관적으로 비교 안내합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '하계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%ED%95%98%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '하계동 탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'hagye_balcony_elastic__renovation-construction-order',
    queryTargetId: 'hagye_balcony_elastic',
    topicId: 'renovation-construction-order',
    slug: 'hagye-balcony-elastic-renovation-order',
    regionId: 'hagye',
    regionName: '하계동',
    urlRegion: '하계동',
    serviceKeyword: '베란다탄성코트',
    targetQuery: '하계동 베란다탄성코트',
    searchIntent: 'informational_decision',
    title: '하계동 베란다탄성코트, 입주청소·도배·마루 인테리어 공정 순서는 어떻게 잡을까?',
    h1: '하계동 베란다탄성코트와 도배·청소·바닥재 시공 간의 올바른 작업 순서',
    metaDescription: '하계동 이사 인테리어 시 분진 및 보양 문제를 예방하기 위한 탄성코트와 타 공정 간의 이상적인 시공 순서를 안내합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '하계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%ED%95%98%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '하계동 베란다탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'wolgye_elastic__price-quote-difference-factors',
    queryTargetId: 'wolgye_elastic',
    topicId: 'price-quote-difference-factors',
    slug: 'wolgye-elastic-coating-quote-difference-factors',
    regionId: 'wolgye',
    regionName: '월계동',
    urlRegion: '월계동',
    serviceKeyword: '탄성코트',
    targetQuery: '월계동 탄성코트',
    searchIntent: 'informational_decision',
    title: '월계동 탄성코트 견적이 업체마다 차이 나는 이유와 상담 시 필수 확인 항목',
    h1: '월계동 탄성코트 시공 견적 책정 기준과 업체 비교 시 점검 사항',
    metaDescription: '월계동 탄성코트 견적에 영향을 미치는 베란다 구조, 밑작업 범위, 도료 등급 등 객관적 견적 비교 기준을 제시합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '월계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EC%9B%94%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '월계동 탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'wolgye_balcony_elastic__furnished-balcony-installation-feasibility',
    queryTargetId: 'wolgye_balcony_elastic',
    topicId: 'furnished-balcony-installation-feasibility',
    slug: 'wolgye-balcony-elastic-furnished-space-feasibility',
    regionId: 'wolgye',
    regionName: '월계동',
    urlRegion: '월계동',
    serviceKeyword: '베란다탄성코트',
    targetQuery: '월계동 베란다탄성코트',
    searchIntent: 'informational_decision',
    title: '월계동 베란다탄성코트, 거주 중이거나 짐이 있는 상태에서도 시공이 가능할까?',
    h1: '월계동 베란다탄성코트, 거주 중 짐 보관 상태에 따른 시공 가능 여부와 보양',
    metaDescription: '월계동 거주 중 베란다 탄성코트 시공 시 세탁기·선반 이동, 커버링 보양 범위 및 주의 사항을 안내합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '월계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EC%9B%94%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '월계동 베란다탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'gongneung_elastic__recoating-vs-stripping-judgment',
    queryTargetId: 'gongneung_elastic',
    topicId: 'recoating-vs-stripping-judgment',
    slug: 'gongneung-elastic-coating-recoating-vs-stripping',
    regionId: 'gongneung',
    regionName: '공릉동',
    urlRegion: '공릉동',
    serviceKeyword: '탄성코트',
    targetQuery: '공릉동 탄성코트',
    searchIntent: 'informational_decision',
    title: '공릉동 탄성코트, 기존 칠 위에 덧시공이 가능한 경우와 전면 제거가 필요한 경우',
    h1: '공릉동 탄성코트, 기존 도막 덧방 시공 가능 여부 판별 기준',
    metaDescription: '공릉동 베란다 기존 탄성코트 상태에 따른 덧시공 가능 조건과 하자를 막기 위한 밑작업 기준을 명확히 안내합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '공릉동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EA%B3%B5%EB%A6%89%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '공릉동 탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  },
  {
    editorialId: 'gongneung_balcony_elastic__post-installation-drying-ventilation-timing',
    queryTargetId: 'gongneung_balcony_elastic',
    topicId: 'post-installation-drying-ventilation-timing',
    slug: 'gongneung-balcony-elastic-drying-ventilation-timing',
    regionId: 'gongneung',
    regionName: '공릉동',
    urlRegion: '공릉동',
    serviceKeyword: '베란다탄성코트',
    targetQuery: '공릉동 베란다탄성코트',
    searchIntent: 'informational_decision',
    title: '공릉동 베란다탄성코트 시공 후 건조 시간과 환기 관리 및 짐 적치 시점',
    h1: '공릉동 베란다탄성코트 분사 후 완전 건조를 위한 환기 요령과 공간 사용 시점',
    metaDescription: '공릉동 베란다 탄성코트 시공 직후 계절별 표면 건조 및 속건조 소요 시간, 창문 환기 관리법을 상세히 설명합니다.',
    contentStatus: 'draft',
    isPublished: false,
    rssEnabled: false,
    sitemapEnabled: false,
    publishedAt: null,
    modifiedAt: null,
    relatedLandingTargets: [
      {
        urlRegion: '공릉동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EA%B3%B5%EB%A6%89%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '공릉동 베란다탄성코트 시공 안내 바로가기'
      }
    ],
    sections: [],
    faqs: [],
    checklist: []
  }
];
