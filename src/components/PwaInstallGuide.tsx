import React from 'react';
import { X, Smartphone, Share2, PlusSquare, MoreVertical, Download, CheckCircle2 } from 'lucide-react';

interface PwaInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallGuide: React.FC<PwaInstallGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-700/80 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">스마트폰 앱으로 설치하는 방법</h3>
              <p className="text-[11px] text-indigo-200">무료 · 앱스토어 설치 없이 즉시 실행</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-indigo-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* iOS Safari Guide */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isIOS
                ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                🍎
              </span>
              <span>아이폰 (Safari 사파리 브라우저)</span>
            </div>
            <ol className="space-y-2 text-slate-600 pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">1.</span>
                <span>
                  사파리 하단 중앙의 <strong>공유 아이콘 (사각형 위로 화살표 <Share2 className="w-3.5 h-3.5 inline text-slate-700" />)</strong>을 누릅니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">2.</span>
                <span>
                  메뉴를 아래로 내려 <strong>[홈 화면에 추가 <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" />]</strong>를 선택합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">3.</span>
                <span>
                  우측 상단 <strong>[추가]</strong>를 누르면 바탕화면에 앱 아이콘이 생성됩니다!
                </span>
              </li>
            </ol>
          </div>

          {/* Android Chrome Guide */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              !isIOS
                ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                🤖
              </span>
              <span>갤럭시 / 안드로이드 (Chrome 크롬 브라우저)</span>
            </div>
            <ol className="space-y-2 text-slate-600 pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">1.</span>
                <span>
                  크롬 우측 상단의 <strong>메뉴 (점 세 개 <MoreVertical className="w-3.5 h-3.5 inline text-slate-700" />)</strong>를 누릅니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">2.</span>
                <span>
                  <strong>[홈 화면에 추가]</strong> 또는 <strong>[앱 설치 <Download className="w-3.5 h-3.5 inline text-slate-700" />]</strong>를 누릅니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-600 shrink-0">3.</span>
                <span>
                  확인을 누르면 일반 스마트폰 앱처럼 설치되어 전체 화면으로 실행됩니다!
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2 text-emerald-800 text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              홈 화면에 추가해두시면 인터넷 창을 따로 열 필요 없이, 차단기 여부와 PDF 도면을 스마트폰 앱처럼 원터치로 편리하게 바로 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
