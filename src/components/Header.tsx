import React from 'react';
import {
  Search,
  Car,
  Smartphone,
  PlusCircle,
  Lock,
  Unlock,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenInstallGuide?: () => void;
  onOpenAddModal?: () => void;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenInstallGuide,
  onOpenAddModal,
  isAdminMode = false,
  onToggleAdminMode,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col gap-3">
          {/* Top Row: Brand & App Install Shortcut */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <Car className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    차단기 여부
                  </h1>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 hidden xs:block">
                  마을별 아파트 차량 차단기 여부 확인 및 현장 이미지 1:1 등록·관리
                </p>
              </div>
            </div>

            {/* Mobile / Desktop Action Shortcuts */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Admin Mode Toggle */}
              {onToggleAdminMode && (
                <button
                  onClick={onToggleAdminMode}
                  title={isAdminMode ? '관리자 모드 종료 (일반 사용자 모드로 전환)' : '관리자 모드 로그인 (차단기 직접 수정)'}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    isAdminMode
                      ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {isAdminMode ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">관리자</span>
                      <span>ON</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">관리자</span>
                      <span>인증</span>
                    </>
                  )}
                </button>
              )}

              {/* Admin only: Add apartment */}
              {isAdminMode && onOpenAddModal && (
                <button
                  onClick={onOpenAddModal}
                  title="신규 아파트 단지 등록 및 차단기 정보 추가"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">+ 단지</span>
                  <span>등록</span>
                </button>
              )}

              {onOpenInstallGuide && (
                <button
                  onClick={onOpenInstallGuide}
                  title="스마트폰 홈화면에 앱 추가"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">홈화면</span>
                  <span>앱 설치</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="마을 또는 아파트명 바로 검색 (예: 뉴서울, 삼익, 아주)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 focus:border-indigo-500 rounded-lg pl-9 pr-8 py-2 text-sm sm:text-xs text-slate-800 placeholder-slate-400 outline-hidden transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200/60"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Admin Mode Status Banner */}
          {isAdminMode && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2">
              <span className="font-semibold flex items-center gap-1.5 flex-wrap">
                <span>🛡️ 관리자 모드 활성화:</span>
                <span className="font-normal text-amber-800">
                  단지 카드의 차단기 상태 및 현장 이미지를 직접 등록·변경·삭제할 수 있습니다.
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
