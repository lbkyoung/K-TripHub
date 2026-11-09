'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Sparkles, Search, ChevronDown, Check } from 'lucide-react';
import { useTour } from '@/context/TourContext';

interface HeroBannerProps {
  lang: 'ko' | 'en';
}

const slides = [
  {
    id: 1,
    titleKo: "대한민국, 어디까지 가보셨나요?",
    subKo: "천년의 역사와 고궁의 기품, 현지 전문 여행사와 함께 깊이 있게 만나보세요",
    titleEn: "How Far Have You Explored Korea?",
    subEn: "Experience timeless royal palaces and rich heritage with certified local guides",
    tagKo: "아름다운 우리 강산, 대한민국",
    tagEn: "Beautiful Land of Korea",
    imageUrl: "/myphoto.jpg", // 사용자가 직접 넣은 사진
  },
  {
    id: 2,
    titleKo: "머무는 곳마다 감동이 되는 우리 강산",
    subKo: "천혜의 비경과 푸르른 산자락, 로컬 여행사와 걷는 특별한 힐링 여행",
    titleEn: "Every Corner of Korea Tells a Story",
    subEn: "Stroll along mystic mountain peaks and discover heartfelt Korean stories",
    tagKo: "신비로운 명산의 정취",
    tagEn: "Mystic Mountain Landscape",
    imageUrl: "/myphoto2.jpg", // 2번 배너 사용자 사진
  },
  {
    id: 3,
    titleKo: "가장 한국다운 여행의 시작",
    subKo: "내국인도 다시 반하고 세계인이 열광하는 대한민국의 숨은 매력을 찾아 떠나요",
    titleEn: "The Most Authentic Journey in Korea",
    subEn: "Discover hidden gems loved by both locals and global travelers alike",
    tagKo: "아름다운 로컬 여행의 매력",
    tagEn: "Charming Authentic Korea",
    imageUrl: "/myphoto3.jpg", // 3번 배너 사용자 사진
  },
];

export default function HeroBanner({ lang }: HeroBannerProps) {
  const { executeSearch, searchFilter } = useTour();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 여행지 선택 상태 (드롭다운 & 직접 입력 지원)
  const [destination, setDestination] = useState<string>('all');
  const [destinationInput, setDestinationInput] = useState<string>('');
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  // 날짜 선택 상태
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const dateInputRef = useRef<HTMLInputElement>(null);

  // 참여 인원 상태
  const [travelers, setTravelers] = useState<string>('2');

  const destinationOptions = [
    { key: 'all', labelKo: '전체 여행지', labelEn: 'All Destinations', icon: '🌟', descKo: '대한민국 전역 로컬 투어', descEn: 'All tours across Korea' },
    { key: 'seoul', labelKo: '서울 / 수도권', labelEn: 'Seoul & Metro', icon: '🏙️', descKo: '고궁, 북촌, K-컬처 & 야경', descEn: 'Palaces, Bukchon & K-Culture' },
    { key: 'jeju', labelKo: '제주도', labelEn: 'Jeju Island', icon: '🌴', descKo: '에메랄드 바다, 오름 & 힐링', descEn: 'Volcanic Oreum, Coast & Nature' },
    { key: 'busan', labelKo: '부산 / 바다', labelEn: 'Busan Coast', icon: '🌊', descKo: '해운대 요트, 자갈치 & 야경', descEn: 'Haeundae Yacht & Sea View' },
    { key: 'culture', labelKo: '역사 / 힐링', labelEn: 'Culture & Nature', icon: '🏛️', descKo: '천년고도 경주, 다도 & 사찰', descEn: 'Historic Gyeongju & Temple stay' },
  ];

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (destDropdownRef.current && !destDropdownRef.current.contains(event.target as Node)) {
        setIsDestDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  // 날짜 픽커 열기 함수
  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch {
        dateInputRef.current.focus();
      }
    }
  };

  // 여행지 선택 핸들러
  const handleSelectDestination = (opt: { key: string; labelKo: string; labelEn: string }) => {
    setDestination(opt.key);
    setDestinationInput(opt.key === 'all' ? '' : (lang === 'ko' ? opt.labelKo : opt.labelEn));
    setIsDestDropdownOpen(false);
  };

  // 투어 찾기 검색 실행
  const handleSearch = () => {
    const currentLabel = destinationInput.trim() || (
      destination === 'all'
        ? (lang === 'ko' ? '전체 여행지' : 'All Destinations')
        : (destinationOptions.find(o => o.key === destination)?.[lang === 'ko' ? 'labelKo' : 'labelEn'] || destination)
    );

    executeSearch({
      destination: destinationInput.trim() ? destinationInput.trim() : destination,
      destinationLabel: currentLabel,
      date: selectedDate,
      travelers,
    });
  };

  return (
    <div className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[640px] w-full bg-slate-900 z-10 flex flex-col justify-center">
      {/* 배경 이미지 슬라이더 (배경에만 overflow-hidden을 주어 줌 애니메이션을 마스킹하고, 드롭다운이 잘리지 않도록 함) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            } transform transition-transform duration-[7000ms]`}
            style={{
              backgroundImage: `url(${s.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* 은은하고 밝은 그라데이션 오버레이 (배경 사진이 화사하게 보이도록 밝기 대폭 상향) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-black/10" />
      </div>

      {/* 메인 콘텐츠 영역 (모바일/PC 여백 및 폰트 최적화) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col justify-center items-center text-center w-full">
        
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-300/40 text-teal-200 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
          <span>{lang === 'ko' ? slide.tagKo : slide.tagEn}</span>
        </div>

        {/* 메인 헤드라인 문구 (반응형 폰트 크기 및 줄바꿈 최적화) */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-tight max-w-4xl drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] text-balance">
          {lang === 'ko' ? slide.titleKo : slide.titleEn}
        </h1>

        {/* 정갈한 서브 문구 */}
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-base lg:text-lg text-white max-w-2xl font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-balance px-2">
          {lang === 'ko' ? slide.subKo : slide.subEn}
        </p>

        {/* 퀵 서치 바 위젯 (모바일에서는 간결한 카드 스택, PC에서는 가로 1열 정렬) */}
        <div id="hero-search-section" className="mt-6 sm:mt-8 w-full max-w-3xl bg-white/95 backdrop-blur-md p-2.5 sm:p-4 rounded-3xl shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 scroll-mt-24">
          
          {/* 1. 여행지 선택 (드롭다운 & 직접 타이핑) */}
          <div ref={destDropdownRef} className="relative flex-1 flex items-center gap-3 w-full px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200/80">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-left w-full cursor-pointer" onClick={() => setIsDestDropdownOpen((prev) => !prev)}>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ko' ? '여행지' : 'Destination'}
              </span>
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    setDestination(e.target.value || 'all');
                    setIsDestDropdownOpen(true);
                  }}
                  onFocus={() => setIsDestDropdownOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsDestDropdownOpen(false);
                      handleSearch();
                    }
                  }}
                  placeholder={lang === 'ko' ? "어디로 가시나요? (선택/입력)" : "Where to? (Select/type)"}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none truncate placeholder:text-slate-400 placeholder:font-normal"
                />
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDestDropdownOpen ? 'rotate-180 text-teal-600' : ''}`} />
              </div>
            </div>

            {/* 드롭다운 메뉴 팝오버 (모바일에서는 화면 폭에 맞게 자동 반응형 맞춤) */}
            {isDestDropdownOpen && (
              <div
                style={{ bottom: 'calc(100% + 14px)', top: 'auto', backgroundColor: '#ffffff' }}
                className="absolute left-0 w-full sm:w-80 max-w-[calc(100vw-48px)] sm:max-w-none bg-white rounded-3xl shadow-2xl shadow-slate-900/30 border border-slate-200/80 p-2 sm:p-2.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5"
              >
                {/* 상단 타이틀 */}
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1.5">
                  <span>{lang === 'ko' ? '인기 추천 여행지' : 'Popular Destinations'}</span>
                </div>
                <div className="space-y-1">
                  {destinationOptions.map((opt) => {
                    const isSelected = destination === opt.key && !destinationInput;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectDestination(opt)}
                        className={`w-full px-3.5 py-2.5 rounded-2xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 text-teal-900 font-bold ring-1 ring-teal-300'
                            : 'text-slate-800 hover:bg-slate-50 hover:text-teal-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base flex-shrink-0 shadow-inner">
                            {opt.icon}
                          </span>
                          <div className="text-left truncate">
                            <span className="block text-xs font-bold leading-tight truncate text-slate-900">
                              {lang === 'ko' ? opt.labelKo : opt.labelEn}
                            </span>
                            <span className="block text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {lang === 'ko' ? opt.descKo : opt.descEn}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. 일정 선택 (박스 전체 클릭 시 달력 팝업 오픈) */}
          <div
            onClick={handleOpenDatePicker}
            className="flex-1 flex items-center gap-3 w-full px-3.5 py-2.5 border-b sm:border-b-0 sm:border-r border-slate-200/80 cursor-pointer hover:bg-slate-50/80 rounded-2xl transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ko' ? '여행 날짜' : 'Travel Dates'}
              </span>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* 3. 인원 선택 */}
          <div className="flex-1 flex items-center gap-3 w-full px-3.5 py-2.5 cursor-pointer hover:bg-slate-50/80 rounded-2xl transition-all group">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-left w-full">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ko' ? '참여 인원' : 'Travelers'}
              </span>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="1">{lang === 'ko' ? '성인 1명 (나홀로 여행)' : '1 Adult (Solo)'}</option>
                <option value="2">{lang === 'ko' ? '성인 2명 (추천)' : '2 Adults (Recommended)'}</option>
                <option value="3">{lang === 'ko' ? '소그룹 (3~4명)' : 'Group (3~4)'}</option>
                <option value="5">{lang === 'ko' ? '단체 (5명 이상)' : 'Group (5+)'}</option>
              </select>
            </div>
          </div>

          {/* 4. 검색 버튼 (클릭 시 여행 상품 섹션으로 스무스 스크롤 & 필터링) */}
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-teal-600/30 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{lang === 'ko' ? '투어 찾기' : 'Search Tours'}</span>
          </button>
        </div>

      </div>

      {/* 좌우 슬라이드 이동 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur transition hidden sm:block"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur transition hidden sm:block"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 하단 인디케이터 도트 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-teal-400' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
