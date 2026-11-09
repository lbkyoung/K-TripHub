'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, Clock, RefreshCcw } from 'lucide-react';

interface RefundPolicyBannerProps {
  lang: 'ko' | 'en';
}

export default function RefundPolicyBanner({ lang }: RefundPolicyBannerProps) {
  return (
    <section id="refund-section" className="py-12 sm:py-16 bg-slate-900 text-white scroll-mt-20 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-500/20">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{lang === 'ko' ? '공정거래 & 안심 예약 보장제' : 'Fair Cancellation & Refund Policy'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white text-balance">
            {lang === 'ko' ? 'K-TripHub 투명한 취소 및 환불 기준' : 'Transparent Cancellation Policy'}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-slate-300 font-light leading-relaxed">
            {lang === 'ko'
              ? '여행사와 관광객 모두가 안심할 수 있도록 규정에 따라 자동 환불 및 승인 취소가 안전하게 처리됩니다.'
              : 'Clear and automated refund procedures to protect both travelers and local agencies.'}
          </p>
        </div>

        {/* 3단계 취소 규정 시각화 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* 1. 여행 3일 전 (100% 환불) */}
          <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-7 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all duration-300 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
                  {lang === 'ko' ? '여행 3일 전 (23:59까지)' : 'Until 3 Days Prior'}
                </span>
                <Clock className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              </div>
              <h3 className="text-4xl font-black text-emerald-400 mb-2 tracking-tight">
                100% <span className="text-base font-bold text-white ml-1">{lang === 'ko' ? '전액 환불' : 'Full Refund'}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                {lang === 'ko'
                  ? '여행 시작 3일 전 자정까지 취소 시 위약금 없이 결제 금액 100%를 즉시 자동 환불해 드립니다.'
                  : 'Cancel up to 3 days before travel date for a 100% full refund with zero cancellation fee.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>✓</span> {lang === 'ko' ? '위약금 0원 · 카드 자동 승인 취소' : 'Zero fee · Instant card refund'}
            </div>
          </div>

          {/* 2. 여행 2일 ~ 1일 전 (50% 환불) */}
          <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-7 border border-amber-500/30 flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
                  {lang === 'ko' ? '여행 시작 2일 ~ 1일 전' : '2 to 1 Days Prior'}
                </span>
                <RefreshCcw className="w-5 h-5 text-amber-400 group-hover:-rotate-45 transition-transform" />
              </div>
              <h3 className="text-4xl font-black text-amber-400 mb-2 tracking-tight">
                50% <span className="text-base font-bold text-white ml-1">{lang === 'ko' ? '부분 환불' : 'Partial Refund'}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                {lang === 'ko'
                  ? '여행사의 차량 및 입장권 사전 예약 비용을 고려하여 결제 금액의 50%가 공제 후 환불됩니다.'
                  : '50% refund issued to cover preliminary preparation expenses incurred by the local agency.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <span>✓</span> {lang === 'ko' ? '50% 위약금 차감 후 당일 정산' : '50% fee deducted automatically'}
            </div>
          </div>

          {/* 3. 여행 당일 취소 (환불 불가) */}
          <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-7 border border-rose-500/30 flex flex-col justify-between hover:border-rose-400/60 transition-all duration-300 shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30">
                  {lang === 'ko' ? '여행 당일 취소 / 노쇼' : 'Day of Travel / No-Show'}
                </span>
                <AlertCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-4xl font-black text-rose-400 mb-2 tracking-tight">
                0% <span className="text-base font-bold text-white ml-1">{lang === 'ko' ? '환불 불가' : 'Non-Refundable'}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                {lang === 'ko'
                  ? '여행 당일 취소 또는 미참석(No-show) 시에는 여행사 손실 보호를 위해 환불이 불가합니다.'
                  : 'Cancellations on the day of departure or no-shows are strictly non-refundable.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <span>✓</span> {lang === 'ko' ? '현지 여행사 100% 손실 보호권' : 'Agency protection policy'}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
