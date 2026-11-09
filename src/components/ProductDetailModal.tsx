'use client';

import React, { useState } from 'react';
import { useTour } from '@/context/TourContext';
import { useBooking } from '@/context/BookingContext';
import { useReview } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import {
  getTranslatedAgency,
  getTranslatedProductTitle,
  getTranslatedScheduleItem,
  getTranslatedIncluded,
  getTranslatedExcluded,
} from '@/lib/translations';
import {
  X,
  Star,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  CreditCard,
  Video,
  Image as ImageIcon,
  Heart,
  Share2,
  AlertCircle,
  UserCheck,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ZoomIn,
  Award,
  Filter,
  Camera,
  ShieldAlert
} from 'lucide-react';

interface ProductDetailModalProps {
  lang: 'ko' | 'en';
}

export default function ProductDetailModal({ lang }: ProductDetailModalProps) {
  const { selectedProduct, closeProductDetail } = useTour();
  const { openPaymentModal } = useBooking();
  const { user } = useAuth();
  const {
    getProductReviews,
    getProductRatingSummary,
    canUserReviewProduct,
    openReviewModal,
    toggleHelpful,
  } = useReview();

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // 후기 필터 및 정렬, 라이트박스 상태
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'PHOTOS_ONLY'>('ALL');
  const [reviewSort, setReviewSort] = useState<'LATEST' | 'RATING' | 'HELPFUL'>('LATEST');
  const [enlargedPhoto, setEnlargedPhoto] = useState<{ url: string; author: string } | null>(null);
  const [verificationNotice, setVerificationNotice] = useState<{ isOpen: boolean; reason: string } | null>(null);

  // 예약 바 상태
  const [selectedDate, setSelectedDate] = useState('2026-10-25');
  const [travelersCount, setTravelersCount] = useState(2);
  const [isLiked, setIsLiked] = useState(false);

  if (!selectedProduct) return null;

  // 후기 통계 및 목록
  const productReviews = getProductReviews(selectedProduct.id);
  const ratingSummary = getProductRatingSummary(selectedProduct.id);

  // 모든 포토 후기의 사진들을 모은 배열
  const allReviewPhotos = productReviews.flatMap((r) =>
    (r.images || []).map((img) => ({ url: img, author: r.userName, date: r.travelDate }))
  );

  // 필터 및 정렬 적용된 후기 목록
  let displayedReviews = [...productReviews];
  if (reviewFilter === 'PHOTOS_ONLY') {
    displayedReviews = displayedReviews.filter((r) => r.images && r.images.length > 0);
  }

  if (reviewSort === 'RATING') {
    displayedReviews.sort((a, b) => b.rating - a.rating);
  } else if (reviewSort === 'HELPFUL') {
    displayedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
  } else {
    // LATEST
    displayedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const handleWriteReviewClick = () => {
    const check = canUserReviewProduct(selectedProduct.id, user?.email);
    if (check.canReview && check.eligibleBooking) {
      openReviewModal(selectedProduct, check.eligibleBooking);
    } else {
      setVerificationNotice({
        isOpen: true,
        reason: lang === 'en' ? check.reasonEn : check.reasonKo,
      });
    }
  };

  const handleTestBypassReview = () => {
    setVerificationNotice(null);
    openReviewModal(selectedProduct, {
      id: `BK-TEST-${Date.now().toString().slice(-4)}`,
      productId: selectedProduct.id,
      productTitle: lang === 'ko' ? selectedProduct.titleKo : selectedProduct.titleEn,
      productTitleKo: selectedProduct.titleKo,
      productTitleEn: selectedProduct.titleEn,
      productImage: selectedProduct.imageUrl,
      agencyName: selectedProduct.agencyName,
      travelerName: user?.name || (lang === 'en' ? 'Sarah Jenkins' : '김여행'),
      travelerEmail: user?.email || 'traveler@ktriphub.com',
      travelerPhone: '+1-202-555-0192',
      travelDate: '2026-10-10',
      travelersCount: 2,
      paidAmountKrw: selectedProduct.priceKrw * 2,
      paidAmountUsd: selectedProduct.priceUsd * 2,
      paymentMethod: 'CARD_GLOBAL',
      paymentId: 'imp_test_bypass',
      status: 'CONFIRMED',
      createdAt: '2026-10-01',
      hasReviewed: false,
    });
  };

  const totalPriceKrw = selectedProduct.priceKrw * travelersCount;
  const totalPriceUsd = selectedProduct.priceUsd * travelersCount;

  // 일정 및 포함/불포함 항목 (다국어 지원)
  const scheduleItems = (lang === 'en' && selectedProduct.scheduleEn && selectedProduct.scheduleEn.length > 0)
    ? selectedProduct.scheduleEn
    : (selectedProduct.schedule || []);

  const includedItems = (lang === 'en' && selectedProduct.includedEn && selectedProduct.includedEn.length > 0)
    ? selectedProduct.includedEn
    : (selectedProduct.included || []);

  const excludedItems = (lang === 'en' && selectedProduct.excludedEn && selectedProduct.excludedEn.length > 0)
    ? selectedProduct.excludedEn
    : (selectedProduct.excluded || []);

  const handleBookingSubmit = () => {
    openPaymentModal(selectedProduct, selectedDate, travelersCount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[94vh]">
        
        {/* 모달 상단 닫기 헤더 바 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs font-bold">
              {selectedProduct.category.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 font-semibold">
              {getTranslatedAgency(selectedProduct.agencyName, lang)}
            </span>
            {selectedProduct.agencyVerified && (
              <span className="flex items-center text-teal-600 text-[11px] font-bold gap-0.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Verified Agency' : '인증 여행사'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={closeProductDetail}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 본문 스크롤 컨테이너 */}
        <div className="flex-1 overflow-y-auto">
          
          {/* 1. 상단 미디어 갤러리 & 비디오 플레이어 영역 */}
          <div className="bg-slate-900 text-white relative">
            {/* 미디어 모드 탭 (사진 갤러리 vs 동영상) */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition ${
                  activeMediaTab === 'photos'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-black/50 text-gray-300 hover:bg-black/70'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en' ? `Photo Gallery (${selectedProduct.images.length})` : `사진 갤러리 (${selectedProduct.images.length})`}
                </span>
              </button>

              {selectedProduct.hasVideo && (
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition ${
                    activeMediaTab === 'video'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-black/50 text-gray-300 hover:bg-black/70'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-red-400" />
                  <span>{lang === 'en' ? 'Watch Tour Video' : '동영상 투어 보기'}</span>
                </button>
              )}
            </div>

            {/* A. 사진 갤러리 뷰 */}
            {activeMediaTab === 'photos' && (
              <div className="relative h-72 sm:h-96 w-full overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={selectedProduct.images[currentPhotoIdx] || selectedProduct.imageUrl}
                  alt={lang === 'ko' ? selectedProduct.titleKo : selectedProduct.titleEn}
                  className="w-full h-full object-cover sm:object-contain transition-all duration-300"
                />

                {/* 하단 썸네일 바 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/60 backdrop-blur-md rounded-2xl">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIdx(idx)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition ${
                        currentPhotoIdx === idx ? 'border-teal-400 scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* B. 동영상 플레이어 뷰 */}
            {activeMediaTab === 'video' && (
              <div className="relative h-72 sm:h-96 w-full bg-black flex items-center justify-center">
                {selectedProduct.videoUrl ? (
                  <iframe
                    src={selectedProduct.videoUrl}
                    title="Tour Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-6 text-gray-400">
                    <Video className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-semibold">
                      {lang === 'en' ? 'Tour preview video is coming soon.' : '등록된 미리보기 동영상이 준비 중입니다.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. 본문 및 우측 고정 예약 바 그리드 */}
          <div className="max-w-6xl mx-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* 좌측 상세 설명 영역 (2 컬럼) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* 상품 타이틀 및 핵심 뱃지 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-sm text-gray-900">{ratingSummary.averageRating}</span>
                    <span className="text-xs text-gray-400">
                      {lang === 'en' ? `(${ratingSummary.totalReviews} reviews)` : `(${ratingSummary.totalReviews}개 후기)`}
                    </span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{lang === 'en' ? selectedProduct.durationEn : selectedProduct.durationKo}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {lang === 'en' ? `${selectedProduct.minPeople} ~ ${selectedProduct.maxPeople} Guests` : `${selectedProduct.minPeople}인 ~ ${selectedProduct.maxPeople}인`}
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {lang === 'ko' ? selectedProduct.titleKo : selectedProduct.titleEn}
                </h1>

                {/* 타깃 안내 뱃지 */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-lg border border-teal-200">
                    {selectedProduct.targetAudience === 'foreign'
                      ? (lang === 'en' ? '🌏 Foreign Tourists (ENG Guide)' : '🌏 방한 외국인 전용 (ENG Guide)')
                      : selectedProduct.targetAudience === 'domestic'
                      ? (lang === 'en' ? '🇰🇷 Domestic Korean Travelers' : '🇰🇷 내국인 맞춤 여행')
                      : (lang === 'en' ? '🌏 Global & Domestic Travelers' : '🌏 내국인 & 외국인 모두 환영')}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                    {lang === 'en' ? '✓ 100% Free cancel up to 3 days prior' : '✓ 3일 전 100% 무료 취소'}
                  </span>
                </div>
              </div>

              {/* 상품 소개 글 */}
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {lang === 'ko' ? '여행 상품 소개' : 'About this tour'}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {lang === 'ko'
                    ? selectedProduct.descriptionKo || '전문 여행사가 안내하는 한국의 대표적인 힐링 명소 투어입니다.'
                    : selectedProduct.descriptionEn || 'Authentic tour curated by verified Korean travel experts.'}
                </p>
              </div>

              {/* 타임라인 상세 일정 안내 */}
              {scheduleItems && scheduleItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    <span>{lang === 'ko' ? '상세 여행 코스 및 일정표' : 'Detailed Itinerary'}</span>
                  </h3>

                  <div className="relative pl-6 border-l-2 border-teal-200 space-y-6">
                    {scheduleItems.map((item, idx) => {
                      const translated = getTranslatedScheduleItem(item, lang);
                      return (
                        <div key={idx} className="relative">
                          {/* 타임라인 원형 닷 */}
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-600 border-4 border-white shadow-sm" />
                          <div className="text-xs font-bold text-teal-700">{translated.time}</div>
                          <h4 className="text-sm font-extrabold text-gray-900 mt-0.5">{translated.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{translated.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 포함 및 불포함 사항 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'en' ? "What's Included" : '포함 사항'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                    {includedItems.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{getTranslatedIncluded(inc, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-rose-50/60 rounded-2xl border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{lang === 'en' ? "What's Excluded" : '불포함 사항'}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-rose-950 font-medium">
                    {excludedItems.map((exc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{getTranslatedExcluded(exc, lang)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 필수 취소 및 환불 정책 박스 */}
              <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>{lang === 'en' ? 'K-TripHub Booking & Refund Policy' : 'K-TripHub 안심 취소 및 환불 정책 규정'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-emerald-700 font-bold block mb-1">
                      {lang === 'en' ? '3+ Days Prior' : '여행 3일 전 취소'}
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      {lang === 'en' ? '100% Full Refund' : '100% 전액 환불'}
                    </span>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {lang === 'en' ? 'Zero penalty fee, full refund' : '위약금 없이 결제액 전액 취소'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-amber-700 font-bold block mb-1">
                      {lang === 'en' ? '2 to 1 Days Prior' : '여행 2일 ~ 1일 전'}
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      {lang === 'en' ? '50% Partial Refund' : '50% 부분 환불'}
                    </span>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {lang === 'en' ? '50% prep deduction' : '여행사 준비금 50% 공제'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-rose-700 font-bold block mb-1">
                      {lang === 'en' ? 'Day of Travel' : '당일 취소 및 노쇼'}
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      {lang === 'en' ? 'Non-refundable (0%)' : '환불 불가 (0%)'}
                    </span>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {lang === 'en' ? 'Non-refundable policy' : '예약 확정 손실 보호'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* 5단계: 관광객 생생 후기 (리뷰) 종합 섹션 */}
              {/* ================================================================= */}
              <div id="tour-reviews-section" className="pt-8 border-t border-gray-200 space-y-6">
                
                {/* 섹션 상단 타이틀 & 후기 작성 CTA 버튼 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>{lang === 'en' ? 'Verified Reviews' : '실결제 인증 후기'}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {lang === 'en' ? 'Traveler Ratings & Photo Reviews' : '여행자 전체 평점 및 포토 후기'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {lang === 'en'
                        ? 'Authentic experiences shared exclusively by travelers who booked and completed this tour.'
                        : '실제 예약 결제 및 여행 일정을 완료한 관광객만 작성할 수 있는 100% 신뢰 후기입니다.'}
                    </p>
                  </div>

                  <button
                    onClick={handleWriteReviewClick}
                    className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Write a Review' : '여행 후기 작성하기'}</span>
                  </button>
                </div>

                {/* A. 벤토 그리드 전체 평점 요약 카드 */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  
                  {/* 1. 평균 점수와 별점 */}
                  <div className="text-center md:text-left space-y-2 md:border-r md:border-slate-800 md:pr-6">
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                        {ratingSummary.averageRating}
                      </span>
                      <span className="text-sm text-slate-400 font-semibold">/ 5.0</span>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${
                            s <= Math.round(ratingSummary.averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-700 text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {lang === 'en'
                        ? `Based on ${ratingSummary.totalReviews} verified reviews`
                        : `총 ${ratingSummary.totalReviews}개의 실결제 후기 기준`}
                    </p>

                    {ratingSummary.photoReviewCount > 0 && (
                      <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30">
                        📷 {lang === 'en' ? `${ratingSummary.photoReviewCount} Photo Reviews` : `포토 후기 ${ratingSummary.photoReviewCount}개`}
                      </span>
                    )}
                  </div>

                  {/* 2. 5점~1점 분포 프로그레스 바 */}
                  <div className="space-y-1.5 text-xs">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingSummary.distribution[star] || 0;
                      const pct = ratingSummary.totalReviews > 0 ? (count / ratingSummary.totalReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-8 font-bold text-slate-300 flex items-center gap-0.5">
                            <span>{star}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right font-mono text-[11px] text-slate-400">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3. 안심 에스크로 & 100% 실결제 보증 뱃지 */}
                  <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-teal-300 font-extrabold text-[13px]">
                      <Award className="w-4 h-4 text-teal-400" />
                      <span>{lang === 'en' ? 'Quality Verified' : 'K-TripHub 인증'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {lang === 'en'
                        ? '✓ 100% Genuine reviews from verified tourists only'
                        : '✓ 실제 여행을 완료한 관광객만 작성 가능한 검증 시스템'}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'en'
                        ? '✓ Zero fake or commercial marketing reviews'
                        : '✓ 조작 및 허위 광고성 후기 24시간 원천 차단'}
                    </p>
                  </div>

                </div>

                {/* B. 포토 후기 모아보기 갤러리 스트립 */}
                {allReviewPhotos.length > 0 && (
                  <div className="space-y-3 p-5 bg-teal-50/50 rounded-2xl border border-teal-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5 uppercase tracking-wider">
                        <Camera className="w-4 h-4 text-teal-600" />
                        <span>
                          {lang === 'en'
                            ? `Traveler Photo Highlights (${allReviewPhotos.length})`
                            : `여행자 포토 갤러리 모아보기 (${allReviewPhotos.length}장)`}
                        </span>
                      </h4>
                      <span className="text-[11px] text-teal-700 font-medium">
                        {lang === 'en' ? 'Click to enlarge' : '사진을 누르면 크게 볼 수 있습니다'}
                      </span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {allReviewPhotos.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEnlargedPhoto({ url: item.url, author: item.author })}
                          className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-teal-500 shadow-sm transition group"
                        >
                          <img
                            src={item.url}
                            alt="Traveler photo"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                            <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition transform scale-75 group-hover:scale-100" />
                          </div>
                          <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                            {item.author}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* C. 필터 및 정렬 바 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewFilter('ALL')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                        reviewFilter === 'ALL'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lang === 'en' ? `All Reviews (${productReviews.length})` : `전체 후기 (${productReviews.length})`}
                    </button>

                    <button
                      onClick={() => setReviewFilter('PHOTOS_ONLY')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                        reviewFilter === 'PHOTOS_ONLY'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? `Photo Reviews Only (${ratingSummary.photoReviewCount})` : `포토 후기만 (${ratingSummary.photoReviewCount})`}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <select
                      value={reviewSort}
                      onChange={(e: any) => setReviewSort(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="LATEST">{lang === 'en' ? 'Latest First' : '최신순'}</option>
                      <option value="RATING">{lang === 'en' ? 'Highest Rating' : '별점 높은순'}</option>
                      <option value="HELPFUL">{lang === 'en' ? 'Most Helpful' : '추천순'}</option>
                    </select>
                  </div>
                </div>

                {/* D. 후기 목록 카드 렌더링 */}
                <div className="space-y-4">
                  {displayedReviews.length === 0 ? (
                    <div className="p-10 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                      <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-sm font-bold text-gray-600">
                        {lang === 'en' ? 'No reviews matching this filter.' : '선택한 조건의 후기가 없습니다.'}
                      </p>
                      <button
                        onClick={handleWriteReviewClick}
                        className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700 transition"
                      >
                        {lang === 'en' ? 'Be the first to review!' : '첫 번째 후기를 남겨보세요!'}
                      </button>
                    </div>
                  ) : (
                    displayedReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200 transition hover:border-teal-300 space-y-3 shadow-sm"
                      >
                        {/* 상단 작성자 정보 & 별점 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {rev.userAvatar ? (
                              <img
                                src={rev.userAvatar}
                                alt={rev.userName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                                {rev.userName.slice(0, 1).toUpperCase()}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-gray-900">{rev.userName}</span>
                                {rev.userCountry && (
                                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md text-[11px] font-bold">
                                    {rev.userCountry}
                                  </span>
                                )}
                                {rev.isVerifiedPurchase && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    <span>{lang === 'en' ? 'Verified Traveler' : '실결제 인증'}</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>{lang === 'en' ? `Traveled on ${rev.travelDate}` : `${rev.travelDate} 방문`}</span>
                                <span>•</span>
                                <span>{rev.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          {/* 별점 */}
                          <div className="flex items-center gap-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                            <span className="font-bold text-xs text-gray-700 ml-1">{rev.rating}.0</span>
                          </div>
                        </div>

                        {/* 후기 제목 (있을 경우) */}
                        {rev.title && (
                          <h5 className="font-extrabold text-sm sm:text-base text-gray-900 pt-1">
                            {rev.title}
                          </h5>
                        )}

                        {/* 후기 본문 내용 */}
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {rev.content}
                        </p>

                        {/* 여행 사진 썸네일 그리드 (최대 3장) */}
                        {rev.images && rev.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2.5 pt-1 max-w-md">
                            {rev.images.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setEnlargedPhoto({ url: img, author: rev.userName })}
                                className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group hover:border-teal-500 shadow-sm transition"
                              >
                                <img
                                  src={img}
                                  alt={`Review photo ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                  <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition" />
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* 하단 도움이 돼요 버튼 */}
                        <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                          <button
                            type="button"
                            onClick={() => toggleHelpful(rev.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-teal-300 hover:text-teal-700 hover:bg-white transition bg-white text-[11px] font-semibold shadow-xs"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-teal-600" />
                            <span>
                              {lang === 'en' ? `Helpful (${rev.helpfulCount})` : `도움이 돼요 (${rev.helpfulCount})`}
                            </span>
                          </button>

                          <span className="font-mono text-[10px] text-gray-400">
                            #{rev.bookingId || rev.id}
                          </span>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

            {/* 우측 고정 예약 바 (Sticky Booking Box) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white p-6 rounded-3xl border border-gray-200 shadow-xl space-y-6">
                
                {/* 1인 가격 헤더 */}
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-xs text-gray-400 block font-medium">
                    {lang === 'en' ? 'Price per Person' : '1인 기준 가격'}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl font-black text-teal-700">
                      {lang === 'ko'
                        ? `${selectedProduct.priceKrw.toLocaleString()}원`
                        : `$${selectedProduct.priceUsd}`}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      {lang === 'ko' ? `약 $${selectedProduct.priceUsd}` : `${selectedProduct.priceKrw.toLocaleString()} KRW`}
                    </span>
                  </div>
                </div>

                {/* 여행 날짜 선택 */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>{lang === 'en' ? 'Travel Date' : '여행 희망 날짜'}</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>

                {/* 참여 인원수 선택 (+ / -) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{lang === 'en' ? 'Number of Guests' : '참여 인원수'}</span>
                  </label>
                  <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTravelersCount((prev) => Math.max(selectedProduct.minPeople, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-sm text-gray-900">
                      {lang === 'en' ? `${travelersCount} Guest(s)` : `${travelersCount} 명`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelersCount((prev) => Math.min(selectedProduct.maxPeople, prev + 1))}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 block text-right">
                    {lang === 'en'
                      ? `Min ${selectedProduct.minPeople} ~ Max ${selectedProduct.maxPeople} Guests`
                      : `최소 ${selectedProduct.minPeople}인 ~ 최대 ${selectedProduct.maxPeople}인`}
                  </span>
                </div>

                {/* 실시간 총 결제금액 계산 요약 */}
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {lang === 'en'
                        ? `$${selectedProduct.priceUsd} × ${travelersCount} guest(s)`
                        : `${selectedProduct.priceKrw.toLocaleString()}원 × ${travelersCount}명`}
                    </span>
                    <span>
                      {lang === 'en' ? `$${totalPriceUsd}` : `${totalPriceKrw.toLocaleString()}원`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{lang === 'en' ? 'Booking Fee' : '예약 수수료'}</span>
                    <span className="text-teal-700 font-bold">
                      {lang === 'en' ? 'Free ($0)' : '무료 (0원)'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-teal-200/60 flex justify-between items-baseline">
                    <span className="font-extrabold text-gray-900 text-sm">
                      {lang === 'en' ? 'Total Price' : '최종 결제 금액'}
                    </span>
                    <span className="text-xl font-black text-teal-800">
                      {lang === 'ko' ? `${totalPriceKrw.toLocaleString()}원` : `$${totalPriceUsd}`}
                    </span>
                  </div>
                </div>

                {/* 예약 및 카드 결제하기 액션 버튼 */}
                <button
                  onClick={handleBookingSubmit}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/30 transition text-sm flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'ko' ? '예약 및 카드 결제하기' : 'Book & Pay Now'}</span>
                </button>

                <div className="text-center text-[11px] text-gray-400">
                  {lang === 'en'
                    ? '⚡ 100% Full refund if cancelled 3+ days prior'
                    : '⚡ 3일 전까지 취소 시 100% 전액 환불 보장'}
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ================================================================= */}
        {/* A. 포토 후기 크게 보기 (Lightbox Modal) */}
        {/* ================================================================= */}
        {enlargedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
            onClick={() => setEnlargedPhoto(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 bg-black/60 text-white rounded-full text-xs font-bold backdrop-blur-md border border-white/20">
                  Photo by {enlargedPhoto.author}
                </span>
                <button
                  onClick={() => setEnlargedPhoto(null)}
                  className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img
                src={enlargedPhoto.url}
                alt="Enlarged photo"
                className="w-full h-full max-h-[85vh] object-contain"
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* B. 실결제 여행객 검증 안내 팝업 (Verification Notice) */}
        {/* ================================================================= */}
        {verificationNotice && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
            onClick={() => setVerificationNotice(null)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8 text-amber-600" />
              </div>

              <div className="text-center space-y-2">
                <h4 className="text-lg font-black text-gray-900 tracking-tight">
                  {lang === 'en' ? 'Verified Travelers Only' : '실결제 여행객 검증 안내'}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {verificationNotice.reason}
                </p>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-left text-[11px] text-teal-900 space-y-1">
                  <span className="font-bold block text-teal-800">
                    💡 {lang === 'en' ? 'Review Submission Criteria:' : 'K-TripHub 후기 작성 자격 조건:'}
                  </span>
                  <p>1. {lang === 'en' ? 'Confirmed booking and payment' : '해당 상품 결제 완료(Confirmed)'}</p>
                  <p>2. {lang === 'en' ? 'Tour departure date must be in the past (Completed)' : '여행 예정일이 지난 투어 완료 시점'}</p>
                  <p>3. {lang === 'en' ? '1 review per completed booking' : '예약 1건당 1회의 솔직한 후기 작성'}</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleTestBypassReview}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {lang === 'en'
                      ? '🧪 Test Write Review with Simulated Completed Tour'
                      : '🧪 테스트용: 완료된 예약으로 후기 작성 체험해보기'}
                  </span>
                </button>

                <button
                  onClick={() => setVerificationNotice(null)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
                >
                  {lang === 'en' ? 'Close' : '확인 및 닫기'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
