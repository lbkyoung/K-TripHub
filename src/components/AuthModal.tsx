'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User, Building2, Phone, FileUp, CheckCircle, Shield } from 'lucide-react';
import { UserRole } from '@/lib/types';

interface AuthModalProps {
  lang: 'ko' | 'en';
}

export default function AuthModal({ lang }: AuthModalProps) {
  const {
    isAuthModalOpen,
    closeAuthModal,
    modalInitialTab,
    modalInitialRole,
    login,
    loginWithSocial,
    registerTourist,
    registerAgency,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [roleTab, setRoleTab] = useState<'TOURIST' | 'AGENCY'>('TOURIST');

  // 로그인 폼 상태
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // 관광객 가입 폼 상태
  const [touristName, setTouristName] = useState('');
  const [touristEmail, setTouristEmail] = useState('');
  const [touristPass, setTouristPass] = useState('');
  const [touristPassConfirm, setTouristPassConfirm] = useState('');

  // 여행사 가입 폼 상태
  const [agencyName, setAgencyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPass, setAgencyPass] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);

  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 열릴 때 초기 탭 동기화
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(modalInitialTab);
      setRoleTab(modalInitialRole);
      setStatusMsg('');
      setIsSubmitting(false);
    }
  }, [isAuthModalOpen, modalInitialTab, modalInitialRole]);

  if (!isAuthModalOpen) return null;

  // 로그인 처리
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      setStatusMsg(lang === 'ko' ? '이메일과 비밀번호를 입력해 주세요.' : 'Please enter email and password.');
      return;
    }
    setIsSubmitting(true);
    setStatusMsg('');
    try {
      const res = await login(loginEmail, loginPass);
      if (!res.success && res.message) {
        setStatusMsg(res.message);
      }
    } catch (err: any) {
      setStatusMsg(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 소셜 로그인 처리 (구글/카카오)
  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setIsSubmitting(true);
    setStatusMsg('');
    try {
      const res = await loginWithSocial(provider);
      if (!res.success && res.message) {
        setStatusMsg(res.message);
      }
    } catch (err: any) {
      setStatusMsg(err.message || '소셜 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 관광객 회원가입
  const handleTouristRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!touristName || !touristEmail || !touristPass) {
      setStatusMsg(lang === 'ko' ? '모든 필수 항목을 입력해 주세요.' : 'Please fill in all fields.');
      return;
    }
    if (touristPass.length < 6) {
      setStatusMsg(lang === 'ko' ? '비밀번호는 최소 6자 이상으로 설정해 주세요.' : 'Password must be at least 6 characters.');
      return;
    }
    if (touristPass !== touristPassConfirm) {
      setStatusMsg(lang === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    setStatusMsg('');
    try {
      const res = await registerTourist({
        name: touristName,
        email: touristEmail,
        pass: touristPass,
      });
      if (!res.success && res.message) {
        setStatusMsg(res.message);
      }
    } catch (err: any) {
      setStatusMsg(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 여행사 파트너 회원가입
  const handleAgencyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !businessNumber || !managerName || !managerPhone || !agencyEmail || !agencyPass) {
      setStatusMsg(lang === 'ko' ? '모든 필수 정보를 입력해 주세요.' : 'Please fill in all agency details.');
      return;
    }
    if (agencyPass.length < 6) {
      setStatusMsg(lang === 'ko' ? '비밀번호는 최소 6자 이상으로 설정해 주세요.' : 'Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    setStatusMsg('');
    try {
      const res = await registerAgency({
        name: managerName,
        agencyName,
        businessNumber,
        phoneNumber: managerPhone,
        email: agencyEmail,
        pass: agencyPass,
        documentFileName: docFile ? docFile.name : '사업자등록증_사본.pdf',
      });
      if (!res.success && res.message) {
        setStatusMsg(res.message);
      }
    } catch (err: any) {
      setStatusMsg(err.message || '여행사 가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">
              K-TripHub {activeTab === 'login' ? 'Security Login' : 'Sign Up'}
            </span>
            <h3 className="text-xl font-black text-gray-900">
              {activeTab === 'login'
                ? (lang === 'ko' ? '로그인' : 'Welcome Back')
                : (lang === 'ko' ? '새 계정 만들기' : 'Create an Account')}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 메인 탭 선택 (로그인 vs 회원가입) */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => { setActiveTab('login'); setStatusMsg(''); }}
            className={`flex-1 py-3 text-sm font-bold text-center transition ${
              activeTab === 'login'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {lang === 'ko' ? '로그인' : 'Log In'}
          </button>
          <button
            onClick={() => { setActiveTab('register'); setStatusMsg(''); }}
            className={`flex-1 py-3 text-sm font-bold text-center transition ${
              activeTab === 'register'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {lang === 'ko' ? '회원가입' : 'Sign Up'}
          </button>
        </div>

        {/* 안내/에러 메시지 바 */}
        {statusMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
            {statusMsg}
          </div>
        )}

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* ================= 1. 로그인 탭 내용 ================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '이메일 주소' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@ktriphub.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '비밀번호' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>{lang === 'ko' ? '로그인 확인 중...' : 'Signing In...'}</span>
                ) : (
                  <span>{lang === 'ko' ? '로그인하기' : 'Sign In'}</span>
                )}
              </button>

              {/* 소셜 간편 로그인 구분선 */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400 font-semibold">
                    {lang === 'ko' ? '간편 로그인' : 'Social Login'}
                  </span>
                </div>
              </div>

              {/* 구글 & 카카오 로그인 버튼 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 transition disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSocialLogin('kakao')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl text-xs font-semibold text-[#191919] transition disabled:opacity-50"
                >
                  <span className="font-black text-sm">💬</span>
                  <span>{lang === 'ko' ? '카카오 로그인' : 'Kakao'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= 2. 회원가입 탭 내용 ================= */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {/* 역할(Role) 선택 탭 */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRoleTab('TOURIST')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    roleTab === 'TOURIST'
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{lang === 'ko' ? '일반 관광객' : 'Tourist'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleTab('AGENCY')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    roleTab === 'AGENCY'
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ko' ? '여행사 파트너' : 'Travel Agency'}</span>
                </button>
              </div>

              {/* 2-A. 일반 관광객 가입 폼 */}
              {roleTab === 'TOURIST' && (
                <form onSubmit={handleTouristRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '이름 (실명 또는 닉네임)' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      value={touristName}
                      onChange={(e) => setTouristName(e.target.value)}
                      placeholder={lang === 'ko' ? "홍길동" : "Full Name"}
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '이메일 주소' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={touristEmail}
                      onChange={(e) => setTouristEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '비밀번호' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={touristPass}
                      onChange={(e) => setTouristPass(e.target.value)}
                      placeholder="6자 이상 입력"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '비밀번호 확인' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      value={touristPassConfirm}
                      onChange={(e) => setTouristPassConfirm(e.target.value)}
                      placeholder="비밀번호 다시 입력"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 mt-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow transition text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{lang === 'ko' ? '가입 처리 중...' : 'Creating Account...'}</span>
                    ) : (
                      <span>{lang === 'ko' ? '관광객으로 가입 완료' : 'Complete Sign Up'}</span>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-gray-400">
                    {lang === 'ko' ? '간편 가입을 원하시면 [로그인] 탭에서 구글/카카오를 선택하세요.' : 'Or use Google/Kakao one-click signup in Login tab.'}
                  </div>
                </form>
              )}

              {/* 2-B. 여행사 파트너 가입 폼 */}
              {roleTab === 'AGENCY' && (
                <form onSubmit={handleAgencyRegister} className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                    <span className="font-bold">📢 여행사 입점 혜택:</span> 입점비 0원, 상품 판매 시 70% 정산 (소개료 30% 플랫폼 자동 정산)
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '여행사 상호명' : 'Travel Agency Name'}
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="예: 서울투어 익스프레스"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '사업자등록번호' : 'Business Registration Number'}
                    </label>
                    <input
                      type="text"
                      value={businessNumber}
                      onChange={(e) => setBusinessNumber(e.target.value)}
                      placeholder="000-00-00000"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {lang === 'ko' ? '담당자명' : 'Manager Name'}
                      </label>
                      <input
                        type="text"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="홍길동 대표"
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {lang === 'ko' ? '담당자 연락처' : 'Contact Phone'}
                      </label>
                      <input
                        type="text"
                        value={managerPhone}
                        onChange={(e) => setManagerPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '로그인용 이메일' : 'Agency Login Email'}
                    </label>
                    <input
                      type="email"
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      placeholder="partner@agency.com"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '비밀번호' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={agencyPass}
                      onChange={(e) => setAgencyPass(e.target.value)}
                      placeholder="6자 이상 비밀번호"
                      className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  {/* 증빙서류 업로드 필드 */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {lang === 'ko' ? '증빙서류 (사업자등록증 / 관광사업자등록증)' : 'Business Verification Document'}
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 hover:border-teal-500 rounded-xl p-3 text-center cursor-pointer bg-gray-50 transition">
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setDocFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <FileUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-600 block">
                        {docFile ? (
                          <span className="text-teal-700 font-bold">✓ {docFile.name}</span>
                        ) : (
                          (lang === 'ko' ? 'PDF 또는 이미지 파일 첨부 (클릭)' : 'Attach PDF or Image file')
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow transition text-sm flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? (lang === 'ko' ? '입점 신청 처리 중...' : 'Submitting Application...')
                        : (lang === 'ko' ? '여행사 파트너 입점 신청 완료' : 'Submit Agency Application')}
                    </span>
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
