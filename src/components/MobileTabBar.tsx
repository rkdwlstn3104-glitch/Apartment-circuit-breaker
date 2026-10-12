import React from 'react';
import { Building2, ShieldAlert, ShieldCheck, Mail } from 'lucide-react';

interface MobileTabBarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenPdf: () => void;
  barrierCount: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenPdf,
  barrierCount,
}) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-4 gap-1 items-center text-center">
        {/* 전체 */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
            activeCategory === 'all'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">전체</span>
        </button>

        {/* 차단기 O */}
        <button
          onClick={() => onSelectCategory('barrier')}
          className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
            activeCategory === 'barrier'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">차단기 O</span>
          <span className="absolute top-0.5 right-1.5 w-4 h-3.5 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {barrierCount}
          </span>
        </button>

        {/* 차단기 X */}
        <button
          onClick={() => onSelectCategory('noBarrier')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
            activeCategory === 'noBarrier'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">차단기 X</span>
        </button>

        {/* 편지봉사 */}
        <button
          onClick={() => onSelectCategory('volunteer')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
            activeCategory === 'volunteer'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">편지봉사</span>
        </button>
      </div>
    </nav>
  );
};
