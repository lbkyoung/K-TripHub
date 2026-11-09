'use client';

import React, { useState } from 'react';
import { useTour } from '@/context/TourContext';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Upload,
  Video,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { ScheduleItem } from '@/lib/types';

interface ProductRegisterModalProps {
  lang: 'ko' | 'en';
}

const PRESET_IMAGES = [
  { label: '한옥 & 궁궐', url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&w=1200&q=80' },
  { label: '제주 자연 & 바다', url: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80' },
  { label: '해운대 & 야경', url: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80' },
  { label: 'K-POP & 홍대거리', url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80' },
  { label: '설악산 & 힐링', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
];

export default function ProductRegisterModal({ lang }: ProductRegisterModalProps) {
  const { isRegisterModalOpen, closeRegisterModal, addProduct } = useTour();
  const { user } = useAuth();

  // 1. 기본 정보
  const [titleKo, setTitleKo] = useState('');
  const [category, setCategory] = useState('seoul');
  const [targetAudience, setTargetAudience] = useState<'all' | 'foreign' | 'domestic'>('all');
  const [durationKo, setDurationKo] = useState('1일 투어 (6시간)');
  const [descriptionKo, setDescriptionKo] = useState('');

  // 2. 가격 및 인원
  const [priceKrw, setPriceKrw] = useState<number>(65000);
  const [minPeople, setMinPeople] = useState<number>(1);
  const [maxPeople, setMaxPeople] = useState<number>(10);

  // 3. 포함 및 불포함 사항
  const [includedList, setIncludedList] = useState<string[]>([
    '전문 로컬 가이드 해설비',
    '관련 입장료 및 체험비',
  ]);
  const [newIncluded, setNewIncluded] = useState('');

  const [excludedList, setExcludedList] = useState<string[]>([
    '개인 식사비 및 음료',
    '여행자 보험',
  ]);
  const [newExcluded, setNewExcluded] = useState('');

  // 4. 상세 일정표 (타임라인)
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([
    { time: '10:00', title: '출발지 집결 및 오리엔테이션', desc: '가이드와 인사 및 안전 수칙 안내' },
    { time: '12:00', title: '대표 명소 투어 및 전통 체험', desc: '전문 해설과 함께하는 알찬 체험' },
    { time: '15:00', title: '자유시간 및 투어 종료', desc: '기념사진 촬영 후 해산' },
  ]);

  // 5. 사진 및 영상
  const [selectedImages, setSelectedImages] = useState<string[]>([
    PRESET_IMAGES[0].url,
  ]);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  if (!isRegisterModalOpen) return null;

  // 포함 사항 추가
  const addIncludedItem = () => {
    if (newIncluded.trim()) {
      setIncludedList([...includedList, newIncluded.trim()]);
      setNewIncluded('');
    }
  };

  // 불포함 사항 추가
  const addExcludedItem = () => {
    if (newExcluded.trim()) {
      setExcludedList([...excludedList, newExcluded.trim()]);
      setNewExcluded('');
    }
  };

  // 일정 항목 추가
  const addScheduleRow = () => {
    setScheduleList([
      ...scheduleList,
      { time: '14:00', title: '새 일정 코스', desc: '세부 내용을 입력하세요.' },
    ]);
  };

  // 일정 항목 삭제
  const removeScheduleRow = (idx: number) => {
    setScheduleList(scheduleList.filter((_, i) => i !== idx));
  };

  // 파일 업로드 시뮬레이션
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const names = files.map((f) => f.name);
      setUploadedFileNames((prev) => [...prev, ...names]);
      // 이미지 미리보기용 임시 Unsplash URL 추가
      setSelectedImages((prev) => [
        ...prev,
        PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)].url,
      ]);
    }
  };

  // 등록 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleKo.trim()) {
      alert(lang === 'ko' ? '여행 상품명을 입력해 주세요.' : 'Please enter tour title.');
      return;
    }

    const priceUsd = Math.round(priceKrw / 1300);

    addProduct({
      agencyName: user?.agencyName || '파트너 여행사',
      titleKo,
      titleEn: titleKo + ' (English Guide Available)',
      category,
      targetAudience,
      durationKo,
      durationEn: durationKo,
      priceKrw: Number(priceKrw),
      priceUsd,
      minPeople: Number(minPeople),
      maxPeople: Number(maxPeople),
      imageUrl: selectedImages[0] || PRESET_IMAGES[0].url,
      images: selectedImages.length > 0 ? selectedImages : [PRESET_IMAGES[0].url],
      hasVideo: !!videoUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      descriptionKo: descriptionKo || '검증된 현지 로컬 여행사가 자신 있게 추천하는 프리미엄 여행 코스입니다.',
      descriptionEn: 'Premium local tour recommended by certified Korean agency.',
      included: includedList,
      excluded: excludedList,
      schedule: scheduleList,
    });

    alert(
      lang === 'ko'
        ? '🎉 여행 상품이 성공적으로 등록되었습니다!\n메인 화면과 대시보드에서 지금 바로 확인하실 수 있습니다.'
        : 'Tour published successfully!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                Agency Partner Studio
              </span>
              <h2 className="text-lg sm:text-xl font-black">
                {lang === 'ko' ? '새 여행상품 등록 (입점 여행사 전용)' : 'Register New Tour Package'}
              </h2>
            </div>
          </div>
          <button
            onClick={closeRegisterModal}
            className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 입력 폼 스크롤 영역 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* 섹션 1: 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</span>
              <span>{lang === 'ko' ? '기본 상품 정보' : 'Basic Tour Information'}</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'ko' ? '여행 상품명 (필수)' : 'Tour Title'}
              </label>
              <input
                type="text"
                required
                value={titleKo}
                onChange={(e) => setTitleKo(e.target.value)}
                placeholder={lang === 'ko' ? "예: [감성 제주 1일] 비밀 오름 트레킹 & 해안도로 드라이브" : "Enter attractive tour title"}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 지역 카테고리 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '지역 카테고리' : 'Region'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="seoul">서울 / 수도권</option>
                  <option value="jeju">제주도</option>
                  <option value="busan">부산 / 경상</option>
                  <option value="culture">역사 / 힐링 (경주, 전주)</option>
                  <option value="gangwon">강원도</option>
                </select>
              </div>

              {/* 타깃 고객 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '타깃 고객 구분' : 'Target Travelers'}
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">전체 (내외국인 공통)</option>
                  <option value="foreign">방한 외국인 전용 (ENG 가이드)</option>
                  <option value="domestic">내국인 전용</option>
                </select>
              </div>

              {/* 소요 시간 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '소요 시간' : 'Duration'}
                </label>
                <input
                  type="text"
                  value={durationKo}
                  onChange={(e) => setDurationKo(e.target.value)}
                  placeholder="예: 4시간 / 1일 (8시간)"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 상품 상세 소개글 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {lang === 'ko' ? '상품 상세 소개글' : 'Tour Description'}
              </label>
              <textarea
                rows={3}
                value={descriptionKo}
                onChange={(e) => setDescriptionKo(e.target.value)}
                placeholder={lang === 'ko' ? "여행 상품의 매력 포인트와 차별화된 경험을 소개해 주세요." : "Introduce your tour route and unique experience."}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 섹션 2: 가격 및 참가 인원 (30% 수수료 자동 계산 안내) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
              <span>{lang === 'ko' ? '가격 및 정산 (수수료 30% 정책)' : 'Pricing & 70% Settlement'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '1인당 판매가 (원화 KRW)' : 'Price per person (KRW)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    value={priceKrw}
                    onChange={(e) => setPriceKrw(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">원</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '최소 출발 인원' : 'Min Travelers'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={minPeople}
                  onChange={(e) => setMinPeople(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ko' ? '최대 모집 인원' : 'Max Travelers'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            {/* 수수료 30% 자동 계산 미리보기 알림 카드 */}
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="font-bold text-indigo-700">💡 플랫폼 소개료 및 정산액 시뮬레이션:</span>
                <p className="text-gray-600 mt-0.5">
                  1인 결제 시 <strong>{priceKrw.toLocaleString()}원</strong> 중 플랫폼 수수료 30%(<strong>{(priceKrw * 0.3).toLocaleString()}원</strong>) 공제 후
                </p>
              </div>
              <div className="px-3 py-1.5 bg-indigo-600 text-white font-extrabold rounded-xl text-xs flex-shrink-0">
                여행사 실수령 (70%): {(priceKrw * 0.7).toLocaleString()}원
              </div>
            </div>
          </div>

          {/* 섹션 3: 사진 및 동영상 입력 */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">3</span>
              <span>{lang === 'ko' ? '사진 & 동영상 업로드' : 'Photos & Video URL'}</span>
            </h3>

            {/* 고화질 사진 빠른 프리셋 선택 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'ko' ? '대표 사진 빠른 선택 (클릭하여 추가)' : 'Quick Photo Presets'}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      if (!selectedImages.includes(preset.url)) {
                        setSelectedImages([...selectedImages, preset.url]);
                      }
                    }}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-600 transition"
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover" />
                    <span className="block text-[10px] font-bold py-1 bg-white text-gray-700 text-center truncate px-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 내 컴퓨터 사진 직접 파일 업로드 */}
            <div className="relative border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer bg-gray-50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-gray-700 block">
                {lang === 'ko' ? '내 컴퓨터에서 사진 파일 다중 업로드 (JPG, PNG)' : 'Upload photos from device'}
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5">여러 장을 한 번에 선택하실 수 있습니다</span>
            </div>

            {/* 선택된 사진 목록 썸네일 미리보기 */}
            {selectedImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-indigo-500 group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1 bg-indigo-600 text-white text-[9px] font-bold rounded">
                        대표
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 동영상 입력 필드 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-500" />
                <span>{lang === 'ko' ? '동영상 링크 (YouTube 또는 숏폼 비디오 URL)' : 'Tour Video URL'}</span>
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... 또는 mp4 링크"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-gray-400 block mt-1">
                ※ YouTube 링크를 넣으시면 관광객 상세 페이지에서 바로 영상 재생 플레이어로 변환됩니다.
              </span>
            </div>
          </div>

          {/* 섹션 4: 포함 / 불포함 사항 */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">4</span>
              <span>{lang === 'ko' ? '포함 및 불포함 사항' : 'Inclusions & Exclusions'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 포함 사항 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-emerald-700">✓ 포함 사항</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIncluded}
                    onChange={(e) => setNewIncluded(e.target.value)}
                    placeholder="항목 입력 후 [추가]"
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addIncludedItem}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                  >
                    추가
                  </button>
                </div>
                <ul className="space-y-1">
                  {includedList.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-900 px-2.5 py-1.5 rounded-md">
                      <span>✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => setIncludedList(includedList.filter((_, i) => i !== idx))}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 불포함 사항 */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-rose-700">✕ 불포함 사항</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExcluded}
                    onChange={(e) => setNewExcluded(e.target.value)}
                    placeholder="항목 입력 후 [추가]"
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addExcludedItem}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700"
                  >
                    추가
                  </button>
                </div>
                <ul className="space-y-1">
                  {excludedList.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs bg-rose-50 text-rose-900 px-2.5 py-1.5 rounded-md">
                      <span>✕ {item}</span>
                      <button
                        type="button"
                        onClick={() => setExcludedList(excludedList.filter((_, i) => i !== idx))}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 섹션 5: 타임라인 상세 일정표 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">5</span>
                <span>{lang === 'ko' ? '타임라인 상세 일정표' : 'Tour Itinerary'}</span>
              </h3>
              <button
                type="button"
                onClick={addScheduleRow}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>일정 추가</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {scheduleList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="w-20 flex-shrink-0">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">시간</span>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => {
                        const updated = [...scheduleList];
                        updated[idx].time = e.target.value;
                        setScheduleList(updated);
                      }}
                      className="w-full px-2 py-1 text-xs font-bold bg-white border border-gray-200 rounded"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">코스 제목 & 설명</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...scheduleList];
                        updated[idx].title = e.target.value;
                        setScheduleList(updated);
                      }}
                      placeholder="코스 제목"
                      className="w-full px-2 py-1 text-xs font-bold bg-white border border-gray-200 rounded"
                    />
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => {
                        const updated = [...scheduleList];
                        updated[idx].desc = e.target.value;
                        setScheduleList(updated);
                      }}
                      placeholder="상세 설명"
                      className="w-full px-2 py-1 text-xs text-gray-600 bg-white border border-gray-200 rounded"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeScheduleRow(idx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeRegisterModal}
              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{lang === 'ko' ? '여행 상품 등록 완료하기' : 'Publish Tour Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
