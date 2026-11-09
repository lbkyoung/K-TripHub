'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { TourProvider } from '@/context/TourContext';
import { BookingProvider } from '@/context/BookingContext';
import { ReviewProvider } from '@/context/ReviewContext';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import ProductSection from '@/components/ProductSection';
import RefundPolicyBanner from '@/components/RefundPolicyBanner';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import DashboardView from '@/components/DashboardView';
import ProductRegisterModal from '@/components/ProductRegisterModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import BookingPaymentModal from '@/components/BookingPaymentModal';
import CancelRefundModal from '@/components/CancelRefundModal';
import WriteReviewModal from '@/components/WriteReviewModal';

export default function Home() {
  // 사용자가 처음 접속 시 영문(en) 모드로 시작하도록 기본값 설정
  const [lang, setLang] = useState<'ko' | 'en'>('en');
  // 홈 화면을 기본으로 표시하고 상단 '📊 통합 대시보드' 버튼으로 언제든 토글 가능
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  const toggleDashboard = () => {
    setShowDashboard((prev) => !prev);
  };

  return (
    <AuthProvider>
      <TourProvider>
        <BookingProvider>
          <ReviewProvider>
            <main className="min-h-screen flex flex-col bg-white">
              {/* 1. 상단 네비게이션 바 (대시보드 전환 토글 버튼 포함) */}
              <Navbar
                lang={lang}
                onToggleLang={toggleLanguage}
                showDashboard={showDashboard}
                onToggleDashboard={toggleDashboard}
              />

              {/* 2. 대시보드 모드 vs 일반 홈 메인화면 조건부 렌더링 */}
              {showDashboard ? (
                <DashboardView lang={lang} onClose={toggleDashboard} />
              ) : (
                <>
                  {/* 메인 배너 (슬라이더 & 퀵 서치) */}
                  <HeroBanner lang={lang} />

                  {/* 추천 여행 상품 카드 섹션 (카드를 클릭하면 상세 페이지가 열림) */}
                  <ProductSection lang={lang} />

                  {/* 취소 및 환불 규정 상세 배너 (3일 전 100%, 2~1일 전 50%, 당일 0%) */}
                  <RefundPolicyBanner lang={lang} />
                </>
              )}

              {/* 3. 하단 Footer (사업자 정보, 고객센터, 이용약관) */}
              <Footer lang={lang} />

              {/* 4. 로그인 및 회원가입 모달 (관광객 / 여행사 파트너) */}
              <AuthModal lang={lang} />

              {/* 5. 여행사 상품 등록 모달/페이지 */}
              <ProductRegisterModal lang={lang} />

              {/* 6. 관광객용 상품 상세 페이지 모달 */}
              <ProductDetailModal lang={lang} />

              {/* 7. 카드 결제 모달 (포트원/토스페이먼츠 연동) */}
              <BookingPaymentModal lang={lang} />

              {/* 8. 예약 취소 및 환불 예상액 확인 팝업 (핵심 정책 시뮬레이터) */}
              <CancelRefundModal lang={lang} />

              {/* 9. 5단계: 여행 후기(리뷰) 작성 모달 */}
              <WriteReviewModal lang={lang} />
            </main>
          </ReviewProvider>
        </BookingProvider>
      </TourProvider>
    </AuthProvider>
  );
}
