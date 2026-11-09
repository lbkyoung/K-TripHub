'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, BookingStatus, RefundCalculation, TourProduct } from '@/lib/types';
import { calculateRefund } from '@/lib/refundPolicy';
import { getTranslatedAgency, getTranslatedProductTitle } from '@/lib/translations';

interface PaymentTarget {
  product: TourProduct;
  travelDate: string;
  travelersCount: number;
}

interface BookingContextType {
  bookings: Booking[];
  isPaymentModalOpen: boolean;
  paymentTarget: PaymentTarget | null;
  openPaymentModal: (product: TourProduct, travelDate: string, travelersCount: number) => void;
  closePaymentModal: () => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<Booking>;
  
  isCancelModalOpen: boolean;
  cancelingBooking: Booking | null;
  openCancelModal: (booking: Booking) => void;
  closeCancelModal: () => void;
  confirmCancelBooking: (bookingId: string, customDateStr?: string) => Promise<{ success: boolean; refundInfo: RefundCalculation }>;
  markBookingReviewed?: (bookingId: string, reviewId: string) => void;
}

// 3가지 시나리오를 즉시 테스트해볼 수 있는 기본 예약 샘플들
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-202610-091',
    productId: 1,
    productTitle: '[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 전통 골목 프라이빗 워킹 투어',
    productTitleKo: '[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 전통 골목 프라이빗 워킹 투어',
    productTitleEn: '[Top Rated] Gyeongbokgung Hanbok & Bukchon Village Private Walking Tour',
    productImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    agencyName: '서울투어 익스프레스',
    agencyNameEn: 'Seoul Tour Express',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah@globaltravel.com',
    travelerPhone: '+1-202-555-0192',
    travelDate: '2026-10-25', // 현재 기준 D-9 (3일 이상 남음 -> 100% 환불 대상)
    travelersCount: 2,
    paidAmountKrw: 110000,
    paidAmountUsd: 84,
    paymentMethod: 'CARD_GLOBAL',
    paymentId: 'imp_881290348123',
    status: 'CONFIRMED',
    createdAt: '2026-10-15',
  },
  {
    id: 'BK-202610-072',
    productId: 2,
    productTitle: '[힐링 제주 1일] 비밀 오름 트레킹 & 동쪽 해안도로 감성 드라이브',
    productTitleKo: '[힐링 제주 1일] 비밀 오름 트레킹 & 동쪽 해안도로 감성 드라이브',
    productTitleEn: '[Healing Jeju] Secret Oreum Trekking & East Coast Scenic Drive',
    productImage: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=600&q=80',
    agencyName: '제주 오름 트래블',
    agencyNameEn: 'Jeju Oreum Travel',
    travelerName: 'Kenji Sato',
    travelerEmail: 'kenji@travel.jp',
    travelerPhone: '+81-90-1234-5678',
    travelDate: '2026-10-18', // 현재 기준 D-2 (2일 전 -> 50% 부분 환불 대상)
    travelersCount: 1,
    paidAmountKrw: 98000,
    paidAmountUsd: 75,
    paymentMethod: 'CARD_GLOBAL',
    paymentId: 'toss_pay_5548123019',
    status: 'CONFIRMED',
    createdAt: '2026-10-14',
  },
  {
    id: 'BK-202610-055',
    productId: 4,
    productTitle: '[야경 스페셜] 해운대 요트 투어 & 광안대교 야경 드론쇼 관람',
    productTitleKo: '[야경 스페셜] 해운대 요트 투어 & 광안대교 야경 드론쇼 관람',
    productTitleEn: '[Night Yacht] Busan Haeundae Yacht & Gwangandaegyo Light Show Tour',
    productImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80',
    agencyName: '부산 로컬 마린스',
    agencyNameEn: 'Busan Local Marines',
    travelerName: 'Michael Brown',
    travelerEmail: 'michael@traveler.com',
    travelerPhone: '+1-415-555-0143',
    travelDate: '2026-10-16', // 현재 기준 당일(D-Day) -> 0% 환불 불가 대상
    travelersCount: 2,
    paidAmountKrw: 160000,
    paidAmountUsd: 124,
    paymentMethod: 'CARD_GLOBAL',
    paymentId: 'imp_global_491823901',
    status: 'CONFIRMED',
    createdAt: '2026-10-12',
    hasReviewed: true,
  },
  {
    id: 'BK-202610-033',
    productId: 1,
    productTitle: '[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 전통 골목 프라이빗 워킹 투어',
    productTitleKo: '[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 전통 골목 프라이빗 워킹 투어',
    productTitleEn: '[Top Rated] Gyeongbokgung Hanbok & Bukchon Village Private Walking Tour',
    productImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    agencyName: '서울투어 익스프레스',
    agencyNameEn: 'Seoul Tour Express',
    travelerName: 'Sarah Jenkins',
    travelerEmail: 'sarah@globaltravel.com',
    travelerPhone: '+1-202-555-0192',
    travelDate: '2026-10-10', // 여행 완료된 지난 일정! 후기 작성 대상
    travelersCount: 2,
    paidAmountKrw: 110000,
    paidAmountUsd: 84,
    paymentMethod: 'CARD_GLOBAL',
    paymentId: 'imp_completed_8812903',
    status: 'CONFIRMED',
    createdAt: '2026-10-01',
    hasReviewed: false,
  },
];

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // 결제 모달 상태
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);

  // 취소/환불 팝업 상태
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelingBooking, setCancelingBooking] = useState<Booking | null>(null);

  // 로컬스토리지 복원 및 레거시 데이터 자동 정규화/영문화
  useEffect(() => {
    try {
      const saved = localStorage.getItem('k_trip_hub_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized: Booking[] = parsed.map((b: any) => ({
            ...b,
            productTitleKo: b.productTitleKo || b.productTitle,
            productTitleEn: b.productTitleEn || getTranslatedProductTitle(b, 'en'),
            agencyName: b.agencyName || '서울투어 익스프레스',
            agencyNameEn: b.agencyNameEn || getTranslatedAgency(b.agencyName, 'en'),
          }));
          setBookings(normalized);
          localStorage.setItem('k_trip_hub_bookings', JSON.stringify(normalized));
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openPaymentModal = (product: TourProduct, travelDate: string, travelersCount: number) => {
    setPaymentTarget({ product, travelDate, travelersCount });
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentTarget(null);
  };

  const openCancelModal = (booking: Booking) => {
    setCancelingBooking(booking);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelingBooking(null);
  };

  // 결제 완료 후 예약 생성
  const createBooking = async (data: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    const newBooking: Booking = {
      ...data,
      id: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      productTitleKo: data.productTitleKo || data.productTitle,
      productTitleEn: data.productTitleEn || getTranslatedProductTitle(data, 'en'),
      agencyNameEn: data.agencyNameEn || getTranslatedAgency(data.agencyName, 'en'),
      status: 'CONFIRMED',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('k_trip_hub_bookings', JSON.stringify(updated));
    closePaymentModal();
    return newBooking;
  };

  // 백엔드 API를 호출하여 취소/환불 확정
  const confirmCancelBooking = async (bookingId: string, customDateStr?: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) throw new Error('예약 내역을 찾을 수 없습니다.');

    try {
      // 1. 백엔드 API Route 호출
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          travelDate: target.travelDate,
          paidAmountKrw: target.paidAmountKrw,
          paymentId: target.paymentId,
          customCancelDate: customDateStr,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || '환불 처리에 실패했습니다.');

      const refundInfo: RefundCalculation = result.refundInfo;

      // 2. 상태 갱신
      let nextStatus: BookingStatus = 'CANCELLED_FULL';
      if (refundInfo.status === 'PARTIAL_REFUND') nextStatus = 'CANCELLED_PARTIAL';
      if (refundInfo.status === 'NO_REFUND') nextStatus = 'CANCELLED_NONE';

      const updated = bookings.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: nextStatus,
            cancelledAt: new Date().toISOString().split('T')[0],
            refundAmountKrw: refundInfo.refundAmount,
            penaltyAmountKrw: refundInfo.penaltyAmount,
            refundRate: refundInfo.refundRate,
            refundReason: refundInfo.message,
          };
        }
        return b;
      });

      setBookings(updated);
      localStorage.setItem('k_trip_hub_bookings', JSON.stringify(updated));
      closeCancelModal();

      return { success: true, refundInfo };
    } catch (err: any) {
      console.error(err);
      // 오프라인/Fallback 로컬 계산
      const fallbackRefund = calculateRefund(target.travelDate, target.paidAmountKrw);
      closeCancelModal();
      return { success: true, refundInfo: fallbackRefund };
    }
  };

  const markBookingReviewed = (bookingId: string, reviewId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, hasReviewed: true, reviewId } : b
    );
    setBookings(updated);
    localStorage.setItem('k_trip_hub_bookings', JSON.stringify(updated));
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isPaymentModalOpen,
        paymentTarget,
        openPaymentModal,
        closePaymentModal,
        createBooking,
        isCancelModalOpen,
        cancelingBooking,
        openCancelModal,
        closeCancelModal,
        confirmCancelBooking,
        markBookingReviewed,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
