'use client';

import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { calculateRefund } from '@/lib/refundPolicy';
import { getTranslatedAgency, getTranslatedProductTitle } from '@/lib/translations';
import {
  X,
  Calendar,
  ShieldAlert,
  Users
} from 'lucide-react';

interface CancelRefundModalProps {
  lang: 'ko' | 'en';
}

export default function CancelRefundModal({ lang }: CancelRefundModalProps) {
  const { isCancelModalOpen, closeCancelModal, cancelingBooking, confirmCancelBooking } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 시뮬레이션용 가상 기준일
  const [simulatedOffsetDays, setSimulatedOffsetDays] = useState<number | null>(null);

  if (!isCancelModalOpen || !cancelingBooking) return null;

  // 가상 테스트 기준일 계산
  let testDate = new Date();
  if (simulatedOffsetDays !== null) {
    const [y, m, d] = cancelingBooking.travelDate.split('-').map(Number);
    const targetTravel = new Date(y, m - 1, d);
    targetTravel.setDate(targetTravel.getDate() - simulatedOffsetDays);
    testDate = targetTravel;
  }

  // 정책 계산
  const refundInfo = calculateRefund(
    cancelingBooking.travelDate,
    cancelingBooking.paidAmountKrw,
    testDate
  );

  const t = {
    ko: {
      headerTitle: "예약 취소 및 환불 예상액 확인",
      bookingNo: "예약 번호",
      travelDate: "여행 예정일",
      guests: "명",
      dDayPrior: (days: number) => `여행 시작 D-${days}일 시점`,
      dDayToday: "여행 당일 (D-Day)",
      badgeFull: "100% 전액 환불",
      badgePartial: "50% 부분 환불",
      badgeNone: "환불 불가 (0%)",
      msgFull: `여행 시작 ${refundInfo.daysLeft}일 전 취소 요청으로, 규정에 따라 결제 금액 100% 전액 환불 대상입니다.`,
      msgPartial: `여행 시작 ${refundInfo.daysLeft}일 전 취소 요청으로, 사전 준비비 50% 공제 후 50% 부분 환불 대상입니다.`,
      msgNone: "여행 당일 취소 또는 경과로 환불이 불가합니다.",
      originalPaid: "기존 결제 금액 (원금)",
      penalty: "취소 위약금 / 여행사 준비금",
      finalRefund: "최종 카드 환불 승인액",
      simTitle: "⚡ 시나리오별 환불 로직 검증해보기 (테스트용):",
      sim3Days: "3일 전 이상 (100%)",
      sim1to2Days: "1~2일 전 (50%)",
      simToday: "당일 취소 (0%)",
      closeBtn: "닫기",
      confirmCancelFull: "환불 접수 및 취소 확정",
      confirmCancelNone: "취소 확정 (환불 불가)",
      processing: "환불 처리 중...",
      successMsg: (amt: number, msg: string) => `[취소 처리 완료]\n${msg}\n환불 금액: ${amt.toLocaleString()}원`,
    },
    en: {
      headerTitle: "Cancellation & Refund Estimate",
      bookingNo: "Booking ID",
      travelDate: "Travel Date",
      guests: "guest(s)",
      dDayPrior: (days: number) => `Request at D-${days} Days Prior`,
      dDayToday: "Day of Travel (D-Day)",
      badgeFull: "100% Full Refund",
      badgePartial: "50% Partial Refund",
      badgeNone: "Non-Refundable (0%)",
      msgFull: `Cancellation requested ${refundInfo.daysLeft} days before travel. Eligible for a 100% full refund with zero penalty.`,
      msgPartial: `Cancellation requested ${refundInfo.daysLeft} days before travel. Eligible for 50% partial refund after deducting preliminary expenses.`,
      msgNone: "Cancellations on the day of departure or afterwards are strictly non-refundable.",
      originalPaid: "Original Amount Paid",
      penalty: "Cancellation Fee (Penalty)",
      finalRefund: "Estimated Refund to Card",
      simTitle: "⚡ Test Refund Policy Scenarios (Simulator):",
      sim3Days: "3+ Days Prior (100%)",
      sim1to2Days: "1-2 Days Prior (50%)",
      simToday: "Day of Travel (0%)",
      closeBtn: "Close",
      confirmCancelFull: "Confirm Cancellation & Refund",
      confirmCancelNone: "Confirm Cancellation (No Refund)",
      processing: "Processing Refund...",
      successMsg: (amt: number, msg: string) => `[Cancellation Complete]\n${msg}\nRefund Amount: $${Math.round(amt / 1300)} (${amt.toLocaleString()} KRW)`,
    }
  }[lang];

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    try {
      const customDateStr = simulatedOffsetDays !== null ? testDate.toISOString() : undefined;
      const res = await confirmCancelBooking(cancelingBooking.id, customDateStr);
      alert(t.successMsg(res.refundInfo.refundAmount, lang === 'en' ? (refundInfo.status === 'FULL_REFUND' ? t.msgFull : refundInfo.status === 'PARTIAL_REFUND' ? t.msgPartial : t.msgNone) : res.refundInfo.message));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refundUsd = Math.round(refundInfo.refundAmount / 1300);
  const penaltyUsd = Math.round(refundInfo.penaltyAmount / 1300);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-300" />
            <h3 className="text-base sm:text-lg font-black">
              {t.headerTitle}
            </h3>
          </div>
          <button
            onClick={closeCancelModal}
            className="p-1.5 text-rose-200 hover:text-white hover:bg-rose-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 예약 정보 요약 */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-gray-500">#{cancelingBooking.id}</span>
              <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-md font-bold text-[11px]">
                {getTranslatedAgency(cancelingBooking.agencyName, lang)}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-gray-900">
              {getTranslatedProductTitle(cancelingBooking, lang)}
            </h4>
            <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {t.travelDate}: <strong>{cancelingBooking.travelDate}</strong>
              </span>
              <span><strong>{cancelingBooking.travelersCount} {t.guests}</strong></span>
            </div>
          </div>

          {/* D-Day 계산 결과 및 환불 정책 매칭 배너 */}
          <div className={`p-5 rounded-2xl border ${
            refundInfo.status === 'FULL_REFUND'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : refundInfo.status === 'PARTIAL_REFUND'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {refundInfo.daysLeft > 0 ? t.dDayPrior(refundInfo.daysLeft) : t.dDayToday}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                refundInfo.status === 'FULL_REFUND'
                  ? 'bg-emerald-600 text-white'
                  : refundInfo.status === 'PARTIAL_REFUND'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {refundInfo.status === 'FULL_REFUND' && t.badgeFull}
                {refundInfo.status === 'PARTIAL_REFUND' && t.badgePartial}
                {refundInfo.status === 'NO_REFUND' && t.badgeNone}
              </span>
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              {lang === 'en'
                ? (refundInfo.status === 'FULL_REFUND' ? t.msgFull : refundInfo.status === 'PARTIAL_REFUND' ? t.msgPartial : t.msgNone)
                : refundInfo.message}
            </p>
          </div>

          {/* 환불 정산 명세서 테이블 */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>{t.originalPaid}</span>
              <span className="font-bold text-gray-900">
                {lang === 'en' ? `$${cancelingBooking.paidAmountUsd} (${cancelingBooking.paidAmountKrw.toLocaleString()} KRW)` : `${cancelingBooking.paidAmountKrw.toLocaleString()}원`}
              </span>
            </div>

            <div className="flex justify-between text-rose-600">
              <span>{t.penalty}</span>
              <span className="font-bold">
                - {lang === 'en' ? `$${penaltyUsd} (${refundInfo.penaltyAmount.toLocaleString()} KRW)` : `${refundInfo.penaltyAmount.toLocaleString()}원`}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="font-extrabold text-sm text-gray-900">{t.finalRefund}</span>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-700 block">
                  {lang === 'en' ? `$${refundUsd}` : `${refundInfo.refundAmount.toLocaleString()}원`}
                </span>
                {lang === 'en' && (
                  <span className="text-[10px] text-gray-400">({refundInfo.refundAmount.toLocaleString()} KRW)</span>
                )}
              </div>
            </div>
          </div>

          {/* 초보자 테스트용: 시나리오 강제 변경 버튼 */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1.5">
            <span className="block text-[11px] font-bold text-gray-600 uppercase">
              {t.simTitle}
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSimulatedOffsetDays(5)}
                className={`p-1.5 rounded-lg font-bold border transition ${
                  simulatedOffsetDays === 5
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {t.sim3Days}
              </button>
              <button
                type="button"
                onClick={() => setSimulatedOffsetDays(1)}
                className={`p-1.5 rounded-lg font-bold border transition ${
                  simulatedOffsetDays === 1
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {t.sim1to2Days}
              </button>
              <button
                type="button"
                onClick={() => setSimulatedOffsetDays(0)}
                className={`p-1.5 rounded-lg font-bold border transition ${
                  simulatedOffsetDays === 0
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {t.simToday}
              </button>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeCancelModal}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
            >
              {t.closeBtn}
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl font-extrabold text-xs text-white shadow-lg transition flex items-center gap-1.5 ${
                refundInfo.isCancelable
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                  : 'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              <span>{isSubmitting ? t.processing : (refundInfo.isCancelable ? t.confirmCancelFull : t.confirmCancelNone)}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
