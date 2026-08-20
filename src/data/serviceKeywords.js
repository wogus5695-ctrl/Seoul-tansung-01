// 12 Service Keywords classified under 4 search intents (general, intent, space, agency).
// Defines content variation templates, image mappings, and custom FAQs for each category.

export const serviceKeywords = [
  // ---------------- 탄성코트 서비스군 (6개) ----------------
  {
    keyword: '탄성코트',
    breakParts: ['탄성코트'],
    serviceGroup: 'elastic',
    searchIntent: 'general',
    serviceFamily: 'elasticCoating',
    serviceIntent: 'general',
    spaceType: null,
    primarySpace: '베란다 · 세탁실 · 다용도실',
    heroTitleTemplate: '벽면 상태부터 확인하는 시공',
    heroDescriptionTemplate: '{region} 베란다와 세탁실의 기존 도장 상태를 확인하고, 바탕면 정리부터 필요한 탄성코트 시공 범위를 안내합니다.',
    metaTitleTemplate: '탄성코트 시공 안내 | 베란다·세탁실 벽면 마감',
    metaDescriptionTemplate: '{region} 베란다 벽면의 들뜸과 얼룩 때문에 고민이신가요? 기존 페인트와 갈라진 부분을 확인하고 필요한 보수 후 탄성코트를 진행합니다. 시공 후에도 문제가 생기면 A/S 기준에 따라 확인해드립니다.',
    sectionDescriptionTemplate: '{region} 지역의 탄성코트 시공은 베란다와 다용도실 등 온도차가 큰 벽면의 수축 팽창에 견디는 마감이 필수적입니다. 기온 차로 발생하는 미세 결로를 예방하고 곰팡이 유발 오염원을 억제하기 위해, 벽면의 기존 페인트 박리 공정과 밀착 균열 보강을 철저히 선행한 뒤 기능성 인증 세라믹 코팅제를 균일하게 도포합니다.',
    faqSet: [
      '기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?',
      '곰팡이나 결로가 있으면 바로 시공해도 되나요?',
      '탄성코트 시공 전에 짐을 모두 빼야 하나요?',
      '탄성코트 색상은 어떻게 선택하나요?',
      '탄성코트 시공 전 기존 벽면 상태를 확인하나요?'
    ],
    relatedServices: ['탄성코트시공', '베란다탄성코트', '세탁실탄성코트', '탄성코트업체'],
    imagePlaceholderKey: 'ELASTIC_COATING_HERO'
  },
  {
    keyword: '탄성코트시공',
    breakParts: ['탄성코트', '시공'],
    serviceGroup: 'elastic',
    searchIntent: 'intent',
    serviceFamily: 'elasticCoating',
    serviceIntent: 'installation',
    spaceType: null,
    primarySpace: '베란다 · 세탁실 · 다용도실',
    heroTitleTemplate: '공정 단계별 정밀 도포 마감',
    heroDescriptionTemplate: '{region} 현장의 보양부터 기존 페인트 긁어내기, 균열 메우기 및 탄성코트 분사까지 단계별 품질 기준을 준수합니다.',
    metaTitleTemplate: '탄성코트시공 과정 및 기준 안내',
    metaDescriptionTemplate: '{region} 벽면이 들뜨고 갈라졌는데 바로 탄성코트를 해도 될지 고민이신가요? 벽 상태를 확인하고 필요한 보수와 정리 후 순서에 맞춰 시공합니다. 시공 후에도 A/S 기준에 따라 확인해드립니다.',
    sectionDescriptionTemplate: '{region} 현장의 탄성코트시공은 분사 장비의 압력 조절과 균일한 도막 두께 형성이 품질을 좌우합니다. 틈새 코너 실리콘 보강, 창틀 주위의 노후 크랙 부위 아크릴 코킹 메우기 등의 정밀한 밑작업 과정을 확인하고 공간에 필요한 도포 마감 가이드를 확인해 보세요.',
    faqSet: [
      '곰팡이나 결로가 있으면 바로 시공해도 되나요?',
      '탄성코트 시공 전에 짐을 모두 빼야 하나요?',
      '시공 후 환기와 건조는 어떻게 해야 하나요?',
      '탄성코트 부분 보수와 전체 시공은 어떻게 구분하나요?',
      '탄성코트 시공 사례는 어떤 기준으로 확인해야 하나요?'
    ],
    relatedServices: ['탄성코트', '베란다탄성코트', '아파트탄성코트', '탄성코트업체'],
    imagePlaceholderKey: 'ELASTIC_COATING_HERO'
  },
  {
    keyword: '베란다탄성코트',
    breakParts: ['베란다', '탄성코트'],
    serviceGroup: 'elastic',
    searchIntent: 'space',
    serviceFamily: 'elasticCoating',
    serviceIntent: 'space',
    spaceType: 'balcony',
    primarySpace: '베란다',
    heroTitleTemplate: '온도차와 습기를 고려한 마감',
    heroDescriptionTemplate: '{region} 베란다 내외벽의 습기 노출도와 기존 도장 균열을 진단하여 밀착력 높은 세라믹 탄성 마감을 안내합니다.',
    metaTitleTemplate: '베란다탄성코트 시공 안내 | 오염 및 들뜸 예방',
    metaDescriptionTemplate: '{region} 베란다 벽면의 곰팡이 자국과 들뜬 페인트 때문에 고민이신가요? 기존 벽면 상태를 확인하고 필요한 보수와 정리 후 탄성코트를 진행합니다. 시공 후에도 A/S 기준에 따라 확인해드립니다.',
    sectionDescriptionTemplate: '{region} 베란다탄성코트 관리는 외부 습기와 직접 접하는 외벽면의 도장 상태 회복에 집중합니다. 창호 샷시 코킹 틈새의 노화 여부와 콘크리트 미세 균열을 진단하여 밀착력이 저하된 페인트 막을 긁어내고 방습 안심 마감 기준을 안착시킵니다.',
    faqSet: [
      '기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?',
      '곰팡이나 결로가 있으면 바로 시공해도 되나요?',
      '시공 후 환기와 건조는 어떻게 해야 하나요?',
      '탄성코트 색상은 어떻게 선택하나요?',
      '탄성코트 시공 전 기존 벽면 상태를 확인하나요?'
    ],
    relatedServices: ['탄성코트', '탄성코트시공', '아파트탄성코트', '탄성코트업체'],
    imagePlaceholderKey: 'BALCONY_ELASTIC_IMAGE'
  },
  {
    keyword: '세탁실탄성코트',
    breakParts: ['세탁실', '탄성코트'],
    serviceGroup: 'elastic',
    searchIntent: 'space',
    serviceFamily: 'elasticCoating',
    serviceIntent: 'space',
    spaceType: 'laundry',
    primarySpace: '세탁실',
    heroTitleTemplate: '높은 습기를 방어하는 마감',
    heroDescriptionTemplate: '{region} 세탁실의 지속적인 배수와 환기 부족으로 오염되기 쉬운 벽체의 기존 마감 상태를 정밀 진단합니다.',
    metaTitleTemplate: '세탁실탄성코트 맞춤형 벽면 관리 가이드',
    metaDescriptionTemplate: '{region} 세탁실 벽면의 얼룩과 들뜬 페인트가 신경 쓰이시나요? 벽면과 배관 주변 상태를 확인하고 필요한 범위부터 꼼꼼하게 시공합니다. 시공 후에도 A/S 기준에 따라 확인해드립니다.',
    sectionDescriptionTemplate: '{region} 세탁실탄성코트는 수도관 주위와 건조기 배관 뒷면 등 통풍이 제한적인 음지 벽면 관리에 중점을 둔다. 상시적인 결로와 높은 상대 습도 조건에서도 도장막이 쉽게 부식되지 않도록 방균 성능이 보완된 바이오 세라믹 자재를 밀착 적용합니다.',
    faqSet: [
      '곰팡이나 결로가 있으면 바로 시공해도 되나요?',
      '탄성코트 시공 전에 짐을 모두 빼야 하나요?',
      '시공 후 환기와 건조는 어떻게 해야 하나요?',
      '탄성코트 부분 보수와 전체 시공은 어떻게 구분하나요?',
      '탄성코트 시공 전 기존 벽면 상태를 확인하나요?'
    ],
    relatedServices: ['탄성코트', '탄성코트시공', '베란다탄성코트', '탄성코트업체'],
    imagePlaceholderKey: 'LAUNDRY_ELASTIC_IMAGE'
  },
  {
    keyword: '아파트탄성코트',
    breakParts: ['아파트', '탄성코트'],
    serviceGroup: 'elastic',
    searchIntent: 'space',
    serviceFamily: 'elasticCoating',
    serviceIntent: 'space',
    spaceType: null,
    primarySpace: '아파트 발코니 전역',
    heroTitleTemplate: '신축 및 구축 아파트 맞춤형 시공',
    heroDescriptionTemplate: '{region} 아파트 발코니 벽면의 노후 상태와 기존 도막 상태를 진단하여 가장 적합한 벽면 보수 마감을 지원합니다.',
    metaTitleTemplate: '아파트탄성코트 확인 사항과 시공 기준',
    metaDescriptionTemplate: '{region} 아파트 베란다·세탁실 벽면 마감이 아쉬우신가요? 기존 벽면과 들뜬 부분을 확인하고 필요한 보수 후 깔끔하게 마감합니다. 시공 후에도 A/S 기준에 따라 확인해드립니다.',
    sectionDescriptionTemplate: '{region} 아파트탄성코트 마감은 대피공간, 실외기실 등 발코니 내부 전역의 외기 접촉면을 정돈하는 공정입니다. 신축 아파트의 콘크리트 습기 배출 유도부터 구축 세대의 들뜬 시멘트 박리 보강까지 아파트 연식에 맞춘 세분화된 도장 품질을 유지합니다.',
    faqSet: [
      '탄성코트 시공 전에 짐을 모두 빼야 하나요?',
      '기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?',
      '곰팡이나 결로가 있으면 바로 시공해도 되나요?',
      '탄성코트 색상은 어떻게 선택하나요?',
      '탄성코트 부분 보수와 전체 시공은 어떻게 구분하나요?'
    ],
    relatedServices: ['탄성코트', '탄성코트시공', '베란다탄성코트', '탄성코트업체'],
    imagePlaceholderKey: 'ELASTIC_COATING_HERO'
  },
  {
    keyword: '탄성코트업체',
    breakParts: ['탄성코트', '업체'],
    serviceGroup: 'elastic',
    searchIntent: 'agency',
    serviceFamily: 'elasticCoating',
    serviceIntent: 'agency',
    spaceType: null,
    primarySpace: '베란다 · 세탁실 벽체',
    heroTitleTemplate: '시공 전 확인 기준부터 비교하세요',
    heroDescriptionTemplate: '{region} 지역의 과장된 장기 보증 선전 대신, 들뜬 마감을 꼼꼼히 긁어내고 바탕면을 철저히 정돈하는 신뢰성 있는 기준을 제안합니다.',
    metaTitleTemplate: '탄성코트업체 비교 및 선택 기준 안내',
    metaDescriptionTemplate: '{region} 탄성코트 업체가 많아 어디에 맡겨야 할지 고민이신가요? 견적뿐 아니라 벽면 상태와 보수·시공 범위를 확인하고 상담합니다. 시공 후에도 문제가 생기면 A/S 기준에 따라 확인해드립니다.',
    sectionDescriptionTemplate: '{region} 탄성코트업체를 비교할 때는 도포 기계 분사 두께의 균일성뿐만 아니라, 들뜬 도막 정돈과 균열 보수 등의 전처리 공정에 얼마큼의 시간을 투자하는지 점검해야 합니다. 투명한 시공 프로세스와 안심 보증 기준을 확인하세요.',
    faqSet: [
      '탄성코트 업체를 선택할 때 무엇을 확인해야 하나요?',
      '탄성코트 시공 사례는 어떤 기준으로 확인해야 하나요?',
      '탄성코트 부분 보수와 전체 시공은 어떻게 구분하나요?',
      '곰팡이나 결로가 있으면 바로 시공해도 되나요?',
      '탄성코트 시공 전 기존 벽면 상태를 확인하나요?'
    ],
    relatedServices: ['탄성코트', '탄성코트시공', '베란다탄성코트', '세탁실탄성코트'],
    imagePlaceholderKey: 'ELASTIC_COATING_HERO'
  },

  // ---------------- 줄눈시공 서비스군 (6개) ----------------
  {
    keyword: '줄눈시공',
    breakParts: ['줄눈시공'],
    serviceGroup: 'grout',
    searchIntent: 'general',
    serviceFamily: 'grout',
    serviceIntent: 'general',
    spaceType: null,
    primarySpace: '욕실 · 화장실 · 현관 · 베란다',
    heroTitleTemplate: '기존 줄눈 상태에 맞춘 마감',
    heroDescriptionTemplate: '{region} 욕실과 현관 등 타일 틈의 기존 줄눈 오염과 갈라짐을 확인하고, 공간의 사용 환경에 맞는 자재와 색상을 안내합니다.',
    metaTitleTemplate: '줄눈시공 안내 | 타일 틈새 오염 관리 기준',
    metaDescriptionTemplate: '{region} 욕실과 현관 타일 틈새의 미세 분진과 백시멘트 오염을 방지하는 정교한 줄눈시공입니다. 타일 오염 상태를 진단하는 바름공간의 안내를 확인해 보세요.',
    sectionDescriptionTemplate: '{region} 지역의 줄눈시공은 습기와 외부 오염에 노출되기 쉬운 타일 틈새 백시멘트의 마모와 유실을 보강하는 작업입니다. 미세 분진을 유발하는 부식된 백시멘트를 정교한 깊이로 홈파기 정돈한 후 폴리아스파틱 줄눈재를 주입하여 위생적인 바닥 관리를 돕습니다.',
    faqSet: [
      '기존 줄눈을 제거하고 시공하나요?',
      '욕실과 현관에 같은 자재를 사용하나요?',
      '줄눈 일부만 보수할 수 있나요?',
      '시공 후 언제부터 물을 사용할 수 있나요?',
      '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?'
    ],
    relatedServices: ['욕실줄눈시공', '현관줄눈시공', '베란다줄눈시공', '줄눈시공업체'],
    imagePlaceholderKey: 'GROUT_HERO'
  },
  {
    keyword: '욕실줄눈시공',
    breakParts: ['욕실', '줄눈시공'],
    serviceGroup: 'grout',
    searchIntent: 'space',
    serviceFamily: 'grout',
    serviceIntent: 'space',
    spaceType: 'bathroom',
    primarySpace: '욕실 바닥 및 샤워부스 벽면',
    heroTitleTemplate: '오염과 균열을 방지하는 정돈',
    heroDescriptionTemplate: '{region} 지역의 항상 물이 고이고 세제가 도포되는 욕실 바닥 타일의 백시멘트 부식을 진단하고, 방습력이 우수한 마감을 안내합니다.',
    metaTitleTemplate: '욕실줄눈시공 자재 선택과 청결 관리 가이드',
    metaDescriptionTemplate: '{region} 욕실 바닥 타일 틈의 부식된 백시멘트 정돈과 변기 테두리 실리콘 코킹 오염을 방어하는 시공 가이드입니다. 양생과 건조 권장 시간을 소개합니다.',
    sectionDescriptionTemplate: '{region} 욕실줄눈시공은 상시 습기와 배수 세제에 노출되는 욕실 바닥과 샤워부스 벽면의 위생 관리를 강화합니다. 변기 테두리 틈새 오염을 방지하고 줄눈 안착을 극대화하기 위해 측면 잔여 백시멘트 긁어내기와 경화 시간 준수를 원칙으로 합니다.',
    faqSet: [
      '기존 줄눈을 제거하고 시공하나요?',
      '시공 후 언제부터 물을 사용할 수 있나요?',
      '줄눈 일부만 보수할 수 있나요?',
      '오염된 줄눈 위에 바로 덧시공하나요?',
      '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?'
    ],
    relatedServices: ['줄눈시공', '현관줄눈시공', '화장실줄눈시공', '줄눈시공업체'],
    imagePlaceholderKey: 'BATHROOM_GROUT_IMAGE'
  },
  {
    keyword: '현관줄눈시공',
    serviceGroup: 'grout',
    searchIntent: 'space',
    serviceFamily: 'grout',
    serviceIntent: 'space',
    spaceType: 'entrance',
    primarySpace: '현관 타일',
    heroTitleTemplate: '외부 오염물질 유입을 차단하는 마감',
    heroDescriptionTemplate: '{region} 현관의 외부 흙먼지와 지속적인 보행 마찰에 노출되는 타일 전용 고밀도 조색 줄눈 마감 기준을 확인하세요.',
    metaTitleTemplate: '현관줄눈시공 조색 조합 및 마감 기준 안내',
    metaDescriptionTemplate: '{region} 외부 모래와 흙먼지 유입으로 노후하기 쉬운 현관 타일 전용 줄눈 작업입니다. 타일 톤에 부합하는 조색 조합 매칭법과 테두리 오염을 예방하는 마감을 제시합니다.',
    sectionDescriptionTemplate: '{region} 현관줄눈시공은 현관 진입 시 유입되는 먼지와 신발 밑창 오염물이 타일 틈새로 착색되는 현상을 방지합니다. 보행 빈도를 감안한 내마모 성능의 자재 결합과 타일 톤에 자연스럽게 녹아드는 맞춤형 골드, 실버, 메탈릭 펄 조색 매칭을 안내합니다.',
    faqSet: [
      '기존 줄눈을 제거하고 시공하나요?',
      '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?',
      '줄눈 일부만 보수할 수 있나요?',
      '오염된 줄눈 위에 바로 덧시공하나요?',
      '욕실과 현관에 같은 자재를 사용하나요?'
    ],
    relatedServices: ['줄눈시공', '욕실줄눈시공', '베란다줄눈시공', '줄눈시공업체'],
    imagePlaceholderKey: 'ENTRANCE_GROUT_IMAGE'
  },
  {
    keyword: '베란다줄눈시공',
    serviceGroup: 'grout',
    searchIntent: 'space',
    serviceFamily: 'grout',
    serviceIntent: 'space',
    spaceType: 'balcony',
    primarySpace: '베란다 타일',
    heroTitleTemplate: '비난방 공간의 수축 팽창에 강한 줄눈',
    heroDescriptionTemplate: '{region} 베란다 타일 틈의 수축과 팽창 등 외부 단열 기온 차이를 극복하는 줄눈 마감재 기준을 확인하세요.',
    metaTitleTemplate: '베란다줄눈시공 온도 변화에 강한 자재 선정',
    metaDescriptionTemplate: '{region} 사계절 단열 기온 차이로 타일 틈새 수축 팽창이 잦은 베란다 맞춤형 줄눈 마감 정보입니다. 줄눈 탈락을 예방하는 고연성 주입 자재 기준을 수록하였습니다.',
    sectionDescriptionTemplate: '{region} 베란다줄눈시공은 보일러 비난방 구역인 발코니 바닥 타일의 온도 편차에 의한 줄눈 탈락 현상을 예방합니다. 사계절 수축과 팽창을 거듭하는 타일의 움직임을 유연하게 잡아주는 고탄성 특화 줄눈재와 세심한 테두리 마감을 완성합니다.',
    faqSet: [
      '기존 줄눈을 제거하고 시공하나요?',
      '시공 후 언제부터 물을 사용할 수 있나요?',
      '줄눈 일부만 보수할 수 있나요?',
      '욕실과 현관에 같은 자재를 사용하나요?',
      '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?'
    ],
    relatedServices: ['줄눈시공', '욕실줄눈시공', '현관줄눈시공', '줄눈시공업체'],
    imagePlaceholderKey: 'BALCONY_GROUT_IMAGE'
  },
  {
    keyword: '줄눈시공업체',
    serviceGroup: 'grout',
    searchIntent: 'agency',
    serviceFamily: 'grout',
    serviceIntent: 'agency',
    spaceType: null,
    primarySpace: '욕실 · 현관 타일 전 구역',
    heroTitleTemplate: '줄눈시공의 올바른 정돈 기준 비교',
    heroDescriptionTemplate: '{region} 지역의 눈으로 바로 보이는 펄 색상 마감보다, 타일 틈새 백시멘트를 수작업으로 확실하게 홈파기 정돈하는 업체를 선택하세요.',
    metaTitleTemplate: '줄눈시공업체 비교 포인트 및 품질 검토 가이드',
    metaDescriptionTemplate: '{region} 줄눈시공 업체를 비교할 때의 핵심인 수작업 홈파기 깊이와 타일 측면 밀착 청소 점검 요령입니다. 올바른 줄눈 주입 공정을 선별하는 기준을 전해드립니다.',
    sectionDescriptionTemplate: '{region} 줄눈시공업체 비교 시에는 작업 단가나 펄의 색상 종류에 국한되지 않고 타일 옆면(U자형 홈파기) 청소 수준을 필수 검토해야 합니다. 타일 단차와 틈새 정리를 투명하게 진행하는 전문 업체의 공정 기준을 안내합니다.',
    faqSet: [
      '줄눈시공 업체의 견적은 어떤 내용을 비교해야 하나요?',
      '줄눈 시공 전 기존 백시멘트 상태를 확인하나요?',
      '줄눈시공 사례는 어떤 기준으로 확인해야 하나요?',
      '줄눈 부분 보수와 전체 시공은 어떻게 구분하나요?',
      '기존 줄눈을 제거하고 시공하나요?'
    ],
    relatedServices: ['줄눈시공', '욕실줄눈시공', '현관줄눈시공', '화장실줄눈시공'],
    imagePlaceholderKey: 'GROUT_HERO'
  },
  {
    keyword: '화장실줄눈시공',
    serviceGroup: 'grout',
    searchIntent: 'space',
    serviceFamily: 'grout',
    serviceIntent: 'space',
    spaceType: 'toilet',
    primarySpace: '안방 및 공동 화장실 바닥',
    heroTitleTemplate: '화장실 물고임을 방지하는 견고한 라인',
    heroDescriptionTemplate: '{region} 화장실 바닥 타일 틈새의 오염물 고임과 젠다이 테두리 실리콘 변색을 억제하는 고강도 줄눈 마감을 안내합니다.',
    metaTitleTemplate: '화장실줄눈시공 범위 안내 및 보수 가이드',
    metaDescriptionTemplate: '{region} 화장실 바닥의 배수구 주변 물고임 단차 보강과 욕조 젠다이 주변의 실리콘 황변 방지 줄눈 마감 요령입니다. 고점도 안착 공법과 건조 기준을 확인하세요.',
    sectionDescriptionTemplate: '{region} 화장실줄눈시공은 안방 화장실 및 공용 화장실의 좁은 타일 배열과 배수 단차 경사를 감안하여 시공됩니다. 미세한 유속에도 흘러내리지 않고 균일한 수평을 형성하는 고점도 줄눈 충진 공법으로 오염 고임을 차단하고 양생 관리를 안착시킵니다.',
    faqSet: [
      '기존 줄눈을 제거하고 시공하나요?',
      '시공 후 언제부터 물을 사용할 수 있나요?',
      '줄눈 일부만 보수할 수 있나요?',
      '오염된 줄눈 위에 바로 덧시공하나요?',
      '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?'
    ],
    relatedServices: ['줄눈시공', '욕실줄눈시공', '현관줄눈시공', '줄눈시공업체'],
    imagePlaceholderKey: 'TOILET_GROUT_IMAGE'
  }
];

export const FAQ_CATALOG = {
  // 탄성코트 서비스군 (elasticCoating)
  '기존 탄성코트가 들뜬 곳도 다시 시공할 수 있나요?': '재시공 가능 여부는 기존 마감의 접착 상태를 확인한 후에 판단할 수 있습니다. 들뜬 부분을 정리하지 않고 바로 덧시공을 하게 되면 다시 떨어질 우려가 있으므로, 사전에 상태를 확인하고 필요한 부분 보수 또는 전체 재시공 범위를 결정해야 합니다.',
  '곰팡이나 결로가 있으면 바로 시공해도 되나요?': '표면만 덮어서 시공을 진행하면 원인이 해결되지 않아 마감 후에 다시 문제가 생길 수 있습니다. 결로나 누수 의심 원인을 먼저 확인해 조치를 취하고, 바탕면의 건조 상태가 완전히 확인된 후에 시공하는 것이 바람직합니다.',
  '탄성코트 시공 전에 짐을 모두 빼야 하나요?': '작업할 벽면 및 보양을 진행할 공간의 확보와 작업 동선이 마련되어야 합니다. 세탁기, 선반, 실외기 등 부피가 큰 짐들의 이동 가능 여부는 사전 사진 상담 시 상태를 확인한 후에 안내해 드립니다.',
  '탄성코트 색상은 어떻게 선택하나요?': '기존 인테리어와의 배합을 분석하여 현장에서 샘플 조색 카드를 대조하며 선택합니다. 밝은 톤의 웜화이트 및 실버와 내추럴 그레이 등 관리가 수월한 색상 매칭을 안내합니다.',
  '탄성코트 시공 전 기존 벽면 상태를 확인하나요?': '벽체의 누수 여부나 수분 함유 상태에 따라 하부 균열 보수 방법과 도포 자재 배합이 달라지므로 시공 전 상태 진단은 반드시 필요합니다.',
  '시공 후 환기와 건조는 어떻게 해야 하나요?': '도포된 수지가 고르게 양생될 때까지 온도와 자연 기류 통풍 흐름을 안정적으로 유지해야 합니다. 자재 등급 및 양생 당일의 날씨 환경에 맞춰 상세히 안내해 드립니다.',
  '탄성코트 부분 보수와 전체 시공은 어떻게 구분하나요?': '벽체 모서리 일부 페인트 박리나 국소 부위의 곰팡이가 전부인지 분석하여, 전체 도막 상태에 따라 합리적인 조치 범위를 제안합니다.',
  '탄성코트 시공 사례는 어떤 기준으로 확인해야 하나요?': '마감이 완료된 표면의 균일한 세라믹 도막 두께, 구석 코너 부위의 들뜸이나 뭉침이 없이 깔끔하게 도포 정리되었는지의 근접 디테일 사진을 확인하는 것이 좋습니다.',
  '탄성코트 업체를 선택할 때 무엇을 확인해야 하나요?': '들뜬 마감을 철저히 긁어내는 전처리 밑작업 원칙을 고수하는지, 그리고 눈에 보이지 않는 균열 틈새 보강 절차를 성실히 진행하는지가 가장 핵심적인 선택 기준입니다.',

  // 줄눈시공 서비스군 (grout)
  '기존 줄눈을 제거하고 시공하나요?': '기존 타일 사이 줄눈의 오염도, 갈라짐 정도, 접착 상태를 면밀히 분석한 후 작업을 시작합니다. 필요한 작업 범위 내에 있는 기존 백시멘트를 제거하고 틈새를 꼼꼼히 정리하는 과정을 거친 후에 다시 시공하게 됩니다.',
  '욕실과 현관에 같은 자재를 사용하나요?': '공간마다 물을 접하는 빈도와 오염물이 유입되는 경로가 다릅니다. 타일의 종류와 기존 마감재 상태도 다르기 때문에, 해당 공간의 환경에 가장 잘 부합하는 적합한 등급의 자재와 마감 색상을 선정하여 안내해 드립니다.',
  '줄눈 일부만 보수할 수 있나요?': '줄눈의 훼손 부위 접착 특성을 판단해 마감 탈락 위험성이 높지 않은 경우 국소 보수가 가능합니다. 단, 전체 균일도 유지를 위해 가능한 타일 면 단위 정리를 권장합니다.',
  '시공 후 언제부터 물을 사용할 수 있나요?': '정확한 사용 가능 시점은 현장에서 적용한 자재의 특성, 그리고 당일 현장의 온도와 습도 조건에 따라 다르게 나타납니다. 시공이 완료된 후 현장에서 양생 건조 관련 세부 주의사항과 함께 안내해 드립니다.',
  '타일 색상에 맞춰 줄눈 색상을 선택할 수 있나요?': '타일의 메탈 느낌이나 은은한 미색에 맞춘 다채로운 메탈 조색, 펄 컬러 색조판을 구비하여 현장에서 대조 확인 후 선택할 수 있도록 조율합니다.',
  '오염된 줄눈 위에 바로 덧시공하나요?': '오염물이 고착된 노후 백시멘트 바로 위에 줄눈제를 바르면 부착력이 저하되어 금방 부스러져 떨어집니다. 반드시 기존 오염된 줄눈 틈을 긁어 정리한 후에 시공을 집행합니다.',
  '줄눈시공 업체의 견적은 어떤 내용을 비교해야 하나요?': '단순 최저 단가보다는 기존 노후 마감재 홈파기 정리 깊이, 변기 및 욕조 테두리 코킹 마감 범위가 견적서상에 명확히 수록되어 있는지를 면밀히 비교 확인해야 합니다. 단순 작업명 치환이 아닌 실제 실무 항목 비교가 중요합니다.',
  '줄눈 시공 전 기존 백시멘트 상태를 확인하나요?': '백시멘트의 강도나 경화 수준에 맞춰 긁어내는 홈파기 공구 선택과 측면 청소 범위가 달라지므로 시공 전 상태 진단은 반드시 필요합니다.',
  '줄눈시공 사례는 어떤 기준으로 확인해야 하나요?': '타일 테두리 측면과 줄눈선이 일정하게 수평을 이루며, 넘치거나 모자람 없이 고르게 충진되었는지의 실제 근접 디테일 사진을 확인하는 것이 좋습니다.',
  '줄눈 부분 보수와 전체 시공은 어떻게 구분하나요?': '타일 틈새의 갈라짐이나 탈락이 전체 욕실 바닥 면적의 극히 일부분에 국한되는지 판단하여, 누수 우려가 없는 범위 내에서 조치 범위를 구분해 제안합니다.'
};
