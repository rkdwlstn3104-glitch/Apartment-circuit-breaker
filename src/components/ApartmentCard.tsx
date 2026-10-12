import React, { useState } from 'react';
import { ApartmentEntry } from '../types/barrier';
import {
  MapPin,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Car,
  ChevronRight,
  Info,
  Edit3,
  Check,
  Lock,
  Mail,
  ImageIcon,
  Trash2,
} from 'lucide-react';

interface ApartmentCardProps {
  item: ApartmentEntry;
  onOpenImageViewer: (item: ApartmentEntry) => void;
  savedMemo?: string;
  onSaveMemo: (id: string, memo: string) => void;
  onToggleBarrier?: (id: string) => void;
  onToggleVolunteer?: (id: string) => void;
  isAdminMode?: boolean;
  onEditImage?: (item: ApartmentEntry) => void;
  onUpdateParkingTip?: (id: string, tip: string) => void;
  onDeleteApartment?: (id: string) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({
  item,
  onOpenImageViewer,
  savedMemo = '',
  onSaveMemo,
  onToggleBarrier,
  onToggleVolunteer,
  isAdminMode = false,
  onEditImage,
  onUpdateParkingTip,
  onDeleteApartment,
}) => {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(savedMemo);

  const [isEditingParking, setIsEditingParking] = useState(false);
  const [parkingText, setParkingText] = useState(item.parkingTip || '');

  const handleSaveMemo = () => {
    onSaveMemo(item.id, memoText);
    setIsEditingMemo(false);
  };

  const handleSaveParkingTip = () => {
    if (onUpdateParkingTip) {
      onUpdateParkingTip(item.id, parkingText.trim());
    }
    setIsEditingParking(false);
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Banner / Status Line */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1 flex-wrap">
              <span>{item.village}</span>
              {isAdminMode && onToggleVolunteer ? (
                <button
                  type="button"
                  onClick={() => onToggleVolunteer(item.id)}
                  title={
                    item.category === 'volunteer'
                      ? '[관리자] 클릭 시 편지 봉사 구역 해제 (일반 구역으로 변경)'
                      : '[관리자] 클릭 시 편지 봉사 구역으로 신규 지정'
                  }
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border transition-all active:scale-95 cursor-pointer ${
                    item.category === 'volunteer'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
                  }`}
                >
                  <Mail className="w-3 h-3 text-indigo-600" />
                  <span>
                    {item.category === 'volunteer' ? '편지봉사 (지정됨·해제)' : '+ 편지봉사 지정'}
                  </span>
                </button>
              ) : (
                item.category === 'volunteer' && (
                  <span className="inline-flex items-center gap-1 text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 text-[11px]">
                    <Mail className="w-3 h-3" />
                    <span>편지 봉사 구역</span>
                  </span>
                )
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
              {item.name}
            </h3>
          </div>

          {/* Barrier Status Indicator & Verification Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isAdminMode && onToggleBarrier ? (
              <button
                onClick={() => onToggleBarrier(item.id)}
                title="[관리자 모드] 클릭하여 차단기 설치 여부 즉시 변경 (O ↔ X)"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all active:scale-95 cursor-pointer ring-1 ring-amber-400 ${
                  item.hasBarrier
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                }`}
              >
                {item.hasBarrier ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>차단기 O</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded">수정</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>차단기 X</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded">수정</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-1">
                {item.hasBarrier ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>차단기 O</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>차단기 X</span>
                  </div>
                )}
              </div>
            )}

            {isAdminMode && onDeleteApartment && (
              <button
                onClick={() => onDeleteApartment(item.id)}
                title="[관리자 모드] 아파트 삭제"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-apartments if any */}
        {item.subApartments && item.subApartments.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-2 text-xs text-slate-500">
            <span className="text-slate-400">포함 단지:</span>
            {item.subApartments.map((sub, i) => (
              <span key={i} className="text-slate-700 font-medium">
                {sub}
                {i < item.subApartments!.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        )}

        {/* Key Notes / Parking Advice */}
        {(item.parkingTip || isAdminMode) && (
          <div
            className={`p-2.5 rounded-lg text-xs mb-3 relative group/parking ${
              item.hasBarrier
                ? 'bg-amber-50/70 text-amber-900 border border-amber-200/60'
                : 'bg-slate-50 text-slate-700 border border-slate-200/60'
            }`}
          >
            {isAdminMode && isEditingParking ? (
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>주차 및 출입 안내 수정</span>
                </div>
                <textarea
                  rows={2}
                  value={parkingText}
                  onChange={(e) => setParkingText(e.target.value)}
                  placeholder="주차 및 출입 안내 내용 입력..."
                  className="w-full text-xs p-1.5 border border-amber-300 rounded bg-white text-slate-800 outline-hidden"
                />
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => {
                      setParkingText(item.parkingTip || '');
                      setIsEditingParking(false);
                    }}
                    className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveParkingTip}
                    className="px-2.5 py-1 text-[11px] bg-amber-600 hover:bg-amber-700 text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 w-full">
                <AlertCircle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    item.hasBarrier ? 'text-amber-600' : 'text-slate-400'
                  }`}
                />
                <div className="leading-relaxed flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold block mb-0.5">주차 및 출입 안내</span>
                    {isAdminMode && (
                      <button
                        onClick={() => {
                          setParkingText(item.parkingTip || '');
                          setIsEditingParking(true);
                        }}
                        className="opacity-0 group-hover/parking:opacity-100 transition-opacity text-amber-800 hover:text-amber-950 p-0.5 rounded cursor-pointer"
                        title="[관리자 모드] 주차 및 출입 안내 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span>
                    {item.parkingTip || (isAdminMode ? '클릭하여 주차 및 출입 안내 등록...' : '')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gate Description & Complex info */}
        <div className="space-y-1 text-xs text-slate-600 mb-3 mt-auto">
          {item.gateDesc && (
            <div className="flex items-start gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-slate-600">{item.gateDesc}</span>
            </div>
          )}
          {item.complexInfo && (
            <div className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-slate-500">{item.complexInfo}</span>
            </div>
          )}
        </div>

        {/* Custom Local Memo (Admin only editable, General users read-only) */}
        {(savedMemo || isAdminMode) && (
          <div className="pt-2 border-t border-slate-100 mt-2">
            {isAdminMode && isEditingMemo ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="비밀번호, 경비실 연락처 등 관리자 메모..."
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  className="w-full text-xs p-1.5 border border-indigo-300 rounded bg-indigo-50/30 text-slate-800 outline-hidden"
                />
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setIsEditingMemo(false)}
                    className="px-2 py-0.5 text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveMemo}
                    className="px-2 py-0.5 text-[11px] bg-indigo-600 text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    저장
                  </button>
                </div>
              </div>
            ) : isAdminMode ? (
              <div
                onClick={() => setIsEditingMemo(true)}
                className="group/memo flex items-center justify-between text-[11px] text-slate-500 hover:text-indigo-600 cursor-pointer py-0.5"
                title="[관리자 모드] 클릭하여 현장 메모 입력 및 수정"
              >
                <span className="truncate">
                  {savedMemo ? (
                    <span className="text-indigo-700 font-medium">📝 관리자 메모: {savedMemo}</span>
                  ) : (
                    <span className="text-indigo-600/80 group-hover/memo:text-indigo-700 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-500" />
                      <span>+ 관리자 현장 메모 등록 (비번/연락처 등)</span>
                    </span>
                  )}
                </span>
                <Edit3 className="w-3 h-3 opacity-0 group-hover/memo:opacity-100 shrink-0 text-indigo-600" />
              </div>
            ) : savedMemo ? (
              <div className="flex items-center text-[11px] text-indigo-900 bg-indigo-50/70 px-2.5 py-1.5 rounded-lg border border-indigo-100/90">
                <span className="font-bold mr-1.5 shrink-0 text-indigo-700">📝 메모:</span>
                <span className="truncate font-medium">{savedMemo}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Map Link */}
        <a
          href={`https://map.kakao.com/link/search/${encodeURIComponent(`${item.village} ${item.name} 아파트`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-3 py-2 text-xs text-slate-600 hover:text-indigo-600 font-semibold inline-flex items-center gap-1.5 transition-colors rounded-lg hover:bg-slate-100"
        >
          <MapPin className="w-4 h-4 text-slate-500" />
          <span>길찾기</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Primary Site Image Button */}
        {item.hasBarrier ? (
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <button
              onClick={() => onOpenImageViewer(item)}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all group/btn cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{item.siteImage ? '현장 이미지' : '이미지 등록'}</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {/* Admin can add or edit image guide */}
            {isAdminMode && onEditImage && (
              <button
                onClick={() => onEditImage(item)}
                title="[관리자 모드] 현장 이미지 등록/변경 및 삭제"
                className="min-h-[40px] px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{item.siteImage ? '이미지 수정' : '+ 이미지 등록'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-medium">
            차단기 없음 (이미지 불필요)
          </div>
        )}
      </div>
    </article>
  );
};
