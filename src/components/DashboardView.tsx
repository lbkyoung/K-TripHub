'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTour } from '@/context/TourContext';
import { useBooking } from '@/context/BookingContext';
import {
  BarChart3,
  Building2,
  User,
  Shield,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Percent,
  PlusCircle,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { UserRole, Booking } from '@/lib/types';
import { getTranslatedAgency, getTranslatedProductTitle, getTranslatedPaymentMethod } from '@/lib/translations';
import { useReview } from '@/context/ReviewContext';

interface DashboardViewProps {
  lang: 'ko' | 'en';
  onClose?: () => void;
}

export default function DashboardView({ lang, onClose }: DashboardViewProps) {
  const { user, openAuthModal } = useAuth();
  const { products, openRegisterModal } = useTour();
  const { bookings, openCancelModal } = useBooking();
  const { hasBookingBeenReviewed, openReviewModal } = useReview();

  const todayStr = new Date().toISOString().split('T')[0];

  const handleWriteReviewForBooking = (booking: Booking) => {
    let product = products.find((p) => p.id === booking.productId);
    if (!product) {
      product = {
        id: booking.productId,
        agencyName: booking.agencyName,
        agencyVerified: true,
        titleKo: booking.productTitleKo || booking.productTitle,
        titleEn: booking.productTitleEn || booking.productTitle,
        category: 'seoul',
        targetAudience: 'all',
        durationKo: '투어',
        durationEn: 'Tour',
        priceKrw: booking.paidAmountKrw,
        priceUsd: booking.paidAmountUsd,
        minPeople: 1,
        maxPeople: 10,
        rating: 5,
        reviewCount: 1,
        hasVideo: false,
        imageUrl: booking.productImage,
        images: [booking.productImage],
        included: [],
        excluded: [],
        schedule: [],
      };
    }
    openReviewModal(product, booking);
  };

  // 사용자의 role에 맞춰 초기 뷰 모드 설정
  const getDefaultRoleForUser = (role?: UserRole): UserRole => {
    if (!role || role === 'TOURIST') return 'TOURIST';
    if (role === 'AGENCY') return 'AGENCY';
    if (role === 'ADMIN') return 'ADMIN';
    return 'TOURIST';
  };

  const [currentViewRole, setCurrentViewRole] = useState<UserRole>(getDefaultRoleForUser(user?.role));

  // user 세션 변화 시 뷰 모드 자동 동기화
  useEffect(() => {
    setCurrentViewRole(getDefaultRoleForUser(user?.role));
  }, [user]);

  // 엄격한 권한 가드 (Strict Role-Based Access Control)
  // - 비로그인 / TOURIST: 오직 'TOURIST'만 허용 (여행사/관리자 뷰 차단)
  // - AGENCY: 'AGENCY' 또는 'TOURIST'만 허용 (ADMIN 관리자 뷰 차단)
  // - ADMIN: 모든 뷰 자유롭게 전환 가능
  const effectiveViewRole: UserRole = (() => {
    if (!user || user.role === 'TOURIST') {
      return 'TOURIST';
    }
    if (user.role === 'AGENCY') {
      return currentViewRole === 'ADMIN' ? 'AGENCY' : currentViewRole;
    }
    return currentViewRole;
  })();

  // 관리자 승인 대기 목록
  const [pendingAgencies, setPendingAgencies] = useState([
    {
      id: 1,
      name: '달빛 신라 여행사 (Moonlight Silla)',
      businessNumber: '502-81-99881',
      manager: '이경주 (Lee)',
      phone: '010-8888-1234',
      docName: 'business_license_silla.pdf',
      status: 'PENDING',
      appliedAt: '2026-10-16',
    },
    {
      id: 2,
      name: '강원 힐링로드 투어 (Gangwon Healing)',
      businessNumber: '221-12-34567',
      manager: '김설악 (Kim)',
      phone: '010-7777-5678',
      docName: 'business_license_gangwon.pdf',
      status: 'PENDING',
      appliedAt: '2026-10-15',
    },
  ]);

  const handleApproveAgency = (id: number) => {
    setPendingAgencies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    );
    alert(lang === 'ko' ? '해당 여행사의 입점이 승인되었습니다!' : 'Agency approved successfully!');
  };

  const t = {
    ko: {
      badgeLive: "실시간 대시보드",
      mainTitle: "플랫폼 종합 관제 & 정산 대시보드",
      mainSub: "여행사 정산(70%), 플랫폼 소개료(30%), 예약 취소 규정(3일 전 100%)이 적용되는 통합 시스템입니다.",
      tabAgency: "🏢 여행사 파트너 뷰",
      tabAdmin: "👑 플랫폼 관리자 뷰",
      tabTourist: "🎒 관광객 마이페이지",
      
      // 관광객 마이페이지
      touristBannerTag: "Traveler My Page",
      touristTitle: (name: string) => `${name} 님의 여행 보관함`,
      touristSub: "예약 내역 조회, 투명한 취소/환불 규정 확인, 다녀온 여행 후기 작성을 할 수 있습니다.",
      escrowBadge: "안심 에스크로 100% 보장 중",
      bookingHistoryTitle: (count: number) => `예약 및 결제 내역 (${count}건)`,
      bookingSub: "포트원/토스페이먼츠 실시간 연동",
      statusConfirmed: "✓ 예약 확정 (결제 완료)",
      statusCancelFull: "✕ 예약 취소 (100% 환불 완료)",
      statusCancelPartial: "✕ 예약 취소 (50% 부분 환불 완료)",
      statusCancelNone: "✕ 예약 취소 (환불 불가 처리)",
      travelDateLabel: "여행 예정일",
      guestsLabel: (count: number) => `참여 인원: ${count}명`,
      paidLabel: (krw: number, method: string) => `결제 금액: ${krw.toLocaleString()}원 (${method})`,
      refundRuleTip: "여행 3일 전까지 취소 시 100% 전액 환불 (2~1일 전 50%, 당일 0%)",
      refundedLabel: (krw: number) => `환불 완료액: ${krw.toLocaleString()}원`,
      btnCancelCheck: "예약 취소 (환불 예상액 확인)",
      noBookings: "아직 예약 내역이 없습니다.",

      // 여행사 뷰
      agencySpace: "Agency Partner Space",
      agencyStatus: "인증 입점사 (판매 가능)",
      btnAddTour: "새 여행상품 등록하기",
      agencyGmvTitle: "이번 달 총 판매액 (100%)",
      agencyFeeTitle: "플랫폼 소개료 (30%)",
      agencyFeeDesc: "약관 규정 요율 30% 자동 공제",
      agencyPayoutTitle: "★ 실수령 정산금 (70%)",
      agencyPayoutDesc: "매월 25일 자동 입금 예정",
      agencyBookingCount: "확정된 예약",
      recentBookings: "최근 들어온 예약자 명단",
      colBookingNo: "예약 번호",
      colTourTitle: "여행 상품명",
      colTraveler: "예약자명 / 국적",
      colGuests: "인원",
      colTravelDate: "여행 예정일",
      colAmountPayout: "결제액 / 정산액 (70%)",
      colStatus: "상태",

      // 관리자 뷰
      adminMaster: "Master Control Center",
      adminTitle: "K-TripHub 플랫폼 총괄 관리자 센터",
      adminSub: "입점 여행사 관리, 플랫폼 수수료 30% 수익 집계, 취소/환불 분쟁 관리 통합 모드",
      adminSystemOk: "● 시스템 정상 운영 중",
      adminTotalGmv: "플랫폼 누적 총 거래액 (GMV)",
      adminNetProfit: "내 플랫폼 순수익 (30% 수수료)",
      adminNetProfitDesc: "여행사 거래액의 30% 순이익 집계",
      adminPayoutTotal: "여행사 지급 정산금 (70%)",
      adminPendingAgencies: "입점 신청 심사 대기",
      agencyAuditTitle: "신규 여행사 파트너 입점 심사 및 서류 승인",
      agencyAuditSub: "사업자등록증 서류를 검토한 뒤 승인 버튼을 누르면 해당 여행사가 상품을 판매할 수 있습니다.",
      btnApprove: "입점 승인",
      btnHold: "보류",
      approvedBadge: "✓ 승인 완료 (활동중)",
    },
    en: {
      badgeLive: "Live Dashboard",
      mainTitle: "Platform Control & Settlement Dashboard",
      mainSub: "Integrated system reflecting 70% settlement, 30% platform fee, and 3-day 100% full refund policy.",
      tabAgency: "🏢 Agency Partner View",
      tabAdmin: "👑 Admin View",
      tabTourist: "🎒 Tourist My Bookings",

      // 관광객 마이페이지
      touristBannerTag: "Traveler My Page",
      touristTitle: (name: string) => `${name}'s Travel Bookings & Trips`,
      touristSub: "Check booking receipts, view transparent refund policies, and manage your upcoming adventures in Korea.",
      escrowBadge: "100% Secure Escrow Protection",
      bookingHistoryTitle: (count: number) => `My Bookings & Receipts (${count})`,
      bookingSub: "Live Multi-Currency Payment System",
      statusConfirmed: "✓ Confirmed (Payment Completed)",
      statusCancelFull: "✕ Cancelled (100% Full Refund)",
      statusCancelPartial: "✕ Cancelled (50% Partial Refund)",
      statusCancelNone: "✕ Cancelled (Non-Refundable)",
      travelDateLabel: "Travel Date",
      guestsLabel: (count: number) => `Travelers: ${count} guest(s)`,
      paidLabel: (krw: number, method: string) => `Paid: $${Math.round(krw / 1300)} (${krw.toLocaleString()} KRW)`,
      refundRuleTip: "100% Full refund if cancelled 3+ days prior (50% for 1-2 days, 0% on travel day)",
      refundedLabel: (krw: number) => `Refunded: $${Math.round(krw / 1300)} (${krw.toLocaleString()} KRW)`,
      btnCancelCheck: "Cancel Booking (Check Refund)",
      noBookings: "No bookings found yet.",

      // 여행사 뷰
      agencySpace: "Agency Partner Space",
      agencyStatus: "Verified Partner Agency (Active)",
      btnAddTour: "Add New Tour Package",
      agencyGmvTitle: "Total Monthly GMV (100%)",
      agencyFeeTitle: "Platform Fee (30%)",
      agencyFeeDesc: "Automated 30% commission deduction",
      agencyPayoutTitle: "★ Net Agency Payout (70%)",
      agencyPayoutDesc: "Scheduled for payout on the 25th",
      agencyBookingCount: "Confirmed Bookings",
      recentBookings: "Recent Customer Reservations",
      colBookingNo: "Booking ID",
      colTourTitle: "Tour Package",
      colTraveler: "Traveler / Origin",
      colGuests: "Guests",
      colTravelDate: "Departure Date",
      colAmountPayout: "Paid / Payout (70%)",
      colStatus: "Status",

      // 관리자 뷰
      adminMaster: "Master Control Center",
      adminTitle: "K-TripHub Platform Admin Dashboard",
      adminSub: "Agency approval, 30% platform commission revenue aggregate, and dispute resolution.",
      adminSystemOk: "● All Systems Operational",
      adminTotalGmv: "Total Gross Merchandise Value (GMV)",
      adminNetProfit: "Platform Net Revenue (30% Fee)",
      adminNetProfitDesc: "30% net take rate from agency sales",
      adminPayoutTotal: "Agency Payouts Due (70%)",
      adminPendingAgencies: "Agencies Pending Review",
      agencyAuditTitle: "New Agency Verification & Document Approval",
      agencyAuditSub: "Review official business registration documents and click Approve to enable product sales.",
      btnApprove: "Approve Agency",
      btnHold: "Hold",
      approvedBadge: "✓ Approved (Active)",
    }
  }[lang];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 대시보드 최상단 헤더 & 역할 전환 탭 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.badgeLive}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {!user || user.role === 'TOURIST'
                ? (lang === 'ko' ? '관광객 마이페이지 & 예약 보관함' : 'Traveler My Page & Bookings')
                : user.role === 'AGENCY'
                ? (effectiveViewRole === 'AGENCY'
                    ? (lang === 'ko' ? '여행사 파트너 전용 관리 스페이스' : 'Agency Partner Portal')
                    : (lang === 'ko' ? '관광객 모드 예약 보관함' : 'Traveler Booking View'))
                : t.mainTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {!user
                ? (lang === 'ko' ? '로그인하시면 나의 실제 예약 내역 조회, 투명한 취소/환불, 후기 작성을 이용하실 수 있습니다.' : 'Sign in to manage your bookings, cancel/refunds, and write verified reviews.')
                : user.role === 'TOURIST'
                ? (lang === 'ko' ? '예약 내역 조회, 투명한 취소/환불 규정 확인, 다녀온 여행 후기 작성을 할 수 있습니다.' : 'Check confirmed bookings, refund estimates, and write verified reviews.')
                : user.role === 'AGENCY'
                ? (lang === 'ko' ? '판매 상품 관리, 실시간 예약자 명단, 투명한 70% 정산 집계 시스템입니다.' : 'Tour product management, guest roster, and transparent 70% settlement dashboard.')
                : t.mainSub}
            </p>
          </div>

          {/* 역할별 뷰 전환 탭: 사용자 권한(Role)에 따라 허용된 탭만 조건부 노출 */}
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
            {/* 1. 관광객 마이페이지 버튼: 모든 사용자(비로그인, 관광객, 여행사, 관리자) 이용 가능 */}
            <button
              onClick={() => setCurrentViewRole('TOURIST')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                effectiveViewRole === 'TOURIST'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 bg-white/60 sm:bg-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.tabTourist}</span>
            </button>

            {/* 2. 여행사 파트너 뷰 버튼: 오직 여행사(AGENCY) 및 관리자(ADMIN)에게만 노출 (관광객, 비로그인은 숨김) */}
            {(user?.role === 'AGENCY' || user?.role === 'ADMIN') && (
              <button
                onClick={() => setCurrentViewRole('AGENCY')}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  effectiveViewRole === 'AGENCY'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 bg-white/60 sm:bg-transparent'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{t.tabAgency}</span>
              </button>
            )}

            {/* 3. 플랫폼 관리자 뷰 버튼: 오직 총괄 관리자(ADMIN)에게만 노출 (관광객, 여행사, 비로그인은 숨김) */}
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setCurrentViewRole('ADMIN')}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  effectiveViewRole === 'ADMIN'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 bg-white/60 sm:bg-transparent'
                }`}
              >
                <Shield className="w-4 h-4 text-teal-400" />
                <span>{t.tabAdmin}</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. 일반 관광객 대시보드 (Role: TOURIST - 마이페이지) */}
        {/* ========================================================================= */}
        {effectiveViewRole === 'TOURIST' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 관광객 환영 배너 */}
            <div className="bg-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
              <div>
                <span className="px-3 py-1 bg-white/20 text-teal-100 rounded-full text-xs font-bold uppercase">
                  {t.touristBannerTag}
                </span>
                <h2 className="text-2xl font-black mt-2">
                  {t.touristTitle(user?.name || (lang === 'en' ? 'Sarah Jenkins' : '김여행'))}
                </h2>
                <p className="text-xs text-teal-100 mt-1">
                  {t.touristSub}
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20">
                {t.escrowBadge}
              </div>
            </div>

            {/* 비로그인 방문자 안내 배너 */}
            {!user && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-900 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">🔒</span>
                  <span>
                    {lang === 'ko'
                      ? '현재 비로그인 상태입니다. 우측 상단 [로그인 / 회원가입]을 통해 관광객, 여행사, 관리자 계정으로 로그인하시면 각 권한별 전용 화면을 확인하실 수 있습니다.'
                      : 'You are currently not logged in. Sign in to view role-specific dashboards (Tourist, Agency, Admin).'}
                  </span>
                </div>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition flex-shrink-0"
                >
                  {lang === 'ko' ? '로그인 / 회원가입' : 'Sign In'}
                </button>
              </div>
            )}

            {/* 나의 예약 내역 카드 리스트 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span>{t.bookingHistoryTitle(bookings.length)}</span>
                </h3>
                <span className="text-xs text-gray-400">{t.bookingSub}</span>
              </div>

              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-gray-50 border border-gray-200 transition hover:border-teal-300"
                  >
                    <img
                      src={b.productImage}
                      alt={b.productTitle}
                      className="w-full md:w-48 h-36 object-cover rounded-xl flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500">
                              {getTranslatedAgency(b.agencyName, lang)}
                            </span>
                            <span className="font-mono text-xs text-gray-400">#{b.id}</span>
                          </div>

                          {/* 상태 뱃지 */}
                          {b.status === 'CONFIRMED' && (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                              {t.statusConfirmed}
                            </span>
                          )}
                          {b.status === 'CANCELLED_FULL' && (
                            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                              {t.statusCancelFull}
                            </span>
                          )}
                          {b.status === 'CANCELLED_PARTIAL' && (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                              {t.statusCancelPartial}
                            </span>
                          )}
                          {b.status === 'CANCELLED_NONE' && (
                            <span className="px-2.5 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-bold">
                              {t.statusCancelNone}
                            </span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-base text-gray-900 mt-1">
                          {getTranslatedProductTitle(b, lang)}
                        </h4>

                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          <p>
                            {t.travelDateLabel}: <strong className="text-gray-900">{b.travelDate}</strong> | <strong>{t.guestsLabel(b.travelersCount)}</strong>
                          </p>
                          <p>
                            <strong className="text-teal-700 font-extrabold text-sm">
                              {lang === 'en' ? `$${b.paidAmountUsd} (${b.paidAmountKrw.toLocaleString()} KRW)` : `${b.paidAmountKrw.toLocaleString()}원`}
                            </strong>
                            <span className="text-gray-400 text-[11px] ml-1">
                              ({getTranslatedPaymentMethod(b.paymentMethod, lang)})
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* 하단 취소/환불 & 후기 작성 액션 바 */}
                      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-xs">
                          {b.status === 'CONFIRMED' ? (
                            b.travelDate <= todayStr ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>{lang === 'en' ? 'Tour Completed! Please share your review.' : '여행 완료! 소중한 여행 경험을 후기로 공유해주세요.'}</span>
                              </span>
                            ) : (
                              <span className="text-teal-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                {t.refundRuleTip}
                              </span>
                            )
                          ) : (
                            <span className="text-gray-500 text-xs font-medium">
                              {t.refundedLabel(b.refundAmountKrw || 0)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {b.status === 'CONFIRMED' && (
                            b.travelDate <= todayStr ? (
                              hasBookingBeenReviewed(b.id) ? (
                                <span className="px-3.5 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{lang === 'en' ? 'Review Submitted' : '후기 작성 완료'}</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleWriteReviewForBooking(b)}
                                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>{lang === 'en' ? 'Write Review' : '여행 후기 작성'}</span>
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => openCancelModal(b)}
                                className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 font-bold rounded-xl text-xs transition shadow-sm"
                              >
                                {t.btnCancelCheck}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. 여행사 파트너 대시보드 (Role: AGENCY) */}
        {/* ========================================================================= */}
        {effectiveViewRole === 'AGENCY' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 파트너 현황 배너 */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
              <div>
                <span className="px-3 py-1 bg-white/20 text-indigo-200 rounded-full text-xs font-bold uppercase">
                  {t.agencySpace}
                </span>
                <h2 className="text-2xl font-black mt-2">
                  {getTranslatedAgency(user?.agencyName || '서울투어 익스프레스', lang)}
                </h2>
                <p className="text-xs text-indigo-200 mt-1">
                  Reg No: {user?.businessNumber || '123-45-67890'} | <span className="text-emerald-300 font-bold">{t.agencyStatus}</span>
                </p>
              </div>

              <button
                onClick={openRegisterModal}
                className="px-5 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition flex-shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>{t.btnAddTour}</span>
              </button>
            </div>

            {/* 핵심 재무/정산 지표 카드 (30% 수수료 & 70% 실수령 정산) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* 이번 달 총 판매액 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase">{t.agencyGmvTitle}</span>
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {lang === 'en' ? '$9,576' : '12,450,000원'}
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last month</span>
                </div>
              </div>

              {/* 플랫폼 소개 수수료 (30%) */}
              <div className="bg-white p-6 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold text-rose-600 uppercase">
                    {t.agencyFeeTitle}
                  </span>
                  <Percent className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-black text-rose-600">
                  {lang === 'en' ? '- $2,873' : '- 3,735,000원'}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {t.agencyFeeDesc}
                </div>
              </div>

              {/* 실수령 예정 정산금 (70%) */}
              <div className="bg-white p-6 rounded-2xl border-2 border-indigo-500 shadow-md bg-indigo-50/30">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase">
                    {t.agencyPayoutTitle}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-indigo-700">
                  {lang === 'en' ? '$6,703' : '8,715,000원'}
                </div>
                <div className="mt-2 text-xs text-indigo-900 font-medium">
                  {t.agencyPayoutDesc}
                </div>
              </div>

              {/* 누적 예약 건수 */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-bold uppercase">{t.agencyBookingCount}</span>
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-black text-gray-900">142</div>
                <div className="mt-2 text-xs text-teal-600 font-semibold">
                  Global Travelers: 68 (48%)
                </div>
              </div>

            </div>

            {/* 최근 예약 접수 내역 테이블 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>{t.recentBookings}</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-y border-gray-100">
                    <tr>
                      <th className="py-3 px-4">{t.colBookingNo}</th>
                      <th className="py-3 px-4">{t.colTourTitle}</th>
                      <th className="py-3 px-4">{t.colTraveler}</th>
                      <th className="py-3 px-4">{t.colGuests}</th>
                      <th className="py-3 px-4">{t.colTravelDate}</th>
                      <th className="py-3 px-4">{t.colAmountPayout}</th>
                      <th className="py-3 px-4">{t.colStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-700">#BK-202610-091</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {lang === 'en' ? '[Top Rated] Gyeongbokgung Hanbok & Bukchon Village Private Tour' : '[외국인/내국인 인기] 경복궁 한복 체험 & 북촌 골목 투어'}
                      </td>
                      <td className="py-3.5 px-4">Sarah Jenkins <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">USA</span></td>
                      <td className="py-3.5 px-4">2</td>
                      <td className="py-3.5 px-4 font-medium">2026-10-25</td>
                      <td className="py-3.5 px-4">
                        <span className="text-gray-900 font-bold">{lang === 'en' ? '$84' : '110,000원'}</span>
                        <span className="block text-[11px] text-indigo-600 font-semibold">(Payout: {lang === 'en' ? '$59' : '77,000원'})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-700">#BK-202610-088</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {lang === 'en' ? '[Foreigners Special] K-Pop Hotspots & Street Food Tour' : '[방한 외국인 전용] K-POP 성지 순례 & 홍대 푸드 투어'}
                      </td>
                      <td className="py-3.5 px-4">Kenji Sato <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">JPN</span></td>
                      <td className="py-3.5 px-4">1</td>
                      <td className="py-3.5 px-4 font-medium">2026-10-22</td>
                      <td className="py-3.5 px-4">
                        <span className="text-gray-900 font-bold">{lang === 'en' ? '$53' : '69,000원'}</span>
                        <span className="block text-[11px] text-indigo-600 font-semibold">(Payout: {lang === 'en' ? '$37' : '48,300원'})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. 플랫폼 총괄 관리자 대시보드 (Role: ADMIN) */}
        {/* ========================================================================= */}
        {effectiveViewRole === 'ADMIN' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 관리자 환영 배너 */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
              <div>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold uppercase border border-teal-500/30">
                  {t.adminMaster}
                </span>
                <h2 className="text-2xl font-black mt-2">
                  {t.adminTitle}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {t.adminSub}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold">
                  {t.adminSystemOk}
                </span>
              </div>
            </div>

            {/* 플랫폼 총 수익 및 수수료 30% 집계 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">{t.adminTotalGmv}</div>
                <div className="text-2xl font-black text-gray-900">
                  {lang === 'en' ? '$64,769' : '84,200,000원'}
                </div>
                <div className="mt-2 text-xs text-gray-500">620 Total Bookings</div>
              </div>

              {/* 플랫폼의 핵심 수익: 30% 소개료 */}
              <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-lg border border-teal-700">
                <div className="flex items-center justify-between text-teal-300 mb-2">
                  <span className="text-xs font-bold uppercase">{t.adminNetProfit}</span>
                  <Percent className="w-5 h-5 text-teal-300" />
                </div>
                <div className="text-3xl font-black text-teal-200">
                  {lang === 'en' ? '$19,430' : '25,260,000원'}
                </div>
                <div className="mt-2 text-xs text-teal-300 font-medium">
                  {t.adminNetProfitDesc}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">{t.adminPayoutTotal}</div>
                <div className="text-2xl font-black text-indigo-700">
                  {lang === 'en' ? '$45,338' : '58,940,000원'}
                </div>
                <div className="mt-2 text-xs text-gray-500">18 Partner Agencies</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-gray-500 uppercase mb-2">{t.adminPendingAgencies}</div>
                <div className="text-2xl font-black text-amber-600">
                  {pendingAgencies.filter((a) => a.status === 'PENDING').length}
                </div>
                <div className="mt-2 text-xs text-amber-600 font-semibold">
                  Documents Require Audit
                </div>
              </div>

            </div>

            {/* 신규 여행사 입점 승인 관리 섹션 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    <span>{t.agencyAuditTitle}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t.agencyAuditSub}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-y border-gray-100">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Agency Name</th>
                      <th className="py-3 px-4">Registration No.</th>
                      <th className="py-3 px-4">Representative</th>
                      <th className="py-3 px-4">Document</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingAgencies.map((agency) => (
                      <tr key={agency.id}>
                        <td className="py-3.5 px-4 text-gray-500">{agency.appliedAt}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{agency.name}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">{agency.businessNumber}</td>
                        <td className="py-3.5 px-4">{agency.manager} ({agency.phone})</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => alert(`Document viewed: ${agency.docName}`)}
                            className="inline-flex items-center gap-1 text-teal-600 font-bold hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{agency.docName}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {agency.status === 'PENDING' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApproveAgency(agency.id)}
                                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition"
                              >
                                {t.btnApprove}
                              </button>
                              <button
                                onClick={() => alert('Held.')}
                                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition"
                              >
                                {t.btnHold}
                              </button>
                            </div>
                          ) : (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                              {t.approvedBadge}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
