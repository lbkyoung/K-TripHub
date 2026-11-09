// k-triphub Translation & Localization Helpers

export const AGENCY_NAME_MAP: Record<string, { ko: string; en: string }> = {
  '서울투어 익스프레스': { ko: '서울투어 익스프레스', en: 'Seoul Tour Express' },
  'Seoul Tour Express': { ko: '서울투어 익스프레스', en: 'Seoul Tour Express' },
  '제주 오름 트래블': { ko: '제주 오름 트래블', en: 'Jeju Oreum Travel' },
  'Jeju Oreum Travel': { ko: '제주 오름 트래블', en: 'Jeju Oreum Travel' },
  'K-컬처 투어즈': { ko: 'K-컬처 투어즈', en: 'K-Culture Tours' },
  'K-Culture Tours': { ko: 'K-컬처 투어즈', en: 'K-Culture Tours' },
  '부산 로컬 마린스': { ko: '부산 로컬 마린스', en: 'Busan Local Marines' },
  'Busan Local Marines': { ko: '부산 로컬 마린스', en: 'Busan Local Marines' },
  '달빛 신라 여행사': { ko: '달빛 신라 여행사', en: 'Moonlight Silla Travel' },
  'Moonlight Silla Travel': { ko: '달빛 신라 여행사', en: 'Moonlight Silla Travel' },
  '강원 힐링로드 투어': { ko: '강원 힐링로드 투어', en: 'Gangwon Healing Road Tour' },
  'Gangwon Healing Road Tour': { ko: '강원 힐링로드 투어', en: 'Gangwon Healing Road Tour' },
};

export const PRODUCT_TITLE_MAP: Record<number, { ko: string; en: string }> = {
  1: {
    ko: '[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 전통 골목 프라이빗 워킹 투어',
    en: '[Top Rated] Gyeongbokgung Hanbok & Bukchon Village Private Walking Tour',
  },
  2: {
    ko: '[힐링 제주 1일] 비밀 오름 트레킹 & 동쪽 해안도로 감성 드라이브',
    en: '[Healing Jeju] Secret Oreum Trekking & East Coast Scenic Drive',
  },
  3: {
    ko: '[방한 외국인 전용] K-POP 성지 순례 & 홍대 스트리트 푸드 마스터 클래스',
    en: '[Foreigners Special] K-Pop Hotspots & Hongdae Street Food Crawl',
  },
  4: {
    ko: '[야경 스페셜] 해운대 요트 투어 & 광안대교 야경 드론쇼 관람',
    en: '[Night Yacht] Busan Haeundae Yacht & Gwangandaegyo Light Show Tour',
  },
};

export const PAYMENT_METHOD_MAP: Record<string, { ko: string; en: string }> = {
  CARD_GLOBAL: { ko: '해외 신용카드 (Visa/Master)', en: 'Global Card (Visa / Master)' },
  CARD_DOMESTIC: { ko: '국내 신용카드', en: 'Korean Local Card' },
  KAKAOPAY: { ko: '카카오페이', en: 'KakaoPay' },
  TOSSPAY: { ko: '토스페이', en: 'TossPay' },
};

export function getTranslatedAgency(agencyName: string | undefined, lang: 'ko' | 'en'): string {
  if (!agencyName) return lang === 'en' ? 'Verified Agency' : '인증 여행사';
  
  // Exact match
  if (AGENCY_NAME_MAP[agencyName]) {
    return AGENCY_NAME_MAP[agencyName][lang];
  }

  // Partial match
  for (const [key, val] of Object.entries(AGENCY_NAME_MAP)) {
    if (agencyName.includes(key)) {
      return val[lang];
    }
  }

  // Fallback for custom agency names when English mode is on
  if (lang === 'en') {
    // If it contains Korean characters, translate common suffixes or clean up
    return agencyName
      .replace(/서울투어/g, 'Seoul Tour')
      .replace(/제주/g, 'Jeju')
      .replace(/오름/g, 'Oreum')
      .replace(/부산/g, 'Busan')
      .replace(/익스프레스/g, 'Express')
      .replace(/트래블/g, 'Travel')
      .replace(/여행사/g, 'Travel Agency')
      .replace(/마린스/g, 'Marines')
      .replace(/투어즈/g, 'Tours')
      .replace(/투어/g, 'Tour');
  }

  return agencyName;
}

export function getTranslatedProductTitle(
  item: {
    id?: number | string;
    productId?: number;
    productTitle?: string;
    productTitleKo?: string;
    productTitleEn?: string;
    titleKo?: string;
    titleEn?: string;
  },
  lang: 'ko' | 'en'
): string {
  if (lang === 'en') {
    if (item.productTitleEn && item.productTitleEn.trim()) return item.productTitleEn;
    if (item.titleEn && item.titleEn.trim()) return item.titleEn;

    // Check by productId or id
    const pid = item.productId || (typeof item.id === 'number' ? item.id : undefined);
    if (pid && PRODUCT_TITLE_MAP[pid]) {
      return PRODUCT_TITLE_MAP[pid].en;
    }

    // Check by Korean title contents
    const raw = item.productTitle || item.productTitleKo || item.titleKo || '';
    if (raw.includes('제주') || raw.includes('오름') || raw.includes('한라산')) {
      return '[Healing Jeju] Secret Oreum Trekking & East Coast Scenic Drive';
    }
    if (raw.includes('경복궁') || raw.includes('한복') || raw.includes('북촌')) {
      return '[Top Rated] Gyeongbokgung Hanbok & Bukchon Village Private Walking Tour';
    }
    if (raw.includes('K-POP') || raw.includes('홍대')) {
      return '[Foreigners Special] K-Pop Hotspots & Hongdae Street Food Crawl';
    }
    if (raw.includes('해운대') || raw.includes('요트') || raw.includes('부산')) {
      return '[Night Yacht] Busan Haeundae Yacht & Gwangandaegyo Light Show Tour';
    }

    // If English title wasn't found and raw title is English, return it
    if (!/[가-힣]/.test(raw) && raw.trim()) {
      return raw;
    }

    return '[Korea Travel Package] Korea Tour Experience';
  }

  // Korean mode
  if (item.productTitleKo && item.productTitleKo.trim()) return item.productTitleKo;
  if (item.titleKo && item.titleKo.trim()) return item.titleKo;
  if (item.productTitle && item.productTitle.trim()) return item.productTitle;

  const pid = item.productId || (typeof item.id === 'number' ? item.id : undefined);
  if (pid && PRODUCT_TITLE_MAP[pid]) {
    return PRODUCT_TITLE_MAP[pid].ko;
  }

  return '[한국 여행] 프리미엄 투어 패키지';
}

export function getTranslatedPaymentMethod(method: string | undefined, lang: 'ko' | 'en'): string {
  if (!method) return lang === 'en' ? 'Credit Card' : '신용카드';
  if (PAYMENT_METHOD_MAP[method]) {
    return PAYMENT_METHOD_MAP[method][lang];
  }
  return method;
}

// ---------------------------------------------------------------------------
// Tour Inclusions & Exclusions Translation Maps
// ---------------------------------------------------------------------------
export const INCLUDED_MAP: Record<string, string> = {
  // Tour 1: Gyeongbokgung & Bukchon
  '고급 전통 한복 대여권 (4시간)': 'Premium Royal Hanbok Rental (4 Hours)',
  '경복궁 전문 해설 가이드비': 'Licensed Gyeongbokgung Palace Docent Guide',
  '북촌 전통 찻집 다도 음료': 'Traditional Bukchon Teahouse Tea & Korean Sweets',
  '스냅 사진 촬영 (디지털 원본 제공)': 'Professional Snapshot Photography (Original Digital Files)',

  // Tour 2: Jeju Oreum & Coast
  '전용 차량 픽업 & 샌딩': 'Private Van Hotel / Airport Pick-up & Drop-off',
  '오름 전문 로컬 가이드': 'Certified Local Oreum Trekking Guide',
  '제주 로컬 흑돼지/해물 점심 식사': 'Jeju Local Black Pork or Fresh Seafood Lunch',
  '생수 및 피톤치드 굿즈': 'Bottled Water & Phytoncide Forest Souvenir',

  // Tour 3: K-Pop & Hongdae
  '영어 유창한 전문 호스트 가이드': 'Fluent English-Speaking K-Culture Specialist Guide',
  '길거리 음식 시식 5종 (떡볶이, 호떡, 닭강정 등)': '5 Popular Street Food Tastings (Tteokbokki, Hotteok, Crispy Dakgangjeong, etc.)',
  'K-POP 공식 기념품 굿즈': 'Official K-POP Commemorative Merchandise',

  // Tour 4: Busan Yacht & Drone Show
  '럭셔리 요트 탑승권': 'Luxury Yacht Boarding Pass',
  '선상 샴페인/음료/다과': 'Onboard Champagne, Beverages & Light Snacks',
  '구명조끼 및 안전요원': 'Life Jacket & Marine Safety Crew Service',
  '불꽃놀이 이벤트': 'Onboard Fireworks Celebration Event',

  // Generic / Registered Tour Defaults
  '전문 로컬 가이드 해설비': 'Licensed Local Guide Service',
  '관련 입장료 및 체험비': 'Admission Tickets & Activity Fees',
  '전용 차량 및 유류비': 'Private Vehicle & Fuel',
};

export const EXCLUDED_MAP: Record<string, string> = {
  // Tour 1
  '개인 교통비 및 식사비': 'Personal Transportation & Meals',
  '여행자 개인 보험': "Traveler's Personal Insurance",

  // Tour 2
  '개인 기념품 구매비': 'Personal Souvenirs & Shopping',
  '항공권/숙박': 'Flights & Hotel Accommodation',

  // Tour 3
  '개인 쇼핑비': 'Personal Shopping & Extra Souvenirs',

  // Tour 4
  '요트장까지 왕복 교통비': 'Round-trip Transportation to The Bay 101 Marina',

  // Generic Defaults
  '개인 식사비 및 음료': 'Personal Meals & Beverages',
  '여행자 보험': "Traveler's Personal Insurance",
};

// ---------------------------------------------------------------------------
// Tour Schedule Timeline Translation Maps
// ---------------------------------------------------------------------------
export const SCHEDULE_TITLE_MAP: Record<string, string> = {
  // Tour 1
  '안국역 집결 & 한복 피팅': 'Meet at Anguk Station & Hanbok Fitting',
  '경복궁 근정전 & 경회루 해설 투어': 'Gyeongbokgung Geunjeongjeon & Gyeonghoeru Docent Tour',
  '북촌 한옥마을 돌담길 산책 & 인생샷 촬영': 'Bukchon Hanok Village Stone-wall Stroll & Photo Shoot',
  '전통 찻집 다도 체험 & 투어 마무리': 'Traditional Teahouse Tea Ceremony & Tour Farewell',

  // Tour 2
  '제주공항 / 호텔 픽업': 'Jeju Airport / Hotel Pick-up',
  '비밀 삼나무숲 & 오름 트레킹': 'Secret Cedar Forest & Oreum Trekking',
  '제주 해녀 직영 식당 점심': 'Authentic Haenyeo Diver Restaurant Lunch',
  '동쪽 해안도로 드라이브 & 오션뷰 카페': 'East Coast Scenic Drive & Ocean-view Cafe',
  '투어 종료 및 샌딩': 'Tour Conclusion & Hotel Drop-off',

  // Tour 3
  '홍대입구역 만남 & K-POP 댄스 거리 관람': 'Meet at Hongik Univ. Station & Busking Street',
  '스트리트 푸드 먹방 챌린지': 'Hongdae Street Food Tasting Crawl',
  '뮤직비디오 명소 포토존 & 마무리': 'Iconic MV Filming Hotspots & Photo Shoot',

  // Tour 4
  '더베이101 요트 계류장 집결': 'Gather at The Bay 101 Yacht Marina',
  '해운대 ~ 광안리 밤바다 항해': 'Haeundae to Gwangalli Night Ocean Cruise',
  '광안대교 드론 라이트쇼 관람': 'Gwangandaegyo Bridge Drone Light Show',

  // Registered Defaults
  '출발지 집결 및 오리엔테이션': 'Meeting at Departure Point & Orientation',
  '대표 명소 투어 및 전통 체험': 'Key Landmarks Tour & Cultural Experience',
  '자유시간 및 투어 종료': 'Free Time & Tour Conclusion',
};

export const SCHEDULE_DESC_MAP: Record<string, string> = {
  // Tour 1
  '전문 스타일리스트의 도움을 받아 취향에 맞는 프리미엄 한복을 대여합니다.':
    'Select and fit premium traditional Hanbok with the assistance of a professional stylist.',
  '조선 왕실의 역사와 궁궐 건축미에 대한 재미있는 전문 해설을 듣습니다.':
    'Listen to captivating stories of Joseon royal dynasty history and palace architectural beauty.',
  '기와 처마가 아름다운 전통 골목을 거닐며 가이드가 인생 사진을 남겨드립니다.':
    'Stroll along picturesque tiled-roof alleys while your guide takes memorable lifetime photos.',
  '한국 전통차와 한과를 맛보며 여유로운 대화를 나누고 투어를 종료합니다.':
    'Savor Korean artisanal tea and traditional snacks with relaxing conversation before concluding.',

  // Tour 2
  '쾌적한 전용 밴으로 여행객을 맞이합니다.':
    'Meet your guide in a spacious private air-conditioned van.',
  '곧게 뻗은 피톤치드 삼나무 숲길을 지나 오름 정상에서 한라산 뷰를 감상합니다.':
    'Hike through lush phytoncide cedar paths to enjoy panoramic views of Mt. Hallasan.',
  '해녀가 당일 채취한 신선한 해산물과 제주 정식을 맛봅니다.':
    'Taste freshly caught seafood delicacies and Jeju home-style dishes.',
  '에메랄드빛 바다를 배경으로 여유로운 티타임을 가집니다.':
    'Enjoy a relaxing coffee break overlooking crystal emerald waters.',
  '숙소 또는 공항으로 안전하게 모셔다 드립니다.':
    'Safely return to your hotel or Jeju International Airport.',

  // Tour 3
  '거리 버스킹과 K-POP 굿즈 숍 탐방':
    'Explore youth culture, street busking shows, and official K-Pop idol goods shops.',
  '한국의 소울푸드 길거리 음식 마스터':
    "Master Korea's beloved soul foods with delicious bites across local markets.",
  'SNS 핫플레이스 인증샷 남기기':
    'Capture viral Instagram photos at famous drama and music video locations.',

  // Tour 4
  '탑승 명부 작성 및 안전 교육':
    'Check-in boarding register and receive safety briefing from captain.',
  '선상 음악과 야경 감상':
    'Sail across dazzling city lights with atmospheric onboard background music.',
  '바다 한가운데서 즐기는 환상적인 공연':
    'Watch hundreds of synchronized drones illuminate the night sky right from the ocean.',

  // Registered Defaults
  '가이드와 인사 및 안전 수칙 안내':
    'Meet guide and receive safety guidelines briefing.',
  '전문 해설과 함께하는 알찬 체험':
    'Rich cultural exploration with expert commentary.',
  '기념사진 촬영 후 해산':
    'Photo session and farewell.',
};

export function getTranslatedIncluded(item: string, lang: 'ko' | 'en'): string {
  if (lang !== 'en') return item;
  if (INCLUDED_MAP[item]) return INCLUDED_MAP[item];
  for (const [k, v] of Object.entries(INCLUDED_MAP)) {
    if (item.includes(k) || k.includes(item)) return v;
  }
  if (!/[가-힣]/.test(item)) return item;
  return item;
}

export function getTranslatedExcluded(item: string, lang: 'ko' | 'en'): string {
  if (lang !== 'en') return item;
  if (EXCLUDED_MAP[item]) return EXCLUDED_MAP[item];
  for (const [k, v] of Object.entries(EXCLUDED_MAP)) {
    if (item.includes(k) || k.includes(item)) return v;
  }
  if (!/[가-힣]/.test(item)) return item;
  return item;
}

export function getTranslatedScheduleItem(
  item: { time: string; title: string; desc: string; titleEn?: string; descEn?: string },
  lang: 'ko' | 'en'
): { time: string; title: string; desc: string } {
  if (lang !== 'en') {
    return {
      time: item.time,
      title: item.title,
      desc: item.desc,
    };
  }

  const titleEn =
    item.titleEn ||
    SCHEDULE_TITLE_MAP[item.title] ||
    Object.entries(SCHEDULE_TITLE_MAP).find(([k]) => item.title.includes(k) || k.includes(item.title))?.[1] ||
    (!/[가-힣]/.test(item.title) ? item.title : item.title);

  const descEn =
    item.descEn ||
    SCHEDULE_DESC_MAP[item.desc] ||
    Object.entries(SCHEDULE_DESC_MAP).find(([k]) => item.desc.includes(k) || k.includes(item.desc))?.[1] ||
    (!/[가-힣]/.test(item.desc) ? item.desc : item.desc);

  return {
    time: item.time,
    title: titleEn,
    desc: descEn,
  };
}
