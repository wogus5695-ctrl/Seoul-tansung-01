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
    createdAt: '2026-10-21T08:30:00+09:00',
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
    title: '노원구 베란다탄성코트, 이사·입주 과정에서 언제 시공하는 게 좋을까?',
    h1: '노원구 베란다탄성코트, 이사·입주 과정에서 시공 시점을 정하는 기준',
    metaDescription: '노원구 이사 및 입주 인테리어 과정에서 다른 공정과의 간섭을 줄이고 안정적인 건조를 확보하기 위한 베란다 탄성코트 시공 시점 기준을 안내합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T09:40:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '이사나 입주를 앞두고 베란다 마감을 계획할 때, 탄성코트 작업 시점을 언제로 잡아야 할지 고민하는 경우가 많습니다. 탄성코트는 뿜칠 분사 방식으로 작업이 진행되고 표면이 온전히 마를 때까지 건조 시간이 필요하므로, 다른 인테리어 공정 및 이삿짐 반입 일정과의 조율이 중요합니다. 무조건적인 고정 순서를 따르기보다는 현장의 시공 여건과 일정 여유에 맞춰 적절한 작업 시점을 판단하는 기준을 안내합니다.',
    relatedLandingTargets: [
      {
        urlRegion: '노원구',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EB%85%B8%EC%9B%90%EA%B5%AC-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '노원구 베란다탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '탄성코트 작업 시점은 무엇을 기준으로 정할까?',
        paragraphs: [
          '베란다 탄성코트 시공 시점은 벽면 상태와 다른 공정 간의 간섭 여부를 중심으로 판단해야 합니다. 일반적으로 철거나 샷시 교체, 타일 줄눈 시공처럼 먼지가 많이 나거나 벽체에 진동을 주는 작업이 끝난 뒤에 진행해야 분사 도막의 오염이나 훼손을 방지할 수 있습니다. 또한 시공 후 도막이 안정적으로 마르기 전에 베란다로 짐이 들어오거나 물을 사용하게 되면 자국이 남을 수 있으므로, 입주청소나 이삿짐 반입 전에 충분한 자연 건조 시간을 확보할 수 있는지 확인하는 것이 중요합니다.'
        ]
      },
      {
        title: '상담 전에 확인하면 좋은 일정 정보',
        paragraphs: [
          '공사 일정을 안정적으로 조율하기 위해 노원구 베란다탄성코트 시공 상담을 진행하기 전 몇 가지 일정을 미리 정리해 두는 것이 좋습니다. 입주 또는 이사 예정일, 도배나 바닥 및 입주청소 등 앞뒤로 예정된 다른 작업 일정, 그리고 세탁기나 선반 등 베란다 공간에 짐이 배치되는 시점을 파악해 두어야 합니다. 현장 상황에 따라 전처리 밑작업에 추가 시간이 소요될 수 있으므로, 전체 일정을 미리 공유하면 도막 양생에 무리가 없는 현실적인 시공 일정을 조율할 수 있습니다.'
        ]
      }
    ],
    checklist: [
      '입주 또는 이사 예정일',
      '도배·바닥·청소 등 다른 작업 일정',
      '베란다에 짐이 들어오는 시점'
    ],
    faqs: []
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
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T10:05:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '베란다 벽면에 시공되어 있던 기존 도막이 부풀어 오르거나 조각으로 떨어져 나올 때는 무작정 새 도료를 덧칠하기보다 도막의 탈락 범위와 바탕면 상태를 먼저 살펴야 합니다. 부착력을 상실한 칠 위에 그대로 재시공하면 새로 뿌린 도료의 무게와 건조 장력으로 인해 하부 칠까지 함께 뜯겨나갈 수 있습니다. 기존 칠의 손상 정도에 맞춰 국소 보수와 재도포를 결정하는 기준을 살펴봅니다.',
    relatedLandingTargets: [
      {
        urlRegion: '상계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EC%83%81%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '상계동 탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '들뜬 부위의 스크래핑과 하도 처리 기준',
        paragraphs: [
          '손으로 만졌을 때 바스락거리며 떨어지거나 헤라로 살짝 밀었을 때 쉽게 일어나는 부위는 콘크리트 면이 드러날 때까지 충분히 긁어내야 합니다. 벗겨낸 자리와 기존 도막 사이의 단차는 퍼티 등으로 평탄화하고, 가루가 묻어나거나 접착면이 약해진 경계면은 현장 바탕면 상태에 맞춰 적절한 하도 밑작업을 진행해 부착력을 보강하는 것이 안전합니다.'
        ]
      },
      {
        title: '상계동 탄성코트 재시공 전 주요 확인 요소',
        paragraphs: [
          '탈락의 주된 원인이 외벽 창틀 실리콘의 갈라짐이나 외부 빗물 유입 때문인지 점검해야 합니다. 상계동 탄성코트 재작업을 계획하고 있다면 단순히 벽면 마감만 교체할 것이 아니라, 수분이 침투한 경로가 보수되었는지와 젖어 있던 콘크리트 벽체가 충분히 건조되었는지를 함께 확인해야 재발을 방지할 수 있습니다.'
        ]
      }
    ],
    checklist: [
      '들뜬 구도막이 손톱이나 헤라로 쉽게 밀려 나오는지 확인',
      '벗겨진 벽체 안쪽 콘크리트에 지속적인 습기 유입 흔적이 있는지 점검',
      '창틀 실리콘 노후 여부와 벽면 완전 건조 상태 확인'
    ],
    faqs: []
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
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T10:28:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '베란다 칠 작업을 문의할 때 말로만 평수나 방 개수를 설명하면 현장의 실제 작업 난이도나 밑작업 소요 범위를 정확히 예측하기 어렵습니다. 도막의 박리 상태, 곰팡이 침착 범위, 샷시 실리콘 상태에 따라 기초 보수 시간에 큰 차이가 생기기 때문입니다. 상담 단계에서 몇 가지 핵심 사진을 미리 준비하면 보다 오차 없는 현실적인 안내를 받을 수 있습니다.',
    relatedLandingTargets: [
      {
        urlRegion: '상계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EC%83%81%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '상계동 베란다탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '견적 오차를 줄이는 사진 촬영 방법',
        paragraphs: [
          '스마트폰으로 공간의 윤곽이 한눈에 보이는 원거리 전경 사진과, 오염이나 페인트 들뜸이 심한 부위의 근접 사진을 함께 준비하는 것이 좋습니다. 천장 모서리, 실외기실 안쪽 좁은 벽체, 배수관(우수관) 뒤편처럼 분사 장비가 진입하기 까다로운 구역의 사진을 공유하면 작업 환경을 명확히 파악할 수 있습니다.'
        ]
      },
      {
        title: '상계동 베란다탄성코트 상담 시 전달할 정보',
        paragraphs: [
          '사진과 더불어 기존 칠의 종류(수성페인트 도색인지 탄성코트 뿜칠인지), 창호(샷시) 교체 계획, 베란다 내부에 고정된 붙박이장이나 선반 철거 계획을 전달해야 합니다. 상계동 베란다탄성코트 문의 시 이러한 사전 세부 조건을 공유하면 불필요한 현장 추가 비용 발생을 예방할 수 있습니다.'
        ]
      }
    ],
    checklist: [
      '베란다 전체 구조가 보이는 원거리 사진 및 결함 부위 근접 사진',
      '우수관 주변, 창틀 모서리, 실외기실 등 취약 구역 촬영',
      '기존 벽면 도막 종류 및 선반·수납장 철거 여부 정리'
    ],
    faqs: []
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
    metaDescription: '중계동 탄성코트 상담 시 샷시 교체 여부, 결함 부위 범위, 짐 유무 등 작업 범위를 판단하기 위해 전달해야 할 정보를 정리합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T10:51:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '탄성코트 견적과 시공 일정은 단순히 면적만으로 일률적으로 책정되지 않으며, 벽면의 전처리 필요성과 장비 운용 여건에 크게 좌우됩니다. 사전 상담에서 현장의 제약 사항을 구체적으로 공유하지 않으면 실제 시공 당일 밑작업 시간이 길어져 예정된 일정에 차질이 생길 수 있습니다. 원활한 공사진행을 위해 업체에 사전에 전달해야 할 핵심 정보를 정리해 드립니다.',
    relatedLandingTargets: [
      {
        urlRegion: '중계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EC%A4%91%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '중계동 탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '작업 범위 진단을 위한 3가지 기본 정보',
        paragraphs: [
          '시공하려는 공간이 앞베란다 단독인지 세탁실이나 대피공간, 실외기실까지 포함되는지 정확한 개소를 정해야 합니다. 또한 벽면에 단열재(이보드 등)나 석고보드가 시공되어 있는지, 혹은 일반 콘크리트 벽면인지에 따라 이음새 테이핑 및 퍼티 작업 방식이 달라지므로 벽체 마감재의 형태를 알려주는 것이 좋습니다.'
        ]
      },
      {
        title: '중계동 탄성코트 일정 및 환경 정보 공유',
        paragraphs: [
          '중계동 탄성코트 문의 시 샷시 교체 공정이 포함되어 있다면 실리콘 코킹 마감 일정과 탄성코트 시공 간격을 사전에 미리 전달해 주는 것이 좋습니다. 아울러 공간 내에 세탁기나 선반, 보일러가 설치된 상태인지 비워져 있는 상태인지를 알려주면 보양 작업의 소요 시간과 추가 작업대 운용 여부를 즉시 판단할 수 있습니다.'
        ]
      }
    ],
    checklist: [
      '시공 대상 공간 개소 및 실외기실·대피공간 포함 여부',
      '벽체 구조(콘크리트 벽면, 석고보드, 단열보드 시공 여부)',
      '샷시 교체 일정 및 세탁기 등 대형 설비 배치 상태'
    ],
    faqs: []
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
    metaDescription: '중계동 베란다 도장면의 부착력 저하와 표면 손상에 따른 기존 칠 제거 필요성과 기초 밑작업 기준을 설명합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T11:15:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '베란다 벽면을 리모델링할 때 기존에 칠해져 있던 페인트를 무조건 벽 전체에서 전부 긁어내야 하는지, 아니면 일부분만 긁어내고 칠해도 되는지 혼란스러워하는 경우가 많습니다. 단단하게 밀착되어 있는 칠까지 무리하게 긁어내는 것은 불필요한 표면 훼손을 부를 수 있으나, 반대로 이미 수명을 다한 칠을 남겨두면 하자의 원인이 됩니다. 현장 상태에 따른 제거 기준을 설명합니다.',
    relatedLandingTargets: [
      {
        urlRegion: '중계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EC%A4%91%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '중계동 베란다탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '전면 제거가 필요한 상태와 부분 긁어내기의 차이',
        paragraphs: [
          '벽면에 부착력이 약한 도막이 두껍게 덮여 있거나 손으로 쓸었을 때 가루가 묻어나는 초킹 현상이 있더라도, 무조건 전면을 긁어내야 하는 것은 아닙니다. 가루화된 정도와 기존 도막이 벽체에 얼마나 단단히 밀착되어 있는지를 살펴 표면 세척과 하도 강화로 대응할지, 혹은 부실한 구도막을 긁어내야 할지 현장 바탕면 상태에 따라 제거 범위를 결정하게 됩니다. 크랙 주변 등 국소 부위만 들떠 있다면 손상 부위 위주로 스크래핑한 뒤 단차를 메우는 방식으로 정돈할 수 있습니다.'
        ]
      },
      {
        title: '중계동 베란다탄성코트 시공 전 바탕면 진단',
        paragraphs: [
          '중계동 베란다탄성코트 작업을 계획할 때는 벽면이 건조한 계절에 도막을 손가락 끝이나 단단한 도구로 살짝 긁어보아 쉽게 떨어지는 범위를 가늠해 보는 것이 좋습니다. 구도막 제거 범위가 넓어질수록 퍼티 평탄화와 프라이머 경화 시간이 길어지므로, 현장 상태를 객관적으로 평가해 공정을 계획해야 합니다.'
        ]
      }
    ],
    checklist: [
      '도막 표면 가루 묻어남(초킹 현상)이 벽면 전체에 퍼져 있는지 확인',
      '페인트 박리 부위가 외창 주변 등 국소 부위에 한정되어 있는지 점검',
      '들뜬 칠 제거 후 단차 보수가 필요한 면적 확인'
    ],
    faqs: []
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
    title: '하계동 탄성코트와 일반 페인트 도색, 사용 목적과 유지 관리 관점에서의 차이',
    h1: '하계동 탄성코트와 일반 페인트의 마감 특성 및 일상 관리 편의성 비교',
    metaDescription: '하계동 베란다 마감 시 탄성코트의 엠보 질감과 생활 오염 관리 편의성, 일반 페인트의 보수 용이성을 비교 안내합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T11:42:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '베란다 벽면 마감재를 선택할 때 단순히 시공 견적의 차이뿐 아니라, 공간의 일상적인 사용 목적과 완공 후 장기적인 관리 편의성을 고려하는 것이 중요합니다. 세탁기나 건조기 가동으로 습도 변화가 잦은 공간인지, 혹은 가벼운 창고 용도로 쓰이는지에 따라 마감재에 요구되는 특성이 달라지기 때문입니다. 일상 유지 관리 관점에서 두 방식의 실질적인 차이를 비교해 드립니다.',
    relatedLandingTargets: [
      {
        urlRegion: '하계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%ED%95%98%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '하계동 탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '표면 마감 질감과 생활 얼룩 은폐력',
        paragraphs: [
          '롤러나 붓으로 시공하는 일반 수성페인트는 매끄럽고 평평한 면을 만들지만, 손자국이나 물얼룩, 벽체의 자잘한 요철이 눈에 띌 수 있습니다. 이에 비해 입체적인 엠보 질감을 가진 일부 탄성 마감재는 미세한 벽면 요철이나 가벼운 생활 흔적을 시각적으로 덜 눈에 띄게 완화해 주는 특징이 있습니다. 다만 이러한 표면 은폐 효과는 제품 종류, 뿜칠 입자의 크기, 색상 및 벽면 조도에 따라 차이가 있을 수 있습니다.'
        ]
      },
      {
        title: '하계동 탄성코트 선택 시 고려할 관리 환경',
        paragraphs: [
          '하계동 탄성코트 시공을 고려한다면 세탁 공간이나 외기 접촉 베란다처럼 주기적인 통풍 관리가 가능한지 확인해야 합니다. 수성페인트는 추후 소비자가 직접 붓으로 덧칠 보수를 하기 용이한 반면, 탄성코트는 일상적인 물튐이나 습기 변화에 따른 미관 유지가 우수한 대신 부분 보수 시 전용 도료의 질감을 맞추는 작업이 요구됩니다.'
        ]
      }
    ],
    checklist: [
      '공간의 주된 용도(세탁실·다용도실 vs 단순 건식 보관실)',
      '일상적인 벽면 오염 은폐력과 시각적 질감 선호도 확인',
      '추후 셀프 부분 덧칠 편의성 여부 비교'
    ],
    faqs: []
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
    title: '하계동 베란다탄성코트, 도배·바닥재·청소 작업과 겹칠 때 공정 순서 조율법',
    h1: '하계동 베란다탄성코트와 타 인테리어 공정 간 간섭을 줄이는 작업 순서 기준',
    metaDescription: '하계동 인테리어 공사 시 분진 발생 작업과 뿜칠 분사 간의 간섭을 예방하기 위한 탄성코트 공정 조율 기준을 안내합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T13:10:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '인테리어 공사를 진행할 때 여러 공정이 좁은 공간에서 동시다발적으로 이루어지면 마감재가 서로 오염되거나 훼손되는 간섭 문제가 발생하기 쉽습니다. 특히 탄성코트는 공기 중에 미세 도료가 날릴 수 있는 분사 시공인 동시에 시공 후 표면이 굳을 때까지 물리적 충격을 피해야 합니다. 다른 마감 공정과 겹치지 않게 순서를 조율하는 실무적 기준을 안내합니다.',
    relatedLandingTargets: [
      {
        urlRegion: '하계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%ED%95%98%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '하계동 베란다탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '분진 유발 공정과 마감 시공의 분리 원칙',
        paragraphs: [
          '인테리어 현장에서는 철거, 창호 교체, 목공, 타일, 도배, 바닥 등 다양한 작업이 순차적으로 맞물리므로, 작업 구역과 이동 동선이 겹치지 않도록 일정을 조율해야 합니다. 특히 먼지가 많이 날리는 공정과 도료 미립자가 비산되는 뿜칠 공정이 같은 시간대에 진행되면 마감 표면이 오염될 수 있습니다. 샷시 코킹이 충분히 건조되고 분진 유발 작업이 정돈된 시점에 탄성코트 일정을 배치하면 다른 공정과의 간섭을 최소화할 수 있습니다.'
        ]
      },
      {
        title: '하계동 베란다탄성코트와 입주청소 일정 간격',
        paragraphs: [
          '하계동 베란다탄성코트 분사 후 입주청소를 잡을 때는 도막이 물기와 마찰에 견딜 수 있는 충분한 건조 시간을 확보해야 합니다. 청소 시 고압수나 젖은 걸레가 덜 마른 벽면에 닿으면 도막이 번지거나 손상될 수 있으므로, 최소한의 자연 건조 기간을 둔 뒤 입주청소를 진행하도록 일정을 조율해야 합니다.'
        ]
      }
    ],
    checklist: [
      '철거, 샷시 교체, 타일 줄눈 등 먼지·진동 공정 선행 완료 여부',
      '도배 및 바닥재 시공 전 보양 및 분사 동선 확인',
      '탄성코트 도막 양생 후 입주청소 일정 배치'
    ],
    faqs: []
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
    title: '월계동 탄성코트 견적이 현장마다 달라지는 이유와 비교 기준',
    h1: '월계동 탄성코트 시공 견적 차이를 만드는 주요 요인과 사전 확인 사항',
    metaDescription: '월계동 베란다 구조, 벽면 손상 정도와 밑작업 소요 범위 등 탄성코트 견적에 영향을 주는 핵심 요소를 정리해 드립니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T13:35:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '탄성코트 시공을 알아볼 때 동일한 평형대 아파트라도 업체마다 제시하는 견적 조건에 상당한 차이가 발생하는 것을 볼 수 있습니다. 이는 단순히 도료의 자재비 차이뿐 아니라, 현장 벽면의 노후도에 따른 보수 공정의 깊이와 시공 공간의 구조적 특성이 복합적으로 반영되기 때문입니다. 합리적인 비교를 위해 견적을 좌우하는 주요 요소들을 이해하는 것이 필요합니다.',
    relatedLandingTargets: [
      {
        urlRegion: '월계동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EC%9B%94%EA%B3%84%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '월계동 탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '견적 책정에 영향을 주는 밑작업과 구조적 조건',
        paragraphs: [
          '가장 큰 변수는 기존 도막의 박리 상태와 균열 보수 범위입니다. 페인트를 긁어내고 퍼티와 하도 프라이머 처리를 진행해야 하는 면적이 넓을수록 밑작업 투입 인력과 시간이 증가합니다. 또한 실외기실이나 보일러 배관 주변처럼 작업자의 진입이 좁은 특수 공간 유무, 샷시 주변 코킹 상태 및 시스템 선반 해체·재설치 여부가 최종 견적에 영향을 줍니다.'
        ]
      },
      {
        title: '월계동 탄성코트 상담 시 점검할 비교 항목',
        paragraphs: [
          '월계동 탄성코트 견적을 검토할 때는 총액만 비교하기보다 하도 전처리 공정이 포함되어 있는지, 보양 비닐 작업 범위가 꼼꼼한지 확인해야 합니다. 무조건 저렴한 조건만 찾다 보면 기본적인 들뜸 제거 공정이 누락되거나 축소되어 추후 도막 탈락의 위험이 커질 수 있으므로 작업 공정의 범위를 대조해 보는 것이 안전합니다.'
        ]
      }
    ],
    checklist: [
      '기존 벽면의 페인트 들뜸·곰팡이 밑작업 포함 여부',
      '세탁실, 실외기실, 대피공간 등 구조적 특수 구역 포함 여부',
      '창호 코킹 및 선반 탈거 보양 작업 범위 확인'
    ],
    faqs: []
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
    title: '월계동 베란다탄성코트, 거주 중이거나 짐이 있어도 시공이 가능할까?',
    h1: '월계동 베란다탄성코트, 거주 세대 짐 보관 상태에 따른 시공 요건과 준비 사항',
    metaDescription: '월계동 거주 중 베란다 탄성코트 진행 시 필요한 작업 공간 확보 요건, 커버링 보양 범위와 세탁기·선반 이동 기준을 안내합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T14:02:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '이사 전 공실 상태가 아니라 이미 입주해 거주 중인 세대에서 베란다 칠 작업을 진행할 수 있는지 문의하는 사례가 많습니다. 탄성코트는 콤프레샤 분사 특성상 공간 전체에 비산 먼지와 미립자가 발생하므로, 짐이 가득 차 있는 환경에서는 작업이 제한될 수 있습니다. 거주 중인 세대에서 안전하게 시공을 진행하기 위해 소비자가 사전에 준비해야 할 사항들을 안내합니다.',
    relatedLandingTargets: [
      {
        urlRegion: '월계동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EC%9B%94%EA%B3%84%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '월계동 베란다탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '작업 공간 확보와 비산 방지 보양의 필요성',
        paragraphs: [
          '시공 장비와 작업자의 동선이 확보되려면 벽면과 천장으로부터 최소한의 이격 거리가 필요합니다. 베란다에 보관된 잔짐, 화분, 수납박스 등은 실내 방 안으로 임시 이동시켜야 하며, 이동이 어려운 대형 세탁기나 건조기, 붙박이 선반은 전용 비닐 커버링 테이프로 틈새 없이 밀폐 보양을 진행해야 도료 오염을 막을 수 있습니다.'
        ]
      },
      {
        title: '월계동 베란다탄성코트 거주 중 시공 준비 요령',
        paragraphs: [
          '월계동 베란다탄성코트 거주 시공을 계획할 때는 실내 거실로 도료 냄새와 미립자가 유입되지 않도록 베란다 중문 및 창문 보양을 철저히 확인해야 합니다. 또한 작업 당일 짐을 옮기다 보면 시간이 지연될 수 있으므로, 시공 전날까지 잔짐 정리를 완료해 두는 것이 분사 도막의 마감 품질을 높이는 지름길입니다.'
        ]
      }
    ],
    checklist: [
      '베란다 내 잔짐, 화분, 수납품의 실내 사전 이동 여부',
      '이동 불가 가전(세탁기·건조기) 주변 작업 공간 확보 및 밀폐 보양',
      '실내 거실로 이어지는 중문 차단 보양 상태 점검'
    ],
    faqs: []
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
    title: '공릉동 탄성코트, 기존 마감 위에 덧칠해도 될까? 덧시공 판별 기준',
    h1: '공릉동 탄성코트, 기존 벽면 도막 유지 상태에 따른 덧시공 가능 여부',
    metaDescription: '공릉동 베란다 벽체의 기존 칠 밀착 상태와 부착 강도를 토대로 덧시공 가능 여부를 판단하는 기준을 설명합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T14:28:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '새집으로 이사하거나 베란다 색상을 바꾸고 싶을 때, 기존에 칠해져 있는 바탕면 위에 그대로 탄성코트를 덧시공해도 되는지 고민하는 경우가 많습니다. 덧시공은 철거와 밑작업 시간을 줄여주는 장점이 있지만, 기존 바탕면의 부착력이 불안정하면 새로 뿜칠한 도료까지 함께 하자가 발생할 위험이 있습니다. 덧시공이 가능한 조건과 제거가 필요한 경계선을 짚어봅니다.',
    relatedLandingTargets: [
      {
        urlRegion: '공릉동',
        serviceKeyword: '탄성코트',
        relativeUrl: '/?k=%EA%B3%B5%EB%A6%89%EB%8F%99-%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '공릉동 탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '덧시공이 가능한 안정된 바탕면의 조건',
        paragraphs: [
          '기존 도막이 수성페인트든 탄성코트든 관계없이, 콘크리트 벽체에 단단하게 달라붙어 있어 손톱이나 주걱으로 긁어도 들뜸이 전혀 없는 상태라면 덧시공을 검토할 수 있습니다. 단, 표면에 쌓인 먼지, 유분기, 가벼운 생활 찌든 때는 고착제를 칠하기 전에 깨끗이 닦아내야 하며, 접착력을 높여주는 프라이머 밑작업이 병행되어야 새로운 도막이 안전하게 안착합니다.'
        ]
      },
      {
        title: '공릉동 탄성코트 덧방 전 부착력 테스트',
        paragraphs: [
          '공릉동 탄성코트 시공 전 기존 도막의 상태를 확인할 때는 눈으로 크랙을 살피는 것 외에도, 손으로 표면을 문질러 가루가 심하게 묻어나는지 만져보거나 취약 부위의 도막을 도구로 가볍게 점검해 보는 과정이 도움이 됩니다. 테이프를 활용한 간이 점검을 병행해 볼 수도 있으나, 하나의 방법에만 의존하기보다는 현장 작업자가 도막의 전체적인 고착 상태와 부착 강도를 종합적으로 확인한 후 덧시공 여부를 판단하는 것이 바람직합니다.'
        ]
      }
    ],
    checklist: [
      '기존 도막의 들뜸이나 부풀어 오름 부위 전무 여부 확인',
      '벽면 테이프 부착 테스트를 통한 구도막 박리 위험 점검',
      '표면 유분·이물질 제거 및 접착 프라이머 도포 계획'
    ],
    faqs: []
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
    title: '공릉동 베란다탄성코트 시공 후 건조와 환기, 짐 배치는 언제부터 가능할까?',
    h1: '공릉동 베란다탄성코트 시공 후 환경별 건조 과정과 환기 관리 요령',
    metaDescription: '공릉동 베란다 탄성코트 분사 후 겉마름과 속건조의 차이, 계절별 환기 관리 및 물 사용·짐 재배치 시점을 안내합니다.',
    contentStatus: 'approved',
    isPublished: true,
    rssEnabled: true,
    sitemapEnabled: true,
    createdAt: '2026-10-21T14:55:00+09:00',
    publishedAt: '2026-10-21T15:37:00+09:00',
    modifiedAt: '2026-10-21T15:37:00+09:00',
    intro: '탄성코트 시공이 끝난 직후 깨끗해진 벽면을 보면 바로 세탁기를 돌리거나 짐을 옮겨놓고 싶은 마음이 들기 마련입니다. 하지만 탄성코트는 두께감 있게 분사되는 세라믹 도료 특성상 겉면이 마르는 시간과 속까지 단단히 굳는 양생 시간에 뚜렷한 차이가 있습니다. 시공 후 도막 손상을 방지하고 안정적인 마감을 유지하기 위한 건조 및 환기 관리 요령을 설명합니다.',
    relatedLandingTargets: [
      {
        urlRegion: '공릉동',
        serviceKeyword: '베란다탄성코트',
        relativeUrl: '/?k=%EA%B3%B5%EB%A6%89%EB%8F%99-%EB%B2%A0%EB%9E%80%EB%8B%A4%ED%83%84%EC%84%B1%EC%BD%94%ED%8A%B8',
        label: '공릉동 베란다탄성코트 시공 안내 확인'
      }
    ],
    sections: [
      {
        title: '겉마름과 완전 건조의 차이 및 환기 수칙',
        paragraphs: [
          '표면을 가볍게 만져 묻어나지 않는 겉마름 상태에 이르더라도, 도막 내부까지 안정적으로 굳기 전까지는 벽면이 습기와 물리적 마찰에 약할 수 있습니다. 건조 소요 시간은 특정 시간으로 고정되지 않고 계절과 날씨, 현장의 습도와 환기 조건에 따라 달라집니다. 따라서 시공 직후에는 창문을 적절히 개방하여 자연스러운 통풍을 유지하고, 칠이 충분히 마를 때까지 세탁기 가동, 물청소, 무거운 짐의 밀착을 피해야 합니다.'
        ]
      },
      {
        title: '공릉동 베란다탄성코트 물 사용 및 짐 배치 시점',
        paragraphs: [
          '공릉동 베란다탄성코트 분사 후 세탁기 가동이나 물청소는 도막이 완전히 경화되어 방수 피막이 안정화된 이후로 미루어야 합니다. 또한 선반에 무거운 수납함을 올리거나 세탁기를 벽면에 바짝 붙여 설치할 때 벽을 긁지 않도록 주의해야 하며, 현장의 온도와 통풍 여건을 고려해 여유를 두고 짐을 재배치하는 것이 좋습니다.'
        ]
      }
    ],
    checklist: [
      '시공 직후 자연 통풍을 위한 창문 맞바람 환기 유지',
      '도막 내부 완전 경화 전까지 베란다 바닥 물청소 자제',
      '세탁기·선반 재배치 시 벽면 긁힘 방지 완충 간격 확보'
    ],
    faqs: []
  }
];
