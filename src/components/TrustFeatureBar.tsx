'use client';

import React from 'react';
import { ShieldCheck, Sparkles, UserCheck, CreditCard, RotateCcw, Headphones } from 'lucide-react';

interface TrustFeatureBarProps {
  lang: 'ko' | 'en';
}

export default function TrustFeatureBar({ lang }: TrustFeatureBarProps) {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      titleKo: "100% 공인 여행사 직거래",
      descKo: "관광사업자 등록증 검증 파트너만 입점",
      titleEn: "100% Verified Local Agencies",
      descEn: "Officially certified Korean travel partners",
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-emerald-600" />,
      titleKo: "3일 전 100% 무료 취소",
      descKo: "일정 변경도 부담 없이 전액 자동 환불",
      titleEn: "Free Cancellation (3 Days)",
      descEn: "100% full refund up to 3 days prior",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      titleKo: "안전 에스크로 결제 보호",
      descKo: "투어가 끝날 때까지 대금을 안전하게 보호",
      titleEn: "Escrow Payment Protection",
      descEn: "Payment safely held until tour completion",
    },
    {
      icon: <Headphones className="w-5 h-5 text-amber-600" />,
      titleKo: "실시간 여행자 긴급 케어",
      descKo: "여행 중 돌발상황 시 현지 가이드와 즉시 소통",
      titleEn: "Real-time Traveler Care",
      descEn: "Instant direct support during your trip",
    },
  ];

  return (
    <section className="bg-white border-b border-slate-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200/60 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-teal-900 transition-colors">
                  {lang === 'ko' ? item.titleKo : item.titleEn}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed truncate sm:whitespace-normal">
                  {lang === 'ko' ? item.descKo : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
