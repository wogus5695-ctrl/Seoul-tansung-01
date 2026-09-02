// Search Thumbnail mappings for dynamic landing pages.
// Maps Group E (Existing 3) and Group N (CLEAN 3) to historical bareumgonggan-search-thumbnail-v1.jpg

export const thumbnailTestMap = {
  // Group E (3 Existing Indexed URLs)
  '천호동-탄성코트': '/images/seo/bareumgonggan-search-thumbnail-v1.jpg',
  '천호동-세탁실탄성코트': '/images/seo/bareumgonggan-search-thumbnail-v1.jpg',
  '대치동-탄성코트': '/images/seo/bareumgonggan-search-thumbnail-v1.jpg',

  // Group N (3 CLEAN New Region URLs confirmed by user on SearchAdvisor)
  '신남동-탄성코트': '/images/seo/bareumgonggan-search-thumbnail-v1.jpg',
  '방교동-탄성코트': '/images/seo/bareumgonggan-search-thumbnail-v1.jpg',
  '반정동-탄성코트': '/images/seo/bareumgonggan-search-thumbnail-v1.jpg',

  // Previous A/B Test Group A (Field photos)
  '개봉동-탄성코트': '/images/seo/bareumgonggan-field-01.jpg',
  '삼성동-탄성코트': '/images/seo/bareumgonggan-field-02.jpg',
  '개봉동-세탁실탄성코트': '/images/seo/bareumgonggan-field-03.jpg',

  // Previous A/B Test Group B (Field photos + Semantic img)
  '남현동-탄성코트시공': '/images/seo/bareumgonggan-field-04.jpg',
  '공릉동-탄성코트업체': '/images/seo/bareumgonggan-field-05.jpg',
  '이문동-탄성코트업체': '/images/seo/bareumgonggan-field-06.jpg'
};

export const thumbnailDimensions = {
  '개봉동-탄성코트': { width: 720, height: 720 },
  '삼성동-탄성코트': { width: 1024, height: 1024 },
  '개봉동-세탁실탄성코트': { width: 720, height: 720 },
  '남현동-탄성코트시공': { width: 1024, height: 1024 },
  '공릉동-탄성코트업체': { width: 720, height: 720 },
  '이문동-탄성코트업체': { width: 720, height: 720 },

  // Group E and N use standard 1200x1200
  '천호동-탄성코트': { width: 1200, height: 1200 },
  '천호동-세탁실탄성코트': { width: 1200, height: 1200 },
  '대치동-탄성코트': { width: 1200, height: 1200 },
  '신남동-탄성코트': { width: 1200, height: 1200 },
  '방교동-탄성코트': { width: 1200, height: 1200 },
  '반정동-탄성코트': { width: 1200, height: 1200 }
};

export const testBKeywords = new Set([
  '남현동-탄성코트시공',
  '공릉동-탄성코트업체',
  '이문동-탄성코트업체'
]);
