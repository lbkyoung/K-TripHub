'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TourProduct } from '@/lib/types';

export interface SearchFilterState {
  destination: string; // 'all', 'seoul', 'jeju', 'busan', 'culture', 또는 직접 입력한 검색어
  destinationLabel?: string;
  date: string;
  travelers: string;
}

interface TourContextType {
  products: TourProduct[];
  addProduct: (product: Omit<TourProduct, 'id' | 'rating' | 'reviewCount' | 'agencyVerified'>) => void;
  selectedProduct: TourProduct | null;
  openProductDetail: (product: TourProduct) => void;
  closeProductDetail: () => void;
  isRegisterModalOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;

  // 실시간 투어 검색 및 필터 상태
  searchFilter: SearchFilterState;
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  executeSearch: (filter: Partial<SearchFilterState>) => void;
  resetSearch: () => void;
}

const INITIAL_PRODUCTS: TourProduct[] = [
  {
    id: 1,
    agencyName: "서울투어 익스프레스",
    agencyVerified: true,
    titleKo: "[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 전통 골목 프라이빗 워킹 투어",
    titleEn: "[Top Rated] Gyeongbokgung Hanbok & Bukchon Village Private Walking Tour",
    category: 'seoul',
    targetAudience: 'all',
    durationKo: "반일 투어 (4시간)",
    durationEn: "Half-day (4h)",
    priceKrw: 55000,
    priceUsd: 42,
    minPeople: 1,
    maxPeople: 10,
    rating: 4.9,
    reviewCount: 142,
    hasVideo: true,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // 유튜브 임베드 지원
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80",
    ],
    descriptionKo: "조선의 으뜸 궁궐 경복궁에서 전통 프리미엄 한복을 입고, 600년 역사 속을 거니는 프라이빗 투어입니다. 북촌 한옥마을의 숨겨진 골목길과 고즈넉한 전통 찻집에서의 다도 체험까지 함께 즐기실 수 있습니다.",
    descriptionEn: "Wear high-quality royal Hanbok and explore Gyeongbokgung Palace with a licensed docent. Includes a stroll through Bukchon Hanok alleys and traditional tea ceremony.",
    included: ["고급 전통 한복 대여권 (4시간)", "경복궁 전문 해설 가이드비", "북촌 전통 찻집 다도 음료", "스냅 사진 촬영 (디지털 원본 제공)"],
    includedEn: [
      "Premium Royal Hanbok Rental (4 Hours)",
      "Licensed Gyeongbokgung Palace Docent Guide",
      "Traditional Bukchon Teahouse Tea & Sweets",
      "Snapshot Photo Shoot (Original Digital Files)",
    ],
    excluded: ["개인 교통비 및 식사비", "여행자 개인 보험"],
    excludedEn: [
      "Personal Transportation & Meals",
      "Traveler's Personal Insurance",
    ],
    schedule: [
      { time: "10:00", title: "안국역 집결 & 한복 피팅", desc: "전문 스타일리스트의 도움을 받아 취향에 맞는 프리미엄 한복을 대여합니다." },
      { time: "11:00", title: "경복궁 근정전 & 경회루 해설 투어", desc: "조선 왕실의 역사와 궁궐 건축미에 대한 재미있는 전문 해설을 듣습니다." },
      { time: "12:30", title: "북촌 한옥마을 돌담길 산책 & 인생샷 촬영", desc: "기와 처마가 아름다운 전통 골목을 거닐며 가이드가 인생 사진을 남겨드립니다." },
      { time: "13:30", title: "전통 찻집 다도 체험 & 투어 마무리", desc: "한국 전통차와 한과를 맛보며 여유로운 대화를 나누고 투어를 종료합니다." },
    ],
    scheduleEn: [
      { time: "10:00", title: "Meet at Anguk Station & Hanbok Fitting", desc: "Select and fit premium traditional Hanbok with the assistance of a professional stylist." },
      { time: "11:00", title: "Gyeongbokgung Geunjeongjeon & Gyeonghoeru Docent Tour", desc: "Listen to captivating stories of Joseon royal dynasty history and palace architectural beauty." },
      { time: "12:30", title: "Bukchon Hanok Village Stone-wall Stroll & Photo Shoot", desc: "Stroll along picturesque tiled-roof alleys while your guide takes memorable lifetime photos." },
      { time: "13:30", title: "Traditional Teahouse Tea Ceremony & Tour Farewell", desc: "Savor Korean artisanal tea and traditional snacks with relaxing conversation before concluding." },
    ],
  },
  {
    id: 2,
    agencyName: "제주 오름 트래블",
    agencyVerified: true,
    titleKo: "[힐링 제주 1일] 비밀 오름 트레킹 & 동쪽 해안도로 감성 드라이브",
    titleEn: "[Healing Jeju] Secret Oreum Trekking & East Coast Scenic Drive",
    category: 'jeju',
    targetAudience: 'all',
    durationKo: "1일 투어 (8시간)",
    durationEn: "1 Day (8h)",
    priceKrw: 98000,
    priceUsd: 75,
    minPeople: 2,
    maxPeople: 8,
    rating: 4.85,
    reviewCount: 89,
    hasVideo: true,
    imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    ],
    descriptionKo: "인파가 붐비는 관광지가 아닌, 제주 현지인만 아는 비밀 오름을 걷고 동쪽 에메랄드빛 해안도로를 따라 달리는 소규모 프라이빗 힐링 투어입니다.",
    descriptionEn: "Walk through untouched secret volcanic cones (Oreums) and drive along the stunning turquoise coastal roads of eastern Jeju with a native guide.",
    included: ["전용 차량 픽업 & 샌딩", "오름 전문 로컬 가이드", "제주 로컬 흑돼지/해물 점심 식사", "생수 및 피톤치드 굿즈"],
    includedEn: [
      "Private Van Hotel / Airport Pick-up & Drop-off",
      "Certified Local Oreum Trekking Guide",
      "Jeju Local Black Pork or Fresh Seafood Lunch",
      "Bottled Water & Phytoncide Forest Souvenir",
    ],
    excluded: ["개인 기념품 구매비", "항공권/숙박"],
    excludedEn: [
      "Personal Souvenirs & Shopping",
      "Flights & Hotel Accommodation",
    ],
    schedule: [
      { time: "09:00", title: "제주공항 / 호텔 픽업", desc: "쾌적한 전용 밴으로 여행객을 맞이합니다." },
      { time: "10:30", title: "비밀 삼나무숲 & 오름 트레킹", desc: "곧게 뻗은 피톤치드 삼나무 숲길을 지나 오름 정상에서 한라산 뷰를 감상합니다." },
      { time: "12:30", title: "제주 해녀 직영 식당 점심", desc: "해녀가 당일 채취한 신선한 해산물과 제주 정식을 맛봅니다." },
      { time: "14:30", title: "동쪽 해안도로 드라이브 & 오션뷰 카페", desc: "에메랄드빛 바다를 배경으로 여유로운 티타임을 가집니다." },
      { time: "17:00", title: "투어 종료 및 샌딩", desc: "숙소 또는 공항으로 안전하게 모셔다 드립니다." },
    ],
    scheduleEn: [
      { time: "09:00", title: "Jeju Airport / Hotel Pick-up", desc: "Meet your guide in a spacious private air-conditioned van." },
      { time: "10:30", title: "Secret Cedar Forest & Oreum Trekking", desc: "Hike through lush phytoncide cedar paths to enjoy panoramic views of Mt. Hallasan." },
      { time: "12:30", title: "Authentic Haenyeo Diver Restaurant Lunch", desc: "Taste freshly caught seafood delicacies and Jeju home-style dishes." },
      { time: "14:30", title: "East Coast Scenic Drive & Ocean-view Cafe", desc: "Enjoy a relaxing coffee break overlooking crystal emerald waters." },
      { time: "17:00", title: "Tour Conclusion & Hotel Drop-off", desc: "Safely return to your hotel or Jeju International Airport." },
    ],
  },
  {
    id: 3,
    agencyName: "K-컬처 투어즈",
    agencyVerified: true,
    titleKo: "[방한 외국인 전용] K-POP 성지 순례 & 홍대 스트리트 푸드 마스터 클래스",
    titleEn: "[Foreigners Special] K-Pop Hotspots & Hongdae Street Food Crawl",
    category: 'seoul',
    targetAudience: 'foreign',
    durationKo: "5시간 (영어 가이드)",
    durationEn: "5h (English Guide)",
    priceKrw: 69000,
    priceUsd: 53,
    minPeople: 1,
    maxPeople: 12,
    rating: 4.95,
    reviewCount: 310,
    hasVideo: true,
    imageUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=1200&q=80",
    ],
    descriptionKo: "전 세계 K-POP 팬들을 위한 특별 투어! 유명 기획사 사옥부터 인기 뮤직비디오 촬영지, 홍대의 핫플레이스와 길거리 대표 간식을 섭렵하는 인기 코스입니다.",
    descriptionEn: "A dream tour for global K-Culture fans. Visit iconic entertainment agency headquarters, MV filming spots, and taste 5+ famous street foods in Hongdae with an English host.",
    included: ["영어 유창한 전문 호스트 가이드", "길거리 음식 시식 5종 (떡볶이, 호떡, 닭강정 등)", "K-POP 공식 기념품 굿즈"],
    includedEn: [
      "Fluent English-Speaking K-Culture Specialist Guide",
      "5 Popular Street Food Tastings (Tteokbokki, Hotteok, Crispy Dakgangjeong, etc.)",
      "Official K-POP Commemorative Merchandise",
    ],
    excluded: ["개인 쇼핑비"],
    excludedEn: [
      "Personal Shopping & Extra Souvenirs",
    ],
    schedule: [
      { time: "14:00", title: "홍대입구역 만남 & K-POP 댄스 거리 관람", desc: "거리 버스킹과 K-POP 굿즈 숍 탐방" },
      { time: "15:30", title: "스트리트 푸드 먹방 챌린지", desc: "한국의 소울푸드 길거리 음식 마스터" },
      { time: "17:30", title: "뮤직비디오 명소 포토존 & 마무리", desc: "SNS 핫플레이스 인증샷 남기기" },
    ],
    scheduleEn: [
      { time: "14:00", title: "Meet at Hongik Univ. Station & Busking Street", desc: "Explore youth culture, street busking shows, and official K-Pop idol goods shops." },
      { time: "15:30", title: "Hongdae Street Food Tasting Crawl", desc: "Master Korea's beloved soul foods with delicious bites across local markets." },
      { time: "17:30", title: "Iconic MV Filming Hotspots & Photo Shoot", desc: "Capture viral Instagram photos at famous drama and music video locations." },
    ],
  },
  {
    id: 4,
    agencyName: "부산 로컬 마린스",
    agencyVerified: true,
    titleKo: "[야경 스페셜] 해운대 요트 투어 & 광안대교 야경 드론쇼 관람",
    titleEn: "[Night Yacht] Busan Haeundae Yacht & Gwangandaegyo Light Show Tour",
    category: 'busan',
    targetAudience: 'all',
    durationKo: "야간 투어 (3시간)",
    durationEn: "Night Tour (3h)",
    priceKrw: 80000,
    priceUsd: 62,
    minPeople: 1,
    maxPeople: 15,
    rating: 4.92,
    reviewCount: 220,
    hasVideo: false,
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
    ],
    descriptionKo: "부산의 밤바다를 가장 럭셔리하게 즐기는 방법! 해운대 더베이101에서 럭셔리 요트를 타고 광안대교 아래에서 펼쳐지는 황홀한 불꽃과 드론쇼를 바다 위에서 감상합니다.",
    descriptionEn: "Experience the glittering Busan nightscape aboard a luxury yacht from Haeundae to Gwangalli, featuring drone and light shows over the ocean.",
    included: ["럭셔리 요트 탑승권", "선상 샴페인/음료/다과", "구명조끼 및 안전요원", "불꽃놀이 이벤트"],
    includedEn: [
      "Luxury Yacht Boarding Pass",
      "Onboard Champagne, Beverages & Light Snacks",
      "Life Jacket & Marine Safety Crew Service",
      "Onboard Fireworks Celebration Event",
    ],
    excluded: ["요트장까지 왕복 교통비"],
    excludedEn: [
      "Round-trip Transportation to The Bay 101 Marina",
    ],
    schedule: [
      { time: "19:00", title: "더베이101 요트 계류장 집결", desc: "탑승 명부 작성 및 안전 교육" },
      { time: "19:30", title: "해운대 ~ 광안리 밤바다 항해", desc: "선상 음악과 야경 감상" },
      { time: "20:30", title: "광안대교 드론 라이트쇼 관람", desc: "바다 한가운데서 즐기는 환상적인 공연" },
    ],
    scheduleEn: [
      { time: "19:00", title: "Gather at The Bay 101 Yacht Marina", desc: "Check-in boarding register and receive safety briefing from captain." },
      { time: "19:30", title: "Haeundae to Gwangalli Night Ocean Cruise", desc: "Sail across dazzling city lights with atmospheric onboard background music." },
      { time: "20:30", title: "Gwangandaegyo Bridge Drone Light Show", desc: "Watch hundreds of synchronized drones illuminate the night sky right from the ocean." },
    ],
  },
];

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<TourProduct[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<TourProduct | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // 로컬 스토리지에 저장된 추가 상품 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem('k_trip_hub_added_products');
      if (saved) {
        const added: TourProduct[] = JSON.parse(saved);
        setProducts([...INITIAL_PRODUCTS, ...added]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addProduct = (newProductData: Omit<TourProduct, 'id' | 'rating' | 'reviewCount' | 'agencyVerified'>) => {
    const newProduct: TourProduct = {
      ...newProductData,
      id: Date.now(),
      agencyVerified: true,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) => [newProduct, ...prev]);

    // 로컬 스토리지에도 보존
    try {
      const saved = localStorage.getItem('k_trip_hub_added_products');
      const list: TourProduct[] = saved ? JSON.parse(saved) : [];
      list.unshift(newProduct);
      localStorage.setItem('k_trip_hub_added_products', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setIsRegisterModalOpen(false);
  };

  const openProductDetail = (product: TourProduct) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  // 실시간 검색 및 필터 상태
  const [searchFilter, setSearchFilter] = useState<SearchFilterState>({
    destination: 'all',
    destinationLabel: '',
    date: new Date().toISOString().split('T')[0],
    travelers: '2',
  });

  const executeSearch = (filter: Partial<SearchFilterState>) => {
    setSearchFilter((prev) => ({ ...prev, ...filter }));
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      const el = document.getElementById('tours-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const resetSearch = () => {
    setSearchFilter({
      destination: 'all',
      destinationLabel: '',
      date: new Date().toISOString().split('T')[0],
      travelers: '2',
    });
  };

  return (
    <TourContext.Provider
      value={{
        products,
        addProduct,
        selectedProduct,
        openProductDetail,
        closeProductDetail,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal,
        searchFilter,
        setSearchFilter,
        executeSearch,
        resetSearch,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within a TourProvider');
  return ctx;
}
