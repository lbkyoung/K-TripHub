'use client';

import React, { useState } from 'react';
import { Star, Video, ShieldCheck, Heart, Clock, UserCheck, Search, RotateCcw, Compass } from 'lucide-react';
import { useTour } from '@/context/TourContext';
import { getTranslatedAgency } from '@/lib/translations';

interface ProductSectionProps {
  lang: 'ko' | 'en';
}

export default function ProductSection({ lang }: ProductSectionProps) {
  const { products, openProductDetail, searchFilter, setSearchFilter, resetSearch } = useTour();
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { key: 'all', labelKo: '전체 상품', labelEn: 'All Tours', icon: '🌟' },
    { key: 'seoul', labelKo: '서울 / 수도권', labelEn: 'Seoul & Metro', icon: '🏙️' },
    { key: 'jeju', labelKo: '제주도', labelEn: 'Jeju Island', icon: '🌴' },
    { key: 'busan', labelKo: '부산 / 바다', labelEn: 'Busan Coast', icon: '🌊' },
    { key: 'culture', labelKo: '역사 / 힐링', labelEn: 'Culture & Nature', icon: '🏛️' },
  ];

  // 현재 필터링 상태 분석
  const query = (searchFilter.destination || 'all').trim().toLowerCase();
  const isPresetCategory = ['all', 'seoul', 'jeju', 'busan', 'culture'].includes(query);

  const activeCategoryKey = isPresetCategory ? query : 'all';

  // 검색어 및 카테고리에 따른 상품 필터링
  const filteredProducts = products.filter((p) => {
    if (query === 'all' || query === '') return true;

    if (isPresetCategory) {
      return p.category === query;
    }

    // 자유 키워드 검색 (제목, 설명, 카테고리, 여행사, 포함사항 등)
    const matchTitleKo = p.titleKo.toLowerCase().includes(query);
    const matchTitleEn = p.titleEn.toLowerCase().includes(query);
    const matchDescKo = p.descriptionKo.toLowerCase().includes(query);
    const matchDescEn = p.descriptionEn.toLowerCase().includes(query);
    const matchAgency = p.agencyName.toLowerCase().includes(query);
    const matchCategory = p.category.toLowerCase().includes(query);
    const matchIncluded = p.included.some((item) => item.toLowerCase().includes(query));

    return matchTitleKo || matchTitleEn || matchDescKo || matchDescEn || matchAgency || matchCategory || matchIncluded;
  });

  const handleCategoryClick = (catKey: string) => {
    const selectedCat = categories.find((c) => c.key === catKey);
    setSearchFilter((prev) => ({
      ...prev,
      destination: catKey,
      destinationLabel: catKey === 'all' ? '' : (lang === 'ko' ? selectedCat?.labelKo : selectedCat?.labelEn) || '',
    }));
  };

  const isSearchActive = searchFilter.destination !== 'all' || (searchFilter.destinationLabel && searchFilter.destinationLabel !== '');

  const getTravelersText = (trav: string) => {
    if (trav === '1') return lang === 'ko' ? '성인 1명' : '1 Adult';
    if (trav === '2') return lang === 'ko' ? '성인 2명' : '2 Adults';
    if (trav === '3') return lang === 'ko' ? '소그룹 (3~4명)' : 'Group (3~4)';
    return lang === 'ko' ? '단체 (5명 이상)' : 'Group (5+)';
  };

  return (
    <section id="tours-section" className="py-12 sm:py-16 bg-slate-50 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 (모바일/PC 레이아웃) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-teal-600 font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
              {lang === 'ko' ? '인증된 전문 여행사 상품' : 'Verified Travel Agencies'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              {lang === 'ko' ? '놓치면 아쉬운 추천 여행 상품' : 'Recommended Tours & Activities'}
            </h2>
            <p className="mt-2 text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {lang === 'ko'
                ? '내국인과 방한 외국인이 모두 만족한 평점 4.7 이상의 검증된 로컬 여행 상품입니다. (카드를 누르면 상세 일정을 볼 수 있습니다)'
                : 'Highly-rated tours curated for both domestic & international travelers in Korea. (Click card to view details)'}
            </p>
          </div>

          {/* 카테고리 필터 탭 (모바일에서는 시원한 풀 스크롤, PC에서는 정갈한 탭) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => {
              const isActive = activeCategoryKey === cat.key && isPresetCategory;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                      : 'bg-white text-gray-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-sm'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{lang === 'ko' ? cat.labelKo : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🔍 활성 검색 필터 배너 (검색 실행 시 나타남) */}
        {isSearchActive && (
          <div className="mb-8 p-4 bg-teal-50/80 border border-teal-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-teal-900 font-medium">
              <Search className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>
                {lang === 'ko' ? (
                  <>
                    <strong className="font-bold text-teal-950">"{searchFilter.destinationLabel || searchFilter.destination}"</strong> 검색 결과
                    <span className="text-gray-500 font-normal"> · 여행 날짜: </span>
                    <strong className="font-semibold text-teal-900">{searchFilter.date}</strong>
                    <span className="text-gray-500 font-normal"> · 인원: </span>
                    <strong className="font-semibold text-teal-900">{getTravelersText(searchFilter.travelers)}</strong>
                  </>
                ) : (
                  <>
                    Results for <strong className="font-bold text-teal-950">"{searchFilter.destinationLabel || searchFilter.destination}"</strong>
                    <span className="text-gray-500 font-normal"> · Date: </span>
                    <strong className="font-semibold text-teal-900">{searchFilter.date}</strong>
                    <span className="text-gray-500 font-normal"> · Travelers: </span>
                    <strong className="font-semibold text-teal-900">{getTravelersText(searchFilter.travelers)}</strong>
                  </>
                )}
              </span>
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-600 text-white shadow-sm">
                {filteredProducts.length}{lang === 'ko' ? '건' : ' tours'}
              </span>
            </div>

            <button
              onClick={resetSearch}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? '검색 필터 초기화' : 'Reset Filter'}</span>
            </button>
          </div>
        )}

        {/* 여행 상품 카드 그리드 (모바일에서는 gap-5, PC에서는 gap-8 최적화) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filteredProducts.map((product) => {
              const isLiked = likedIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => openProductDetail(product)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-950/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
                >
                  {/* 썸네일 이미지 및 뱃지 */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={lang === 'ko' ? product.titleKo : product.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* 상단 뱃지 그룹 */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
                      {product.hasVideo && (
                        <div className="bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
                          <Video className="w-3.5 h-3.5 text-rose-400" />
                          <span>{lang === 'ko' ? '영상 포함' : 'Video Tour'}</span>
                        </div>
                      )}
                      {product.targetAudience === 'foreign' && (
                        <div className="bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          ENG/Global
                        </div>
                      )}
                    </div>

                    {/* 찜하기(좋아요) 하트 버튼 */}
                    <button
                      onClick={(e) => toggleLike(product.id, e)}
                      className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 hover:text-rose-500 transition-all active:scale-75 shadow-md"
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* 환불 안심 뱃지 (3일 전 100% 환불 강조) */}
                    <div className="absolute bottom-3.5 left-3.5 bg-emerald-800/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-400/20 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{lang === 'ko' ? '3일 전 100% 무료 취소' : 'Free Cancel 3-Days Prior'}</span>
                    </div>
                  </div>

                  {/* 카드 본문 콘텐츠 */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* 여행사 정보 & 소요시간 */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span>{getTranslatedAgency(product.agencyName, lang)}</span>
                          {product.agencyVerified && (
                            <span title={lang === 'ko' ? "인증된 여행사" : "Verified Agency"}>
                              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>{lang === 'ko' ? product.durationKo : product.durationEn}</span>
                        </div>
                      </div>

                      {/* 상품 제목 */}
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {lang === 'ko' ? product.titleKo : product.titleEn}
                      </h3>
                    </div>

                    {/* 하단 평점 및 가격 (정가 취소선 및 15% 얼리버드 할인율 뱃지 추가) */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
                      {/* 별점 & 후기 개수 */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-black text-sm text-slate-900">{product.rating}</span>
                          <span className="text-xs text-slate-400 font-medium">({product.reviewCount})</span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {lang === 'ko' ? `최대 ${product.maxPeople}명 정원` : `Max ${product.maxPeople} Guests`}
                        </span>
                      </div>

                      {/* 1인당 가격 및 할인 표기 */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 mb-0.5">
                          <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            15% OFF
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {lang === 'ko'
                              ? `${Math.round(product.priceKrw * 1.18 / 1000 * 1000).toLocaleString()}원`
                              : `$${Math.round(product.priceUsd * 1.18)}`}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-end gap-0.5">
                          <span className="text-xl font-black text-teal-700 tracking-tight">
                            {lang === 'ko'
                              ? product.priceKrw.toLocaleString()
                              : `$${product.priceUsd}`}
                          </span>
                          {lang === 'ko' && <span className="text-xs font-bold text-teal-900">원</span>}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* 검색 결과 없음 Empty State */
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {lang === 'ko' ? '검색 조건과 일치하는 여행 상품이 없습니다' : 'No Tour Products Found'}
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              {lang === 'ko'
                ? `"${searchFilter.destinationLabel || searchFilter.destination}"에 대한 검색 결과가 없습니다. 다른 여행지나 키워드로 찾아보세요.`
                : `No tours matched "${searchFilter.destinationLabel || searchFilter.destination}". Try searching with a different destination or keyword.`}
            </p>
            <button
              onClick={resetSearch}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-teal-600/20 cursor-pointer"
            >
              {lang === 'ko' ? '모든 여행 상품 보기' : 'View All Tours'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
