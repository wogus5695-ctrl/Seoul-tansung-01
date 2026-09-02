// A/B Test Search Thumbnail mappings for dynamic landing pages.
// Controls which pages get the custom test thumbnails instead of the default v2.

export const thumbnailTestMap = {
  // TEST-A Group (3 URLs - Raw field photo, og:image only, body img 0)
  '개봉동-탄성코트': '/images/seo/bareumgonggan-field-01.jpg',
  '삼성동-탄성코트': '/images/seo/bareumgonggan-field-02.jpg',
  '개봉동-세탁실탄성코트': '/images/seo/bareumgonggan-field-03.jpg',

  // TEST-B Group (3 URLs - Raw field photo + Semantic body img Candidate)
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
  '이문동-탄성코트업체': { width: 720, height: 720 }
};

export const testBKeywords = new Set([
  '남현동-탄성코트시공',
  '공릉동-탄성코트업체',
  '이문동-탄성코트업체'
]);
