'use client';

import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { getTranslatedAgency } from '@/lib/translations';
import {
  X,
  CreditCard,
  ShieldCheck,
  Calendar,
  Users,
  Lock,
  Globe,
  Smartphone
} from 'lucide-react';

interface BookingPaymentModalProps {
  lang: 'ko' | 'en';
}

export default function BookingPaymentModal({ lang }: BookingPaymentModalProps) {
  const { isPaymentModalOpen, closePaymentModal, paymentTarget, createBooking } = useBooking();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'CARD_DOMESTIC' | 'CARD_GLOBAL' | 'KAKAOPAY' | 'TOSSPAY'>('CARD_GLOBAL');
  const [buyerName, setBuyerName] = useState(user?.name || (lang === 'en' ? 'Sarah Jenkins' : '김여행'));
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'traveler@ktriphub.com');
  const [buyerPhone, setBuyerPhone] = useState(user?.phoneNumber || '+1-202-555-0192');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPaymentModalOpen || !paymentTarget) return null;

  const { product, travelDate, travelersCount } = paymentTarget;
  const totalKrw = product.priceKrw * travelersCount;
  const totalUsd = product.priceUsd * travelersCount;

  const t = {
    ko: {
      pgSub: "PortOne / TossPayments 결제 테스트",
      title: "안심 카드 결제 및 예약 확정",
      travelerInfo: "예약자 정보 (바우처 전송)",
      name: "성명",
      email: "이메일",
      phone: "연락처",
      selectMethod: "결제 수단 선택",
      methodDomestic: "국내 신용카드",
      methodGlobal: "해외카드 (Visa/Master)",
      methodKakao: "카카오페이",
      methodToss: "토스페이",
      termsTitle: "취소 및 환불 약관 동의 (필수):",
      term1: "여행 3일 전까지 취소 시: 100% 전액 환불",
      term2: "여행 2일 ~ 1일 전 취소 시: 50% 부분 환불",
      term3: "여행 당일 취소 및 노쇼: 환불 불가 (0%)",
      totalLabel: "총 결제 승인 금액",
      payBtn: "테스트 결제 승인",
      processing: "승인 처리 중...",
      guests: "명",
      successMsg: `🎉 [결제 및 예약 완료!]\n승인 번호: imp_test_${Date.now()}\n금액: ${totalKrw.toLocaleString()}원\n\n상단 [📊 통합 대시보드] > [관광객 마이페이지]에서 예약 내역과 취소/환불 시뮬레이션을 확인하실 수 있습니다.`,
    },
    en: {
      pgSub: "PortOne / TossPayments Test PG",
      title: "Secure Checkout & Instant Confirmation",
      travelerInfo: "Lead Traveler Details (For Voucher)",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      selectMethod: "Select Payment Method",
      methodDomestic: "Korean Local Card",
      methodGlobal: "Global Card (Visa / Master)",
      methodKakao: "KakaoPay",
      methodToss: "TossPay",
      termsTitle: "Cancellation & Refund Terms (Required):",
      term1: "Cancel up to 3 days prior: 100% Full Refund",
      term2: "Cancel 2 to 1 days prior: 50% Partial Refund",
      term3: "Day of travel / No-show: Non-refundable (0%)",
      totalLabel: "Total Amount to Pay",
      payBtn: "Approve Test Payment",
      processing: "Processing...",
      guests: "Guest(s)",
      successMsg: `🎉 [Booking & Payment Completed!]\nAuth Code: imp_test_${Date.now()}\nAmount: $${totalUsd} (${totalKrw.toLocaleString()} KRW)\n\nYou can view your booking details and refund estimates under [📊 Dashboard] > [Tourist View].`,
    }
  }[lang];

  // 결제 승인 처리
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      await createBooking({
        productId: product.id,
        productTitle: lang === 'ko' ? product.titleKo : product.titleEn,
        productTitleKo: product.titleKo,
        productTitleEn: product.titleEn,
        productImage: product.imageUrl,
        agencyName: product.agencyName,
        agencyNameEn: getTranslatedAgency(product.agencyName, 'en'),
        travelerName: buyerName,
        travelerEmail: buyerEmail,
        travelerPhone: buyerPhone,
        travelDate,
        travelersCount,
        paidAmountKrw: totalKrw,
        paidAmountUsd: totalUsd,
        paymentMethod,
        paymentId: `imp_test_${Date.now()}`,
      });

      setIsProcessing(false);
      alert(t.successMsg);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-800 text-white">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-300" />
            <div>
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider block">
                {t.pgSub}
              </span>
              <h3 className="text-base sm:text-lg font-black">
                {t.title}
              </h3>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 폼 */}
        <form onSubmit={handlePaymentSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 예약 상품 요약 */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <img
              src={product.imageUrl}
              alt="thumbnail"
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-teal-700 block">
                {getTranslatedAgency(product.agencyName, lang)}
              </span>
              <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-2">
                {lang === 'ko' ? product.titleKo : product.titleEn}
              </h4>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <strong>{travelDate}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <strong>{travelersCount} {t.guests}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 예약자 / 결제자 정보 입력 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>{t.travelerInfo}</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">{t.name}</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">{t.email}</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">{t.phone}</label>
                <input
                  type="text"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* 결제 수단 선택 (국내/해외/간편결제) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t.selectMethod}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD_GLOBAL')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'CARD_GLOBAL'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-800 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-5 h-5 text-blue-600" />
                <span>{t.methodGlobal}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD_DOMESTIC')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'CARD_DOMESTIC'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-800 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-teal-600" />
                <span>{t.methodDomestic}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('KAKAOPAY')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'KAKAOPAY'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base font-black">💬</span>
                <span>{t.methodKakao}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('TOSSPAY')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'TOSSPAY'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-blue-500" />
                <span>{t.methodToss}</span>
              </button>
            </div>
          </div>

          {/* 환불 규정 약관 동의 안내 */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-800">
              <ShieldCheck className="w-4 h-4" />
              {t.termsTitle}
            </span>
            <ul className="text-[11px] text-amber-900 space-y-0.5 pl-5 list-disc">
              <li>{t.term1}</li>
              <li>{t.term2}</li>
              <li>{t.term3}</li>
            </ul>
          </div>

          {/* 최종 결제 금액 요약 및 결제 버튼 */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-400 block">{t.totalLabel}</span>
              <span className="text-2xl font-black text-teal-700">
                {lang === 'ko' ? `${totalKrw.toLocaleString()}원` : `$${totalUsd}`}
              </span>
              {lang === 'en' && (
                <span className="block text-[10px] text-gray-400">approx. {totalKrw.toLocaleString()} KRW</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/30 transition text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? t.processing : t.payBtn}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
