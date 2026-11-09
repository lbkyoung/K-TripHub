import React, { useEffect } from 'react';
import { X, FileText, Building2, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type PolicyTabType = 'terms' | 'agency' | 'privacy' | 'refund';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PolicyTabType;
  lang: 'ko' | 'en';
}

export default function PolicyModal({
  isOpen,
  onClose,
  initialTab = 'terms',
  lang,
}: PolicyModalProps) {
  const { user } = useAuth();
  const isAgencyOrAdmin = user?.role === 'AGENCY' || user?.role === 'ADMIN';

  const [activeTab, setActiveTab] = React.useState<PolicyTabType>(
    initialTab === 'agency' && !isAgencyOrAdmin ? 'terms' : initialTab
  );

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'agency' && !isAgencyOrAdmin) {
        setActiveTab('terms');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab, isOpen, isAgencyOrAdmin]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* 바깥 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 본체 */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 border border-slate-200">
        
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
              KT
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-white">
                {lang === 'ko' ? 'K-TripHub 이용약관 및 운영 정책' : 'K-TripHub Terms & Operating Policies'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ko'
                  ? '투명하고 안전한 여행 생태계를 위한 공정거래 표준 약관 준수'
                  : 'Standard Fair Trade Policies for a Transparent & Secure Travel Ecosystem'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 py-2 gap-2 text-xs sm:text-sm font-medium scrollbar-thin">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-teal-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            {lang === 'ko' ? '서비스 이용약관 (관광객)' : 'Terms of Service (Travelers)'}
          </button>

          {isAgencyOrAdmin && (
            <button
              onClick={() => setActiveTab('agency')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                activeTab === 'agency'
                  ? 'bg-teal-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              {lang === 'ko' ? '여행사 파트너 입점 규약 (정산/수수료)' : 'Agency Partnership Terms (Fees & Settlement)'}
            </button>
          )}

          <button
            onClick={() => setActiveTab('refund')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'refund'
                ? 'bg-teal-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {lang === 'ko' ? '취소 및 환불 규정 (3일 전 100%)' : 'Cancellation & Refund (3 Days 100%)'}
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-teal-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {lang === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
          </button>
        </div>

        {/* 본문 콘텐츠 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="inline-block px-2.5 py-1 bg-teal-50 text-teal-700 font-semibold rounded text-xs mb-2 border border-teal-200">
                  {lang === 'ko' ? '일반 이용자 및 관광객 적용' : 'Applicable to All Travelers & Users'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ko' ? 'K-TripHub 서비스 이용약관' : 'K-TripHub Service Terms of Use'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ko' ? '시행일자: 2026년 1월 1일 | 최종 개정: 2026년 11월' : 'Effective Date: Jan 1, 2026 | Last Updated: Nov 2026'}
                </p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제1조 (목적)' : 'Article 1 (Purpose)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '본 약관은 주식회사 케이 트립허브(이하 "회사")가 운영하는 K-TripHub 웹사이트 및 플랫폼에서 제공하는 국내 로컬 여행 상품 중개 서비스 및 제반 서비스(이하 "서비스")를 이용함에 있어, 회사와 이용자(회원 및 비회원) 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.'
                    : 'These Terms govern the rights, obligations, and responsibilities between K-TripHub Inc. ("Company") and users regarding the domestic travel brokerage services provided on the K-TripHub platform.'}
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제2조 (용어의 정의)' : 'Article 2 (Definitions)'}
                </h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>{lang === 'ko' ? '플랫폼' : 'Platform'}</strong>: {lang === 'ko' ? '회사가 여행 상품 및 로컬 투어 중개 서비스를 제공하기 위해 운영하는 정보통신 시스템.' : 'The information system operated by the Company to provide tour brokerage.'}
                  </li>
                  <li>
                    <strong>{lang === 'ko' ? '관광객(여행자)' : 'Traveler'}</strong>: {lang === 'ko' ? '플랫폼을 통해 여행 상품을 검색, 예약, 결제하고 이용하는 회원.' : 'A registered user who searches, reserves, pays for, and experiences tour packages.'}
                  </li>
                  <li>
                    <strong>{lang === 'ko' ? '여행사 파트너' : 'Agency Partner'}</strong>: {lang === 'ko' ? '관광진흥법상 적법한 여행업 등록 및 보증보험을 갖추고 투어 상품을 직접 기획·운영하는 법인 또는 개인사업자.' : 'A verified licensed travel operator with liability insurance registered on the platform.'}
                  </li>
                </ul>
              </section>

              <section className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 text-teal-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  {lang === 'ko'
                    ? '제3조 (회사의 지위 및 통신판매중개 책임 한계)'
                    : 'Article 3 (Company Status & Brokerage Disclaimer)'}
                </h5>
                <p className="text-slate-600">
                  {lang === 'ko'
                    ? '1. 회사는 전자상거래 등에서의 소비자보호에 관한 법률에 따른 "통신판매중개자"로서, 여행사와 관광객 간의 자유로운 여행 상품 거래를 위한 중개 시스템만을 운영합니다.'
                    : '1. The Company acts as an e-commerce brokerage platform connecting verified local travel agencies with travelers.'}
                </p>
                <p className="text-slate-600">
                  {lang === 'ko'
                    ? '2. 플랫폼에 등록된 투어 일정, 코스, 서비스 품질 및 안전 관리는 해당 상품을 등록한 여행사 파트너가 직접 책임지고 진행하며, 회사는 개별 거래에 대한 판매 당사자가 아닙니다. 단, 회사의 고의 또는 중대한 과실이 있는 경우는 제외합니다.'
                    : '2. Registered travel agencies are solely responsible for tour execution, schedule, and safety. The Company is not the direct party to individual tour contracts.'}
                </p>
              </section>

              <section className="space-y-2 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 text-teal-900">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  {lang === 'ko'
                    ? '제4조 (예약 및 결제, 안심 에스크로 결제 보호)'
                    : 'Article 4 (Booking, Payment & Secure Escrow Protection)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '1. 관광객은 신용카드, 실시간 계좌이체, 소셜 간편결제 등 플랫폼이 제공하는 결제 수단을 통해 여행 대금을 결제합니다.'
                    : '1. Travelers pay for travel bookings via credit card, wire transfer, or digital payment methods provided by the platform.'}
                </p>
                <p>
                  {lang === 'ko'
                    ? '2. [안심 에스크로 보호] 회사는 관광객이 결제한 대금을 투어가 안전하고 정상적으로 종료될 때까지 "안심 에스크로(결제대금 예치 시스템)"를 통해 안전하게 보관·보호합니다.'
                    : '2. [Secure Escrow Protection] The Company securely holds booking payments in an escrow custody system until the travel itinerary is safely completed.'}
                </p>
                <p>
                  {lang === 'ko'
                    ? '3. 여행이 정상적으로 진행 및 종료된 후 회사는 시스템 절차에 따라 해당 여행 서비스의 결제를 최종 확정 처리합니다.'
                    : '3. Upon normal completion of the travel service, the payment transaction is permanently confirmed in accordance with system protocols.'}
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제5조 (취소 및 환불 기준)' : 'Article 5 (Cancellation & Refund Standards)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '관광객의 예약 취소 시 플랫폼의 표준 환불 규정이 적용됩니다:'
                    : 'Standard cancellation and refund rules apply to all traveler cancellations:'}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>{lang === 'ko' ? '여행 시작 3일 전(72시간 전)까지' : '3 Days (72 hrs) prior to tour'}</strong>: <strong>{lang === 'ko' ? '결제 금액 100% 전액 환불' : '100% Full Refund'}</strong></li>
                  <li><strong>{lang === 'ko' ? '여행 시작 2일 전(48시간 전)까지' : '2 Days (48 hrs) prior to tour'}</strong>: {lang === 'ko' ? '결제 금액 50% 환불' : '50% Partial Refund'}</li>
                  <li><strong>{lang === 'ko' ? '여행 시작 1일 전(24시간 전) ~ 당일' : '1 Day prior ~ Tour Day (No-Show)'}</strong>: {lang === 'ko' ? '환불 불가 (0%)' : 'Non-refundable (0%)'}</li>
                  <li><strong>{lang === 'ko' ? '천재지변 또는 여행사 귀책 취소' : 'Force Majeure & Agency Cancellation'}</strong>: {lang === 'ko' ? '기상 악화, 태풍, 모객 미달 등으로 취소 시 100% 즉시 전액 환불' : '100% immediate full refund in case of bad weather, typhoons, or agency cancellations'}</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제6조 (분쟁 해결 및 준거법)' : 'Article 6 (Dispute Resolution & Governing Law)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '본 약관 및 서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국 법률을 준거법으로 하며, 회사의 본사 소재지 관할 법원을 제1심 전속 관할 법원으로 합니다.'
                    : 'Disputes arising out of or related to these Terms and the Services shall be governed by the laws of the Republic of Korea.'}
                </p>
              </section>
            </div>
          )}

          {isAgencyOrAdmin && activeTab === 'agency' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 font-semibold rounded text-xs mb-2 border border-amber-200">
                  {lang === 'ko' ? '🏢 입점 여행사 및 가이드 파트너 전용' : '🏢 Exclusive to Registered Travel Agency & Guide Partners'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ko' ? '여행사 파트너 입점 규약 및 수수료/정산 지침' : 'Agency Partnership Terms & Settlement Policy'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ko' ? '입점비 0원, 월 관리비 0원! 상품 판매 완료 시에만 투명하게 정산' : 'Zero listing fee! 30% platform fee deducted only upon completed tours.'}
                </p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제1조 (목적 및 입점 자격)' : 'Article 1 (Purpose & Onboarding Eligibility)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '본 규약은 K-TripHub 플랫폼에 입점하는 여행사 파트너(이하 "파트너")와 회사 간의 파트너십 권리, 의무, 소개 수수료, 안심 에스크로 정산 방식 및 상생 협력에 관한 기준을 정함을 목적으로 합니다.'
                    : 'This agreement governs partnership terms, platform commission fees, escrow settlements, and mutual cooperation between K-TripHub and registered travel agencies.'}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>{lang === 'ko' ? '관광진흥법에 따른 적법한 일반여행업/국내외여행업 등록증 보유 업체' : 'Valid travel business registration license under the Tourism Promotion Act'}</li>
                  <li>{lang === 'ko' ? '관광객 안전을 위한 관광사업자 영업배상책임보험 또는 기획여행보증보험 가입 필수' : 'Proof of public liability insurance or tour guarantee insurance for traveler safety'}</li>
                </ul>
              </section>

              <section className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <h5 className="font-bold text-amber-900 text-sm sm:text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  {lang === 'ko' ? '제2조 (플랫폼 소개료 및 70% 안전 정산 구조)' : 'Article 2 (Platform Fee & 70% Secure Settlement)'}
                </h5>
                <div className="space-y-2 text-slate-700">
                  <p>
                    <strong>1. {lang === 'ko' ? '입점비 및 월 관리비 전액 면제 (0원)' : 'Zero Listing & Management Fees'}:</strong>{' '}
                    {lang === 'ko'
                      ? '회사는 파트너에게 입점비, 등록비, 월 고정 관리비를 일체 청구하지 않습니다.'
                      : 'The Company charges zero onboarding fees or monthly fixed fees.'}
                  </p>
                  <p>
                    <strong>2. {lang === 'ko' ? '플랫폼 소개 수수료 30%' : 'Platform Brokerage Commission (30%)'}:</strong>{' '}
                    {lang === 'ko'
                      ? '플랫폼 시스템 유지보수, 글로벌 다국어 마케팅, 결제대행(PG) 수수료 지원, 실시간 CS 운영에 대한 대가로 판매 대금의 30%를 공제합니다.'
                      : 'A 30% commission is deducted for platform maintenance, global marketing, PG payment fees, and multilingual customer support.'}
                  </p>
                  <p>
                    <strong>3. {lang === 'ko' ? '안전 정산 70% 계좌 송금' : 'Secure 70% Account Transfer'}:</strong>{' '}
                    {lang === 'ko'
                      ? '투어가 정상적으로 종료된 후 이상이 없는 건에 대해, 총 결제 금액의 70%를 파트너가 등록한 사업자 정산 계좌로 안전하게 송금합니다.'
                      : 'Upon successful completion of the tour, 70% of gross revenue is wired securely to the agency’s registered business bank account.'}
                  </p>
                  <p>
                    <strong>4. {lang === 'ko' ? '정산 주기' : 'Settlement Schedule'}:</strong>{' '}
                    {lang === 'ko'
                      ? '매월 지정 정산일(또는 투어 종료 후 7영업일 이내)에 세금계산서 역발행과 함께 일괄 지급됩니다.'
                      : 'Settlements are processed on designated payout dates (or within 7 business days post-tour) with tax invoice issuance.'}
                  </p>
                </div>
              </section>

              <section className="space-y-2 bg-red-50 p-4 rounded-xl border border-red-200">
                <h5 className="font-bold text-red-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제3조 (직거래 유도 금지 및 패널티)' : 'Article 3 (Prohibition of Direct Transactions)'}
                </h5>
                <p className="text-red-700">
                  {lang === 'ko'
                    ? '파트너는 K-TripHub를 통해 연결된 관광객에게 수수료 회피 목적의 현장 직거래나 플랫폼 외 별도 결제를 유도할 수 없으며, 적발 시 입점 즉시 영구 영구 제명 및 손해배상 청구가 진행될 수 있습니다.'
                    : 'Partners may not induce travelers met through K-TripHub to make direct off-platform payments to evade platform fees. Violations will result in immediate termination and penalty claims.'}
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '제4조 (안전 관리 및 파트너의 법적 책임)' : 'Article 4 (Safety Management & Partner Liability)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '파트너는 등록한 여행 코스를 성실히 이행해야 하며, 투어 진행 중 발생하는 차량 사고, 상해, 분실 등 안전사고에 대해 가입된 영업배상보험을 통해 1차적 보상 및 사고 수습 책임을 집니다.'
                    : 'Partners are solely responsible for executing travel itineraries safely and must maintain liability coverage for vehicular, personal injury, and loss incidents.'}
                </p>
              </section>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded text-xs mb-2 border border-blue-200">
                  {lang === 'ko' ? '표준 환불 보장제' : 'Fair Refund Guarantee'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ko' ? '취소 및 환불 상세 규정 (3일 전 100% 환불)' : 'Detailed Cancellation & Refund Policy'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ko' ? '여행자와 파트너 모두가 안심할 수 있는 합리적인 환불 규정' : 'Transparent refund rules protecting both travelers and tour agencies'}
                </p>
              </div>

              {/* 환불 일정 표 */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-800 font-semibold">
                    <tr>
                      <th className="p-3 border-b">{lang === 'ko' ? '취소 요청 시점' : 'Cancellation Timing'}</th>
                      <th className="p-3 border-b">{lang === 'ko' ? '환불율' : 'Refund Rate'}</th>
                      <th className="p-3 border-b">{lang === 'ko' ? '위약금 및 설명' : 'Penalty & Note'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-emerald-50/50">
                      <td className="p-3 font-semibold text-emerald-800">{lang === 'ko' ? '여행 개시 3일 전 (D-3) 24:00까지' : 'Up to 3 Days prior (D-3, 24:00)'}</td>
                      <td className="p-3 font-bold text-emerald-600 text-base">{lang === 'ko' ? '100% 전액 환불' : '100% Full Refund'}</td>
                      <td className="p-3 text-slate-600">{lang === 'ko' ? '취소 위약금 0원, 카드 승인 즉시 취소' : 'Zero penalty, instant card cancellation'}</td>
                    </tr>
                    <tr className="bg-amber-50/40">
                      <td className="p-3 font-semibold text-amber-800">{lang === 'ko' ? '여행 개시 2일 전 (D-2) 24:00까지' : 'Up to 2 Days prior (D-2, 24:00)'}</td>
                      <td className="p-3 font-bold text-amber-600 text-base">{lang === 'ko' ? '50% 부분 환불' : '50% Refund'}</td>
                      <td className="p-3 text-slate-600">{lang === 'ko' ? '여행사 예약 및 차량 사전 준비금 50% 공제' : '50% deduction for agency preparation costs'}</td>
                    </tr>
                    <tr className="bg-rose-50/40">
                      <td className="p-3 font-semibold text-rose-800">{lang === 'ko' ? '여행 개시 1일 전 (D-1) ~ 당일 / No-Show' : '1 Day prior ~ Tour Day / No-Show'}</td>
                      <td className="p-3 font-bold text-rose-600 text-base">{lang === 'ko' ? '환불 불가 (0%)' : 'Non-refundable (0%)'}</td>
                      <td className="p-3 text-slate-600">{lang === 'ko' ? '예약 마감 및 당일 노쇼로 인한 환불 불가' : 'No refund due to same-day no-shows and booking locks'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <section className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '천재지변 및 불가항력 사유로 인한 취소' : 'Cancellations Due to Force Majeure'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '태풍, 폭우, 지진 등 기상청 특보 발령 또는 천재지변으로 인해 투어 진행이 불가능한 경우, 취소 시점과 관계없이 100% 전액 환불 처리됩니다.'
                    : 'If tour execution becomes impossible due to severe weather warnings (typhoons, heavy storms) or natural disasters, 100% full refund is issued regardless of timing.'}
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '여행사 사정에 의한 취소 (최소 인원 미달 등)' : 'Agency-Initiated Cancellations (Minimum Capacity Not Met)'}
                </h5>
                <p>
                  {lang === 'ko'
                    ? '모객 최소 인원 미달 등으로 여행사가 투어를 취소하는 경우, 여행 출발 최소 3일 전까지 관광객에게 안내되어야 하며, 결제 대금은 100% 전액 즉시 환불됩니다.'
                    : 'If an agency cancels a tour due to unmet minimum headcounts, travelers must be notified at least 3 days prior, and 100% full refunds are issued immediately.'}
                </p>
              </section>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="inline-block px-2.5 py-1 bg-teal-50 text-teal-700 font-semibold rounded text-xs mb-2 border border-teal-200">
                  {lang === 'ko' ? '개인정보 보호법 준수' : 'Personal Data Protection'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ko' ? 'K-TripHub 개인정보 처리방침' : 'K-TripHub Privacy Policy'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ko' ? '개인정보보호책임자: 홍길동 (privacy@ktriphub.com)' : 'Privacy Officer: K-TripHub Privacy Team (privacy@ktriphub.com)'}
                </p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '1. 수집하는 개인정보 항목' : '1. Collected Personal Information'}
                </h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>{lang === 'ko' ? '필수 항목' : 'Required'}</strong>: {lang === 'ko' ? '이름, 이메일 주소, 비밀번호(암호화), 연락처(휴대폰 번호)' : 'Name, email address, encrypted password, phone number'}</li>
                  <li><strong>{lang === 'ko' ? '예약 및 결제 시' : 'Upon Booking'}</strong>: {lang === 'ko' ? '참가 인원수, 여행자 영문명, 카드사명/승인번호, 픽업 희망 장소' : 'Guest counts, traveler names, card payment auth tokens, pickup locations'}</li>
                  <li><strong>{lang === 'ko' ? '여행사 파트너 입점 시' : 'Upon Agency Registration'}</strong>: {lang === 'ko' ? '상호명, 사업자등록번호, 대표자명, 정산 계좌정보, 관광사업등록증' : 'Company name, business reg number, representative name, settlement bank info, tourism license'}</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '2. 개인정보의 수집 및 이용 목적' : '2. Purpose of Collection and Use'}
                </h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>{lang === 'ko' ? '회원 식별 및 서비스 제공, 투어 예약 내역 확인 및 바우처 전송' : 'User authentication, tour booking management, and voucher dispatch'}</li>
                  <li>{lang === 'ko' ? '안심 에스크로 결제 대금 정산 및 취소·환불 처리' : 'Secure escrow payment settlement, cancellation, and refund execution'}</li>
                  <li>{lang === 'ko' ? '고객 불만 접수 및 분쟁 조정을 위한 기록 보존' : 'Customer inquiry resolution and dispute mediation'}</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '3. 개인정보의 제3자 제공' : '3. Provision of Information to Third Parties'}
                </h5>
                <p className="text-slate-600">
                  {lang === 'ko'
                    ? '회사는 원활한 여행 서비스 제공을 위해 관광객의 동의 하에 예약이 성사된 해당 로컬 여행사 파트너에게 여행자 성명, 연락처, 예약 인원 정보를 제공하며, 해당 정보는 투어 진행 목적으로만 이용됩니다.'
                    : 'With traveler consent, the Company shares necessary traveler details (name, contact, party size) with the assigned local agency exclusively for tour operation.'}
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  {lang === 'ko' ? '4. 보유 및 이용 기간' : '4. Retention and Use Period'}
                </h5>
                <p className="text-slate-600">
                  {lang === 'ko'
                    ? '원칙적으로 회원 탈퇴 시 지체 없이 파기합니다. 단, 전자상거래법 등 관련 법령에 의하여 보존할 필요가 있는 경우 계약/청약철회 기록 5년, 대금결제 기록 5년간 안전하게 분리 보관합니다.'
                    : 'Personal data is destroyed upon account deletion. However, transaction and payment records are preserved for 5 years as required by e-commerce laws.'}
                </p>
              </section>
            </div>
          )}
        </div>

        {/* 하단 닫기 바 */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500 hidden sm:block">
            {lang === 'ko'
              ? '궁금한 점이 있으신가요? 고객지원센터 1588-0000 / support@ktriphub.com'
              : 'Have questions? Contact Support: 1588-0000 / support@ktriphub.com'}
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-xs sm:text-sm transition shadow-sm"
          >
            {lang === 'ko' ? '확인 및 닫기' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
