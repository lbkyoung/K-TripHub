'use client';

import React, { useState } from 'react';
import { Globe, User, Building2, Menu, X, LogOut, Shield, Compass, BarChart3, PackagePlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  lang: 'ko' | 'en';
  onToggleLang: () => void;
  showDashboard: boolean;
  onToggleDashboard: () => void;
}

export default function Navbar({ lang, onToggleLang, showDashboard, onToggleDashboard }: NavbarProps) {
  const { user, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLang = lang === 'en' ? 'en' : 'ko';
  const t = {
    ko: {
      navTours: "추천 투어",
      navDest: "인기 여행지",
      navRefund: "취소·환불 규정",
      navGuide: "고객 안내",
      partnerBtn: "여행사 입점 문의",
      login: "로그인 / 회원가입",
      logout: "로그아웃",
      myBookings: "내 예약",
      manageProducts: "상품 관리",
      settlement: "정산 (70%)",
      adminPanel: "관리자 센터",
      dashboardBtn: showDashboard ? "홈 화면 보기" : "📊 통합 대시보드",
      langText: "ENG",
    },
    en: {
      navTours: "Featured Tours",
      navDest: "Destinations",
      navRefund: "Refund Policy",
      navGuide: "Support",
      partnerBtn: "For Travel Agencies",
      login: "Log in / Sign up",
      logout: "Log out",
      myBookings: "My Trips",
      manageProducts: "Manage Tours",
      settlement: "Settlement (70%)",
      adminPanel: "Admin Panel",
      dashboardBtn: showDashboard ? "View Home" : "📊 Dashboard",
      langText: "한국어",
    }
  }[currentLang];

  // 부드러운 스크롤 이동 함수 (안전 가드 추가)
  const handleScrollTo = (id: string) => {
    if (typeof window === 'undefined') return;
    if (showDashboard) onToggleDashboard();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          
          {/* 1. 로고 (모바일/PC 반응형 크기 최적화) */}
          <div
            onClick={() => { if (showDashboard) onToggleDashboard(); }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 flex-shrink-0">
              <span className="font-black text-lg sm:text-xl tracking-tighter">KT</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                K-TripHub
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                {lang === 'ko' ? '로컬 여행사 직거래 플랫폼' : 'Korea Travel Partner'}
              </span>
            </div>
          </div>

          {/* 2. 중앙 핵심 메뉴 네비게이션 (1안 적용) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-slate-50/80 p-1 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => handleScrollTo('tours-section')}
              className="px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50 cursor-pointer active:scale-95"
            >
              {t.navTours}
            </button>
            <button
              onClick={() => handleScrollTo('hero-search-section')}
              className="px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50 cursor-pointer active:scale-95"
            >
              {t.navDest}
            </button>
            <button
              onClick={() => handleScrollTo('refund-section')}
              className="px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50 cursor-pointer active:scale-95"
            >
              {t.navRefund}
            </button>
            <button
              onClick={() => handleScrollTo('footer-section')}
              className="px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50 cursor-pointer active:scale-95"
            >
              {t.navGuide}
            </button>
          </nav>

          {/* 3. 대시보드 빠른 바로가기 버튼 */}
          <button
            onClick={onToggleDashboard}
            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${
              showDashboard
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/80'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-teal-600" />
            <span>{t.dashboardBtn}</span>
          </button>

          {/* 4. 우측 액션 버튼들 */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* 언어 선택 토글 버튼 */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all border border-slate-200/80 active:scale-95 cursor-pointer"
              title="언어 전환 / Language toggle"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.langText}</span>
            </button>

            {/* A. 로그인하지 않은 상태 */}
            {!user && (
              <>
                <button
                  onClick={() => openAuthModal('register', 'AGENCY')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.partnerBtn}</span>
                </button>

                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{t.login}</span>
                </button>
              </>
            )}

            {/* B. 로그인된 상태: 역할(Role)별 맞춤 UI */}
            {user && (
              <div className="flex items-center gap-2">
                {/* 1) 일반 관광객(TOURIST)인 경우 */}
                {user.role === 'TOURIST' && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-bold text-teal-900 leading-tight">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-teal-600 font-semibold">
                          {lang === 'ko' ? '일반 관광객' : 'Tourist'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onToggleDashboard}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      {t.myBookings}
                    </button>
                  </>
                )}

                {/* 2) 여행사 파트너(AGENCY)인 경우 */}
                {user.role === 'AGENCY' && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <div className="text-left">
                        <span className="block text-xs font-bold text-indigo-900 leading-tight">
                          {user.agencyName || user.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-indigo-600 font-semibold">
                            {lang === 'ko' ? '입점 여행사' : 'Agency Partner'}
                          </span>
                          {user.isVerified ? (
                            <span className="text-[9px] px-1 bg-emerald-100 text-emerald-700 rounded font-bold">
                              {lang === 'ko' ? '승인' : 'Approved'}
                            </span>
                          ) : (
                            <span className="text-[9px] px-1 bg-amber-100 text-amber-700 rounded font-bold">
                              {lang === 'ko' ? '심사대기' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onToggleDashboard}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100/60 hover:bg-indigo-100 rounded-lg transition"
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      <span>{t.manageProducts}</span>
                    </button>

                    <button
                      onClick={onToggleDashboard}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{t.settlement}</span>
                    </button>
                  </>
                )}

                {/* 3) 플랫폼 총괄 관리자(ADMIN)인 경우 */}
                {user.role === 'ADMIN' && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-sm">
                      <Shield className="w-4 h-4 text-teal-400" />
                      <div className="text-left">
                        <span className="block text-xs font-bold leading-tight">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-teal-300 font-semibold">
                          {lang === 'ko' ? '총괄 관리자' : 'Platform Admin'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onToggleDashboard}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.adminPanel}</span>
                    </button>
                  </>
                )}

                {/* 로그아웃 버튼 */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 p-2 text-xs font-medium text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="로그아웃 / Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.logout}</span>
                </button>
              </div>
            )}
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleDashboard}
              className="p-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg"
            >
              📊 대시보드
            </button>
            <button
              onClick={onToggleLang}
              className="p-2 text-xs font-bold text-gray-700 border border-gray-200 rounded-lg flex items-center gap-1"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              {t.langText}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* 모바일 햄버거 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 space-y-3">
            {/* 모바일 핵심 메뉴 4종 그리드 */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { setMobileMenuOpen(false); handleScrollTo('tours-section'); }}
                className="py-2.5 px-3 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-center transition-colors"
              >
                {t.navTours}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleScrollTo('hero-search-section'); }}
                className="py-2.5 px-3 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-center transition-colors"
              >
                {t.navDest}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleScrollTo('refund-section'); }}
                className="py-2.5 px-3 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-center transition-colors"
              >
                {t.navRefund}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleScrollTo('footer-section'); }}
                className="py-2.5 px-3 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 rounded-lg text-center transition-colors"
              >
                {t.navGuide}
              </button>
            </div>

            <button
              onClick={() => { setMobileMenuOpen(false); onToggleDashboard(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>{t.dashboardBtn}</span>
            </button>

            {!user ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('register', 'AGENCY'); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
                >
                  <Building2 className="w-4 h-4" />
                  {t.partnerBtn}
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  {t.login}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">{user.agencyName || user.name}</span>
                    <span className="text-xs text-gray-500">[{user.role}] {user.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-xs text-rose-600 font-bold bg-white border border-rose-200 rounded-lg"
                  >
                    {t.logout}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
