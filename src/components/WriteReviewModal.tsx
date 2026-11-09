'use client';

import React, { useState, useEffect } from 'react';
import { useReview } from '@/context/ReviewContext';
import { useAuth } from '@/context/AuthContext';
import { getTranslatedProductTitle } from '@/lib/translations';
import {
  X,
  Star,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Upload
} from 'lucide-react';

interface WriteReviewModalProps {
  lang: 'ko' | 'en';
}

const SAMPLE_DEMO_PHOTOS = [
  {
    nameKo: '경복궁 한복',
    nameEn: 'Gyeongbokgung Hanbok',
    url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameKo: '북촌 전통 기와',
    nameEn: 'Bukchon Hanok',
    url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameKo: '제주 에메랄드 해안',
    nameEn: 'Jeju Coast',
    url: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameKo: '해운대 밤바다 요트',
    nameEn: 'Busan Yacht Night',
    url: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
  },
];

const COUNTRY_OPTIONS = [
  { code: 'KR', label: '🇰🇷 대한민국 (Korea)', value: '🇰🇷 Korea' },
  { code: 'US', label: '🇺🇸 미국 (USA)', value: '🇺🇸 USA' },
  { code: 'JP', label: '🇯🇵 일본 (Japan)', value: '🇯🇵 Japan' },
  { code: 'GB', label: '🇬🇧 영국 (UK)', value: '🇬🇧 UK' },
  { code: 'FR', label: '🇫🇷 프랑스 (France)', value: '🇫🇷 France' },
  { code: 'CA', label: '🇨🇦 캐나다 (Canada)', value: '🇨🇦 Canada' },
  { code: 'DE', label: '🇩🇪 독일 (Germany)', value: '🇩🇪 Germany' },
  { code: 'SG', label: '🇸🇬 싱가포르 (Singapore)', value: '🇸🇬 Singapore' },
];

export default function WriteReviewModal({ lang }: WriteReviewModalProps) {
  const { isReviewModalOpen, closeReviewModal, reviewTargetProduct, reviewTargetBooking, addReview } = useReview();
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [userCountry, setUserCountry] = useState('🇺🇸 USA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isReviewModalOpen) {
      setRating(5);
      setHoverRating(0);
      setTitle('');
      setContent('');
      setSelectedPhotos([]);
      setValidationError(null);
      setIsSubmitting(false);

      if (lang === 'ko') {
        setUserCountry('🇰🇷 Korea');
      } else {
        setUserCountry('🇺🇸 USA');
      }
    }
  }, [isReviewModalOpen, lang]);

  if (!isReviewModalOpen || !reviewTargetProduct) return null;

  const t = {
    ko: {
      modalHeader: "여행 후기(리뷰) 작성",
      verifiedTag: "실결제 및 여행 완료 인증 바우처",
      verifiedDesc: "실제 여행을 완료하신 관광객의 솔직한 후기는 다른 여행자에게 큰 힘이 됩니다.",
      bookingNo: "예약 번호",
      travelDate: "다녀온 날짜",
      ratingLabel: "이 투어는 어떠셨나요? (별점을 선택해주세요)",
      rating5: "★★★★★ 5점 - 인생 최고의 투어였어요! 적극 추천합니다.",
      rating4: "★★★★☆ 4점 - 전반적으로 만족스럽고 즐거웠어요.",
      rating3: "★★★☆☆ 3점 - 보통이었어요. 무난합니다.",
      rating2: "★★☆☆☆ 2점 - 아쉬운 부분이 있었어요.",
      rating1: "★☆☆☆☆ 1점 - 기대에 못 미쳐 실망스러웠어요.",
      titleLabel: "후기 한 줄 요약 (선택)",
      titlePlaceholder: "예: 경복궁 한복 투어 정말 최고였습니다!",
      contentLabel: "상세 후기 내용 (필수)",
      contentPlaceholder: "투어 코스, 가이드 해설, 이동 편의, 포토존, 다도 체험 등 다른 여행자들에게 도움이 될 생생한 경험을 최소 10자 이상 남겨주세요.",
      charCount: (len: number) => `${len} / 최소 10자`,
      photosLabel: "여행 사진 첨부 (최대 3장)",
      photosCount: (count: number) => `(현재 ${count} / 3장 첨부됨)`,
      photosSub: "직접 찍으신 여행 사진을 최대 3장까지 올려주세요. (JPG, PNG)",
      quickPhotosTitle: "📸 원클릭 데모 사진 넣기 (테스트 편의 기능):",
      nationalityLabel: "여행자 국적 / 언어권",
      nameLabel: "작성자명",
      submitBtn: "여행 후기 등록하기",
      submitting: "등록 처리 중...",
      cancelBtn: "취소",
      errRating: "별점을 1점 이상 선택해주세요.",
      errContent: "후기 내용을 최소 10자 이상 작성해주세요.",
      errMaxPhotos: "사진은 최대 3장까지만 첨부할 수 있습니다.",
      successAlert: "🎉 여행 후기가 성공적으로 등록되었습니다!\n소중한 여행 경험을 공유해주셔서 대단히 감사합니다.",
    },
    en: {
      modalHeader: "Write Verified Tour Review",
      verifiedTag: "Verified Booking & Completed Tour Voucher",
      verifiedDesc: "Authentic reviews from travelers who completed this tour empower our global community.",
      bookingNo: "Booking ID",
      travelDate: "Date of Travel",
      ratingLabel: "How was your tour? (Select Star Rating)",
      rating5: "★★★★★ 5 Stars - Exceptional! Highly recommended.",
      rating4: "★★★★☆ 4 Stars - Great experience, very satisfied.",
      rating3: "★★★☆☆ 3 Stars - Average, standard tour.",
      rating2: "★★☆☆☆ 2 Stars - Below expectations.",
      rating1: "★☆☆☆☆ 1 Star - Disappointing.",
      titleLabel: "Review Headline (Optional)",
      titlePlaceholder: "e.g. Unforgettable Hanbok Tour in Seoul!",
      contentLabel: "Detailed Review (Required)",
      contentPlaceholder: "Share details about the tour itinerary, docent guide, photo spots, and tips for future travelers (at least 10 characters).",
      charCount: (len: number) => `${len} / min 10 chars`,
      photosLabel: "Attach Travel Photos (Up to 3 Photos)",
      photosCount: (count: number) => `(${count} of 3 photos selected)`,
      photosSub: "Upload photos taken during your trip. Up to 3 photos (JPG, PNG).",
      quickPhotosTitle: "📸 1-Click Demo Photos (For Quick Testing):",
      nationalityLabel: "Traveler Nationality / Origin",
      nameLabel: "Reviewer Name",
      submitBtn: "Submit Verified Review",
      submitting: "Submitting Review...",
      cancelBtn: "Cancel",
      errRating: "Please select a star rating (1 to 5).",
      errContent: "Please write at least 10 characters in your review.",
      errMaxPhotos: "You can attach a maximum of 3 photos.",
      successAlert: "🎉 Thank you! Your review has been submitted and verified successfully.",
    }
  }[lang];

  // 별점 텍스트 안내
  const getRatingText = (stars: number) => {
    switch (stars) {
      case 5: return t.rating5;
      case 4: return t.rating4;
      case 3: return t.rating3;
      case 2: return t.rating2;
      case 1: return t.rating1;
      default: return '';
    }
  };

  // 로컬 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedPhotos.length + files.length > 3) {
      alert(t.errMaxPhotos);
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhotos((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, reader.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // 빠른 데모 사진 추가
  const handleAddDemoPhoto = (url: string) => {
    if (selectedPhotos.includes(url)) return;
    if (selectedPhotos.length >= 3) {
      alert(t.errMaxPhotos);
      return;
    }
    setSelectedPhotos((prev) => [...prev, url]);
  };

  // 사진 삭제
  const handleRemovePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 후기 등록 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (rating < 1 || rating > 5) {
      setValidationError(t.errRating);
      return;
    }

    if (content.trim().length < 10) {
      setValidationError(t.errContent);
      return;
    }

    if (selectedPhotos.length > 3) {
      setValidationError(t.errMaxPhotos);
      return;
    }

    setIsSubmitting(true);

    try {
      const authorName = user?.name || (lang === 'en' ? 'Sarah Jenkins' : '김여행');
      const travelDateStr = reviewTargetBooking?.travelDate || '2026-10-10';

      await addReview({
        productId: reviewTargetProduct.id,
        bookingId: reviewTargetBooking?.id || `BK-VERIFIED-${Date.now().toString().slice(-4)}`,
        userName: authorName,
        userCountry,
        userAvatar: user?.role === 'TOURIST'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
          : undefined,
        rating,
        title: title.trim() || undefined,
        content: content.trim(),
        images: selectedPhotos,
        travelDate: travelDateStr,
        isVerifiedPurchase: true,
      });

      alert(t.successAlert);
    } catch (err: any) {
      alert(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStars = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* 모달 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-800 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-300" />
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              {t.modalHeader}
            </h3>
          </div>
          <button
            onClick={closeReviewModal}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 스크롤 폼 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. 실결제 및 여행 완료 인증 바우처 카드 */}
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 text-white text-xs font-extrabold rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.verifiedTag}</span>
              </span>
              <span className="font-mono text-xs font-bold text-teal-800">
                {t.bookingNo}: #{reviewTargetBooking?.id || 'BK-202610-033'}
              </span>
            </div>
            
            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 pt-1">
              {getTranslatedProductTitle(reviewTargetProduct, lang)}
            </h4>

            <div className="flex items-center gap-4 text-xs text-teal-900 font-semibold pt-1">
              <span>{t.travelDate}: <strong>{reviewTargetBooking?.travelDate || '2026-10-10'}</strong></span>
              <span>•</span>
              <span className="text-teal-700">{t.verifiedDesc}</span>
            </div>
          </div>

          {/* 에러 메시지 알림 */}
          {validationError && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 2. 별점 선택 인터랙션 (1~5점) */}
          <div className="space-y-2 text-center p-5 bg-gray-50 rounded-2xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t.ratingLabel}
            </label>

            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isActive = starVal <= currentStars;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starVal)}
                    className="p-1 focus:outline-none transition transform hover:scale-125"
                    aria-label={`${starVal} Star`}
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        isActive
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'fill-gray-200 text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-extrabold text-teal-800 transition-all h-5">
              {getRatingText(currentStars)}
            </div>
          </div>

          {/* 3. 작성자 국적 및 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.nameLabel}
              </label>
              <input
                type="text"
                disabled
                value={user?.name || (lang === 'en' ? 'Sarah Jenkins' : '김여행')}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.nationalityLabel}
              </label>
              <select
                value={userCountry}
                onChange={(e) => setUserCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-bold text-gray-800 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. 후기 한 줄 제목 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {t.titleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              maxLength={60}
              className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* 5. 텍스트 후기 내용 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700">
                {t.contentLabel} <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[11px] font-bold ${content.length < 10 ? 'text-amber-600' : 'text-teal-600'}`}>
                {t.charCount(content.length)}
              </span>
            </div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.contentPlaceholder}
              maxLength={500}
              className="w-full px-4 py-3 text-xs sm:text-sm leading-relaxed bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          {/* 6. 여행 사진 첨부 (최대 3장) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-600" />
                <span>{t.photosLabel}</span>
              </label>
              <span className="text-[11px] font-bold text-teal-700">
                {t.photosCount(selectedPhotos.length)}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              {t.photosSub}
            </p>

            {/* 사진 프리뷰 썸네일 그리드 */}
            <div className="grid grid-cols-3 gap-3">
              {selectedPhotos.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border-2 border-teal-500 shadow-sm group"
                >
                  <img
                    src={imgSrc}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition shadow"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                    Photo {idx + 1}
                  </span>
                </div>
              ))}

              {/* 사진 업로드 버튼 (최대 3장까지) */}
              {selectedPhotos.length < 3 && (
                <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-teal-500 hover:bg-teal-50/50 flex flex-col items-center justify-center cursor-pointer transition p-2 text-center group">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-teal-600 mb-1 transition" />
                  <span className="text-[11px] font-bold text-gray-600 group-hover:text-teal-700">
                    + 파일 선택
                  </span>
                  <span className="text-[10px] text-gray-400">
                    ({3 - selectedPhotos.length}장 남음)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 빠른 데모 사진 선택 버튼들 */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <span className="block text-[11px] font-bold text-gray-600">
                {t.quickPhotosTitle}
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_DEMO_PHOTOS.map((demo, idx) => {
                  const isAdded = selectedPhotos.includes(demo.url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAdded || selectedPhotos.length >= 3}
                      onClick={() => handleAddDemoPhoto(demo.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 transition ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 opacity-60 cursor-not-allowed'
                          : selectedPhotos.length >= 3
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-teal-50 hover:border-teal-300 border-gray-300'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3 text-teal-600" />
                      <span>{lang === 'en' ? demo.nameEn : demo.nameKo}</span>
                      {isAdded && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 모달 하단 액션 버튼 바 */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeReviewModal}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? t.submitting : t.submitBtn}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
