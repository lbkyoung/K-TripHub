import React, { useState } from 'react';
import { Phone, Mail, ShieldCheck, FileText, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PolicyModal, { PolicyTabType } from './PolicyModal';

interface FooterProps {
  lang: 'ko' | 'en';
}

export default function Footer({ lang }: FooterProps) {
  const { user } = useAuth();
  const isAgencyOrAdmin = user?.role === 'AGENCY' || user?.role === 'ADMIN';

  const [policyModalTab, setPolicyModalTab] = useState<PolicyTabType | null>(null);

  const openPolicy = (tab: PolicyTabType) => (e: React.MouseEvent) => {
    e.preventDefault();
    setPolicyModalTab(tab);
  };

  return (
    <>
      <footer id="footer-section" className="bg-slate-900 text-gray-400 text-xs border-t border-slate-800 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* 상단 4단 컬럼 링크 (모바일 1열, 태블릿 2열, PC 4열 최적화) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            {/* 브랜드 소개 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
                  KT
                </div>
                <span className="text-white font-bold text-base">K-TripHub</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                {lang === 'ko'
                  ? '한국의 우수한 로컬 여행사와 전 세계 관광객을 직접 잇는 국내 여행 전문 매칭 플랫폼입니다.'
                  : 'Direct matching platform connecting verified local Korean travel agencies with global travelers.'}
              </p>
            </div>

            {/* 고객센터 안내 */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-teal-400" />
                {lang === 'ko' ? '고객 지원 센터' : 'Customer Support'}
              </h4>
              <p className="text-lg font-bold text-white mb-1">1588-0000</p>
              <p className="text-gray-400">
                {lang === 'ko' ? '운영시간: 평일 09:00 ~ 18:00 (주말/공휴일 휴무)' : 'Mon-Fri: 09:00 ~ 18:00 (KST)'}
              </p>
              <p className="text-gray-400 flex items-center gap-1 mt-1">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                support@ktriphub.com
              </p>
            </div>

            {/* 약관 및 정책 */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                {lang === 'ko' ? '이용약관 및 정책' : 'Terms & Policies'}
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={openPolicy('terms')}
                    className="hover:text-white transition text-left cursor-pointer text-gray-300 hover:underline"
                  >
                    {lang === 'ko' ? '서비스 이용약관' : 'Terms of Service'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={openPolicy('privacy')}
                    className="hover:text-teal-300 transition font-medium text-teal-400 text-left cursor-pointer hover:underline"
                  >
                    {lang === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={openPolicy('refund')}
                    className="hover:text-white transition text-left cursor-pointer text-gray-300 hover:underline"
                  >
                    {lang === 'ko' ? '취소 및 환불 규정 (3일 전 100%)' : 'Cancellation & Refund Terms'}
                  </button>
                </li>
                {isAgencyOrAdmin && (
                  <li>
                    <button
                      onClick={openPolicy('agency')}
                      className="hover:text-white transition text-left cursor-pointer text-amber-300/90 hover:underline"
                    >
                      {lang === 'ko' ? '여행사 파트너 입점 규약' : 'Agency Partnership Terms'}
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* 4번째 열: 여행사/관리자에게는 상생안내, 관광객에게는 안심예약 안내 표시 */}
            {isAgencyOrAdmin ? (
              <div>
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  {lang === 'ko' ? '여행사 파트너 상생 안내' : 'For Agencies'}
                </h4>
                <p className="text-xs leading-relaxed text-gray-400">
                  {lang === 'ko'
                    ? '입점비 및 월 관리비 0원! 상품 판매 완료 시에만 소개료 30%를 공제하며 안전하게 70%를 정산해 드립니다.'
                    : 'Zero listing fee! 30% platform fee deducted only upon successful bookings. 70% paid securely to agencies.'}
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  {lang === 'ko' ? '안심 여행 보장 안내' : 'Safe Travel Guarantee'}
                </h4>
                <p className="text-xs leading-relaxed text-gray-400">
                  {lang === 'ko'
                    ? '검증된 정식 등록 로컬 여행사만 입점하여 안전한 투어를 보장합니다. 전 상품 안심 에스크로 보호 및 3일 전 100% 환불을 약속합니다.'
                    : 'Only certified and verified local agencies are onboarded. Full escrow custody & 100% refund up to 3 days prior guaranteed.'}
                </p>
              </div>
            )}

          </div>

        {/* 하단 사업자 등록 정보 및 책임 한계 고지 */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-400 text-[11px]">
          <div>
            <p>
              {lang === 'ko'
                ? '(주)케이 트립허브 | 대표: 대표자명 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2026-서울강남-0000호'
                : 'K-TripHub Inc. | CEO: Leader | Business Reg: 123-45-67890 | E-Commerce License: 2026-SeoulGangnam-0000'}
            </p>
            <p className="mt-1">
              {lang === 'ko'
                ? '주소: 서울특별시 강남구 테헤란로 123, 트립타워 5층 | 개인정보보호책임자: 홍길동 (privacy@ktriphub.com)'
                : 'Address: 5F Trip Tower, 123 Teheran-ro, Gangnam-gu, Seoul, Korea | Privacy Officer: K-TripHub Privacy Team (privacy@ktriphub.com)'}
            </p>
            <p className="mt-1 text-gray-400">
              {lang === 'ko'
                ? '※ (주)케이 트립허브는 통신판매중개자로서 통신판매의 당사자가 아니며, 입점 여행사가 등록한 여행 상품 및 거래에 대하여 책임을 지지 않습니다.'
                : '※ K-TripHub is a communications broker and is not a party to mail-order sales. The registered agencies are solely responsible for the tours.'}
            </p>
          </div>

          <p className="text-gray-400 flex-shrink-0">
            © 2026 K-TripHub Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>

    {/* 이용약관, 파트너 입점 규약, 환불규정, 개인정보 처리방침 모달 */}
    <PolicyModal
      isOpen={policyModalTab !== null}
      onClose={() => setPolicyModalTab(null)}
      initialTab={policyModalTab || 'terms'}
      lang={lang}
    />
  </>
  );
}
