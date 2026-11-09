export type UserRole = 'TOURIST' | 'AGENCY' | 'ADMIN';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
  
  // 여행사 파트너 전용 필드
  agencyName?: string;
  businessNumber?: string;
  documentFileName?: string;
  isVerified?: boolean; // 관리자 승인 여부
}

export interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  titleEn?: string;
  descEn?: string;
}

export interface TourProduct {
  id: number;
  agencyName: string;
  agencyVerified: boolean;
  titleKo: string;
  titleEn: string;
  category: string;
  targetAudience: 'all' | 'foreign' | 'domestic';
  durationKo: string;
  durationEn: string;
  priceKrw: number;
  priceUsd: number;
  minPeople: number;
  maxPeople: number;
  rating: number;
  reviewCount: number;
  hasVideo: boolean;
  videoUrl?: string;
  imageUrl: string;
  images: string[];
  descriptionKo?: string;
  descriptionEn?: string;
  included: string[];
  includedEn?: string[];
  excluded: string[];
  excludedEn?: string[];
  schedule: ScheduleItem[];
  scheduleEn?: ScheduleItem[];
  createdAt?: string;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED_FULL' | 'CANCELLED_PARTIAL' | 'CANCELLED_NONE';

export interface Booking {
  id: string; // 예: BK-202610-091
  productId: number;
  productTitle: string;
  productTitleKo?: string;
  productTitleEn?: string;
  productImage: string;
  agencyName: string;
  agencyNameEn?: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelDate: string; // YYYY-MM-DD
  travelersCount: number;
  paidAmountKrw: number;
  paidAmountUsd: number;
  paymentMethod: 'CARD_DOMESTIC' | 'CARD_GLOBAL' | 'KAKAOPAY' | 'TOSSPAY';
  paymentId: string; // PG사 거래 고유번호 (imp_... 또는 toss_...)
  status: BookingStatus;
  createdAt: string;
  
  // 취소/환불 관련 필드
  cancelledAt?: string;
  refundAmountKrw?: number;
  penaltyAmountKrw?: number;
  refundRate?: number; // 1.0, 0.5, 0.0
  refundReason?: string;

  // 후기(리뷰) 관련 필드
  hasReviewed?: boolean;
  reviewId?: string;
}

export interface RefundCalculation {
  daysLeft: number;
  refundRate: number; // 1.0 (100%), 0.5 (50%), 0.0 (0%)
  refundAmount: number;
  penaltyAmount: number;
  status: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND';
  message: string;
  isCancelable: boolean;
}

export interface TourReview {
  id: string; // 예: REV-202610-001
  productId: number;
  bookingId?: string; // 실결제 예약 ID (#BK-...)
  userName: string;
  userCountry?: string; // 예: "🇺🇸 USA", "🇰🇷 Korea", "🇯🇵 Japan"
  userAvatar?: string;
  rating: number; // 1 ~ 5
  title?: string;
  content: string;
  images: string[]; // 최대 3장 사진 URL 또는 DataURL
  travelDate: string; // 실제 다녀온 여행 일자 (YYYY-MM-DD)
  createdAt: string; // 후기 작성 일자
  isVerifiedPurchase: boolean; // 실결제 및 여행 완료 인증 마크
  helpfulCount: number; // "도움이 돼요" 추천수
}

