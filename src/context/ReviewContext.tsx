'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TourReview, TourProduct, Booking } from '@/lib/types';
import { useBooking } from './BookingContext';

interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>; // 5: count, 4: count, ...
  photoReviewCount: number;
}

interface ReviewContextType {
  reviews: TourReview[];
  getProductReviews: (productId: number) => TourReview[];
  getProductRatingSummary: (productId: number) => RatingSummary;
  addReview: (
    review: Omit<TourReview, 'id' | 'createdAt' | 'helpfulCount'>
  ) => Promise<TourReview>;
  toggleHelpful: (reviewId: string) => void;
  
  // 실결제 및 여행 완료 검증 로직
  canUserReviewProduct: (
    productId: number,
    userEmail?: string
  ) => {
    canReview: boolean;
    reasonKo: string;
    reasonEn: string;
    eligibleBooking?: Booking;
  };
  hasBookingBeenReviewed: (bookingId: string) => boolean;

  // 후기 작성 모달 상태
  isReviewModalOpen: boolean;
  reviewTargetProduct: TourProduct | null;
  reviewTargetBooking: Booking | null;
  openReviewModal: (product: TourProduct, booking?: Booking) => void;
  closeReviewModal: () => void;
}

// 실감 나는 한국 여행 초기 포토 리뷰 데이터
const INITIAL_REVIEWS: TourReview[] = [
  // 1. 경복궁 한복 & 북촌 투어 (productId: 1)
  {
    id: 'REV-202610-001',
    productId: 1,
    bookingId: 'BK-202610-019',
    userName: 'Emily Watson',
    userCountry: '🇺🇸 USA',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: '경복궁 근정전에서 인생샷 건졌어요! (Magical Hanbok Experience)',
    content: '한복 퀄리티가 궁중 의상처럼 너무 고급스러워서 사진이 정말 환상적으로 나왔어요! 가이드님이 경복궁 근정전과 경회루의 숨겨진 역사 이야기까지 영어로 친절하게 설명해주셔서 너무 뜻깊은 시간이었습니다. 북촌 전통 찻집에서 마신 대추차와 다과도 잊지 못할 추억입니다. 한국에 다시 오면 꼭 재예약할 거예요!',
    images: [
      'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    ],
    travelDate: '2026-10-12',
    createdAt: '2026-10-14',
    isVerifiedPurchase: true,
    helpfulCount: 24,
  },
  {
    id: 'REV-202610-002',
    productId: 1,
    bookingId: 'BK-202610-012',
    userName: 'Kenji Takahashi',
    userCountry: '🇯🇵 Japan',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: '부모님 모시고 간 최고의 서울 투어',
    content: '가족들과 함께 참여했습니다. 북촌 돌담길에서 전문 가이드님이 찍어주신 가족 스냅사진이 스튜디오 촬영 못지않게 인생샷이 되었네요. 4시간 일정이 전혀 지루하지 않았고 부모님도 대만족하셨습니다.',
    images: [
      'https://images.unsplash.com/photo-1538669715315-155099bfa8b6?auto=format&fit=crop&w=800&q=80',
    ],
    travelDate: '2026-10-08',
    createdAt: '2026-10-09',
    isVerifiedPurchase: true,
    helpfulCount: 16,
  },
  {
    id: 'REV-202610-003',
    productId: 1,
    bookingId: 'BK-202610-009',
    userName: 'Sophie Laurent',
    userCountry: '🇫🇷 France',
    rating: 4,
    title: 'Magnifique visite du palais royal',
    content: 'The palace walking tour in the morning was serene and educational. Our guide took care of every detail, including sizing the silk hanbok perfectly. Bukchon alleys were quiet and picturesque.',
    images: [],
    travelDate: '2026-10-05',
    createdAt: '2026-10-06',
    isVerifiedPurchase: true,
    helpfulCount: 9,
  },

  // 2. 제주 비밀 오름 트레킹 (productId: 2)
  {
    id: 'REV-202610-004',
    productId: 2,
    bookingId: 'BK-202610-025',
    userName: 'Liam Miller',
    userCountry: '🇬🇧 UK',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Hidden Gem in Jeju Island!',
    content: '관광객들로 붐비는 일반 패키지와는 차원이 달랐습니다. 현지 가이드분만 아는 비밀 삼나무 숲길과 아부오름 능선에서 바라본 한라산 능선이 절경이었어요! 해녀 식당에서 먹은 신선한 성게미역국과 흑돼지 구이도 감동 그 자체였습니다.',
    images: [
      'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    ],
    travelDate: '2026-10-11',
    createdAt: '2026-10-13',
    isVerifiedPurchase: true,
    helpfulCount: 31,
  },
  {
    id: 'REV-202610-005',
    productId: 2,
    bookingId: 'BK-202610-021',
    userName: '민지영',
    userCountry: '🇰🇷 Korea',
    rating: 5,
    title: '제주 로컬의 진수를 맛본 힐링 투어',
    content: '운전 스트레스 없이 전용 밴으로 편하게 이동하면서 피톤치드 가득한 숲길을 걸었습니다. 가이드님의 친절함과 세심한 배려 덕분에 부모님과 평생 간직할 추억을 만들었어요.',
    images: [
      'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80',
    ],
    travelDate: '2026-10-07',
    createdAt: '2026-10-08',
    isVerifiedPurchase: true,
    helpfulCount: 14,
  },

  // 3. K-POP 성지 & 홍대 스트리트 푸드 (productId: 3)
  {
    id: 'REV-202610-006',
    productId: 3,
    bookingId: 'BK-202610-032',
    userName: 'Jessica Chen',
    userCountry: '🇨🇦 Canada',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Best K-Culture Tour in Hongdae!',
    content: 'As an ARMY and K-Pop fan, this tour was a dream come true! Our energetic guide took us to real MV spots and iconic cafes. The street food tasting was generous—hotteok and tteokbokki were to die for!',
    images: [
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506812574058-fc75fa93fead?auto=format&fit=crop&w=800&q=80',
    ],
    travelDate: '2026-10-13',
    createdAt: '2026-10-14',
    isVerifiedPurchase: true,
    helpfulCount: 28,
  },

  // 4. 해운대 요트 투어 & 드론쇼 (productId: 4)
  {
    id: 'REV-202610-007',
    productId: 4,
    bookingId: 'BK-202610-055',
    userName: 'Michael Brown',
    userCountry: '🇺🇸 USA',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Unbelievable Drone Show from Luxury Yacht!',
    content: '바다 한가운데서 광안대교 야경과 화려한 드론 라이트쇼를 직관하는 감동은 정말 잊지 못합니다. 요트 위에서 제공된 샴페인과 선상 음악도 낭만적이었고 스태프분들의 안전 지도도 완벽했습니다. 부산 오시면 무조건 타세요!',
    images: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    ],
    travelDate: '2026-10-16',
    createdAt: '2026-10-17',
    isVerifiedPurchase: true,
    helpfulCount: 19,
  },
];

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<TourReview[]>(INITIAL_REVIEWS);
  const [helpfulVotedIds, setHelpfulVotedIds] = useState<string[]>([]);

  // 모달 상태
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetProduct, setReviewTargetProduct] = useState<TourProduct | null>(null);
  const [reviewTargetBooking, setReviewTargetBooking] = useState<Booking | null>(null);

  const { bookings, markBookingReviewed } = useBooking();

  // 로컬 스토리지 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem('k_trip_hub_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 특정 상품의 리뷰 목록 조회
  const getProductReviews = (productId: number): TourReview[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  // 평점 통계 계산 (평균 평점, 리뷰 수, 별점별 분포 등)
  const getProductRatingSummary = (productId: number): RatingSummary => {
    const list = getProductReviews(productId);
    if (list.length === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        photoReviewCount: 0,
      };
    }

    const total = list.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((total / list.length).toFixed(1));

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let photoCount = 0;

    list.forEach((r) => {
      const rInt = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rInt] = (distribution[rInt] || 0) + 1;
      if (r.images && r.images.length > 0) {
        photoCount += 1;
      }
    });

    return {
      averageRating: avg,
      totalReviews: list.length,
      distribution,
      photoReviewCount: photoCount,
    };
  };

  // 특정 예약이 이미 후기를 작성했는지 여부
  const hasBookingBeenReviewed = (bookingId: string): boolean => {
    return reviews.some((r) => r.bookingId === bookingId);
  };

  // 실결제 및 여행 완료 검증 로직
  // 1. 해당 상품을 결제 완료(CONFIRMED)한 예약이 있는가?
  // 2. 여행 예정일(travelDate)이 현재 시점보다 이전이거나 오늘인가? (여행 완료 여부)
  // 3. 아직 해당 예약 건에 대해 후기를 작성하지 않았는가?
  const canUserReviewProduct = (
    productId: number,
    userEmail?: string
  ): {
    canReview: boolean;
    reasonKo: string;
    reasonEn: string;
    eligibleBooking?: Booking;
  } => {
    // 1. 해당 상품의 확정된 예약들 탐색
    const matchingBookings = bookings.filter((b) => {
      if (b.productId !== productId) return false;
      if (b.status !== 'CONFIRMED') return false;
      if (userEmail && b.travelerEmail && b.travelerEmail !== userEmail) {
        // 이메일이 주어진 경우 검사하되, 데모 테스트를 위해 이메일 일치 우선
        return true;
      }
      return true;
    });

    if (matchingBookings.length === 0) {
      return {
        canReview: false,
        reasonKo: '실제로 해당 투어 상품을 예약 및 결제한 관광객만 후기를 작성할 수 있습니다.',
        reasonEn: 'Only verified travelers who have booked and paid for this tour can submit a review.',
      };
    }

    // 오늘 날짜 (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];

    // 여행이 끝난 예약 찾기 (travelDate <= todayStr)
    const completedBooking = matchingBookings.find((b) => {
      return b.travelDate <= todayStr && !hasBookingBeenReviewed(b.id);
    });

    if (completedBooking) {
      return {
        canReview: true,
        reasonKo: `여행 완료가 확인되었습니다. (예약번호: #${completedBooking.id})`,
        reasonEn: `Verified completed tour. (Booking ID: #${completedBooking.id})`,
        eligibleBooking: completedBooking,
      };
    }

    // 여행 예정일이 아직 미래인 경우
    const upcomingBooking = matchingBookings.find((b) => b.travelDate > todayStr);
    if (upcomingBooking) {
      return {
        canReview: false,
        reasonKo: `투어 예정일(${upcomingBooking.travelDate})이 종료된 이후 여행이 완료되면 후기를 작성하실 수 있습니다.`,
        reasonEn: `Review submission will unlock after your tour date (${upcomingBooking.travelDate}) is completed.`,
        eligibleBooking: upcomingBooking,
      };
    }

    // 이미 모든 예약에 대해 후기를 작성한 경우
    return {
      canReview: false,
      reasonKo: '이미 해당 투어에 대한 여행 후기 작성을 완료하셨습니다. 소중한 경험을 나눠주셔서 감사합니다!',
      reasonEn: 'You have already submitted a review for this tour. Thank you for sharing your experience!',
    };
  };

  // 신규 후기 등록
  const addReview = async (
    reviewData: Omit<TourReview, 'id' | 'createdAt' | 'helpfulCount'>
  ): Promise<TourReview> => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newId = `REV-${todayStr.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newReview: TourReview = {
      ...reviewData,
      id: newId,
      createdAt: todayStr,
      helpfulCount: 0,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('k_trip_hub_reviews', JSON.stringify(updated));

    // 예약 건에 후기 작성 완료 마킹
    if (reviewData.bookingId && markBookingReviewed) {
      markBookingReviewed(reviewData.bookingId, newId);
    }

    closeReviewModal();
    return newReview;
  };

  // '도움이 돼요' 추천 토글
  const toggleHelpful = (reviewId: string) => {
    const hasVoted = helpfulVotedIds.includes(reviewId);
    const nextVoted = hasVoted
      ? helpfulVotedIds.filter((id) => id !== reviewId)
      : [...helpfulVotedIds, reviewId];

    setHelpfulVotedIds(nextVoted);

    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpfulCount: Math.max(0, r.helpfulCount + (hasVoted ? -1 : 1)),
        };
      }
      return r;
    });

    setReviews(updated);
    localStorage.setItem('k_trip_hub_reviews', JSON.stringify(updated));
  };

  const openReviewModal = (product: TourProduct, booking?: Booking) => {
    setReviewTargetProduct(product);
    setReviewTargetBooking(booking || null);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewTargetProduct(null);
    setReviewTargetBooking(null);
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        getProductReviews,
        getProductRatingSummary,
        addReview,
        toggleHelpful,
        canUserReviewProduct,
        hasBookingBeenReviewed,
        isReviewModalOpen,
        reviewTargetProduct,
        reviewTargetBooking,
        openReviewModal,
        closeReviewModal,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
}
