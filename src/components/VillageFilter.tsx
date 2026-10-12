import React from 'react';

interface VillageFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedVillage: string;
  onSelectVillage: (village: string) => void;
  villages: string[];
}

export const VillageFilter: React.FC<VillageFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedVillage,
  onSelectVillage,
  villages,
}) => {
  return (
    <div className="space-y-3 mb-6 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
      {/* Category Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 단지
          </button>
          <button
            onClick={() => onSelectCategory('barrier')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'barrier'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            차단기 있음 (O)
          </button>
          <button
            onClick={() => onSelectCategory('noBarrier')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'noBarrier'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            차단기 없음 (X)
          </button>
          <button
            onClick={() => onSelectCategory('volunteer')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedCategory === 'volunteer'
                ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            편지 봉사 구역
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          단지 선택 시 상세 게이트 도면과 1:1 연결됩니다
        </span>
      </div>

      {/* Villages Horizontal Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs -mx-1 px-1">
        <span className="text-slate-400 font-medium shrink-0 mr-1 hidden sm:inline">마을 선택:</span>
        <button
          onClick={() => onSelectVillage('all')}
          className={`min-h-[36px] px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
            selectedVillage === 'all'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          전체 마을
        </button>
        {villages.map((v) => (
          <button
            key={v}
            onClick={() => onSelectVillage(v)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
              selectedVillage === v
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};
