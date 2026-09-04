/**
 * BARUMSPACE SEO ENGINE V2 - OFFICIAL SEARCH INTENT REGISTRY
 * STEP 1-B FROZEN SPECIFICATION IMPLEMENTATION
 * 
 * Rules:
 * - 6 Elastic Coating Keywords strictly mapped to unique Search Intents.
 * - No hash, random, or pseudo-localization dependencies.
 */

export const OFFICIAL_SEARCH_INTENT_REGISTRY = {
  '탄성코트': {
    taskKeyword: '탄성코트',
    intentId: 'concept_diagnosis',
    primaryIntent: '기존 벽면 상태 진단 및 탄성코트 시공 필요성 판단',
    mainTopics: ['들뜸', '균열', '결로', '곰팡이', '벽면상태', '시공적합여부', '시공전확인사항', '관리'],
    h2Blueprints: [
      { id: 'h2_diag', title: '{region} 베란다·세탁실 벽면 상태 진단 기준' },
      { id: 'h2_cause', title: '기존 수성페인트 들뜸과 곰팡이 발생 원인' },
      { id: 'h2_suit', title: '세라믹 탄성 도막 시공 적합성 판단' }
    ],
    faqCategory: 'concept',
    applicableSpaces: ['베란다', '세탁실', '다용도실', '발코니'],
    applicableProblems: ['들뜸', '곰팡이', '결로', '수성페인트균열'],
    applicableProcesses: ['상태진단', '보수판단', '바탕면점검']
  },

  '탄성코트시공': {
    taskKeyword: '탄성코트시공',
    intentId: 'process_execution',
    primaryIntent: '탄성코트 실제 시공 공정과 단계별 진행 과정',
    mainTopics: ['보양', '기존도막정리', '균열보수', '하도', '도포', '건조', '양생', '최종검수'],
    h2Blueprints: [
      { id: 'h2_prep', title: '{region} 탄성코트 시공 전 보양 및 전처리 과정' },
      { id: 'h2_repair', title: '바탕면 정돈 및 균열 메우기 정밀 공정' },
      { id: 'h2_dry', title: '도포 두께 기준과 시공 후 양생 수칙' }
    ],
    faqCategory: 'process',
    applicableSpaces: ['베란다', '세탁실', '발코니'],
    applicableProblems: ['페인트박리', '벽면균열', '도막손상'],
    applicableProcesses: ['비닐보양', '페인트긁어내기', '아크릴실란트보수', '세라믹뿜칠', '건조양생']
  },

  '베란다탄성코트': {
    taskKeyword: '베란다탄성코트',
    intentId: 'space_balcony',
    primaryIntent: '베란다 공간 특화 환경 및 외벽 문제 해결',
    mainTopics: ['베란다벽면', '결로', '창틀주변', '외벽접점', '실외기주변', '습기', '환기', '곰팡이'],
    h2Blueprints: [
      { id: 'h2_balcony', title: '{region} 베란다 외벽 접점의 결로·습기 특성' },
      { id: 'h2_window', title: '창틀 주변 실리콘 및 실외기실 도막 보수' },
      { id: 'h2_vent', title: '베란다 환기 수칙과 도막 유지 관리' }
    ],
    faqCategory: 'balcony',
    applicableSpaces: ['베란다', '발코니', '실외기실', '대피공간'],
    applicableProblems: ['외벽결로', '창틀습기', '모서리곰팡이'],
    applicableProcesses: ['외벽접점보수', '창틀실란트정돈', '베란다특화도포']
  },

  '세탁실탄성코트': {
    taskKeyword: '세탁실탄성코트',
    intentId: 'space_laundry',
    primaryIntent: '세탁실의 물 사용·배관·고습도 환경 대응',
    mainTopics: ['세탁기주변', '수도/배관', '습기', '고습도', '환기', '배관주변균열', '곰팡이', '벽면관리'],
    h2Blueprints: [
      { id: 'h2_laundry', title: '{region} 세탁실 배수관 주변 및 고습도 환경 진단' },
      { id: 'h2_pipe', title: '수도 꼭지 및 배관 연결부 균열 차단' },
      { id: 'h2_wash', title: '세탁기 가동 시 습기 배출과 벽면 보호' }
    ],
    faqCategory: 'laundry',
    applicableSpaces: ['세탁실', '다용도실', '보일러실'],
    applicableProblems: ['고습도오염', '배관주변균열', '배수관습기'],
    applicableProcesses: ['배관주변보양', '수도콕주변보수', '방균세라믹마감']
  },

  '아파트탄성코트': {
    taskKeyword: '아파트탄성코트',
    intentId: 'building_apartment',
    primaryIntent: '아파트 신축·구축·입주 환경의 탄성코트 판단',
    mainTopics: ['신축', '구축', '입주전', '기존도막', '발코니', '서비스공간', '하자확인', '입주시공'],
    h2Blueprints: [
      { id: 'h2_apt', title: '{region} 신축·구축 아파트 발코니 도막 상태 비교' },
      { id: 'h2_movein', title: '아파트 입주 전 베란다 마감 점검사항' },
      { id: 'h2_old', title: '노후 아파트 수성페인트 박리 제거 공정' }
    ],
    faqCategory: 'apartment',
    applicableSpaces: ['아파트베란다', '아파트세탁실', '아파트발코니'],
    applicableProblems: ['입주전점검', '노후페인트들뜸', '신축콘크리트양생'],
    applicableProcesses: ['입주전보양', '기존도막전면제거', '아파트맞춤마감']
  },

  '탄성코트업체': {
    taskKeyword: '탄성코트업체',
    intentId: 'agency_selection',
    primaryIntent: '탄성코트 업체 선택·견적·AS 비교',
    mainTopics: ['업체선정기준', '견적', '자재', '추가비용', 'AS', '하자대응', '상담', '비교기준'],
    h2Blueprints: [
      { id: 'h2_agency', title: '{region} 탄성코트 전문 업체 선택 시 필수 확인 기준' },
      { id: 'h2_cost', title: '시공 범위와 밑작업 보수비용 견적 요소' },
      { id: 'h2_as', title: '시공 후 하자 보증 범위와 A/S 처리 기준' }
    ],
    faqCategory: 'agency',
    applicableSpaces: ['전체서비스공간'],
    applicableProblems: ['업체선정고민', '과장광고피해', 'AS불안'],
    applicableProcesses: ['견적상담', '바탕면점검상담', '책임AS보증']
  }
};
