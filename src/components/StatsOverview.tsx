import React from 'react';
import { ShieldCheck, ShieldAlert, FileText, Mail, Building2 } from 'lucide-react';

interface StatsOverviewProps {
  totalCount: number;
  barrierCount: number;
  noBarrierCount: number;
  volunteerCount: number;
  onFilterBarrier: (type: 'all' | 'barrier' | 'noBarrier' | 'volunteer') => void;
  activeFilter: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalCount,
  barrierCount,
  noBarrierCount,
  volunteerCount,
  onFilterBarrier,
  activeFilter,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* Total Card */}
      <button
        onClick={() => onFilterBarrier('all')}
        className={`p-4 rounded-xl border text-left transition-all bg-white hover:border-slate-400 ${
          activeFilter === 'all'
            ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-sm'
            : 'border-slate-200/80 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
          <span>전체 마을 및 단지</span>
          <Building2 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
          <span className="text-xs text-slate-500">개 구역</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">부천 상동·중동 관내 아파트</div>
      </button>

      {/* Barrier Installed Card */}
      <button
        onClick={() => onFilterBarrier('barrier')}
        className={`p-4 rounded-xl border text-left transition-all bg-white hover:border-amber-400 ${
          activeFilter === 'barrier'
            ? 'ring-2 ring-amber-500 border-amber-500 shadow-sm'
            : 'border-slate-200/80 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-amber-700 text-xs mb-1 font-medium">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>차단기 설치 (O)</span>
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-amber-900">{barrierCount}</span>
          <span className="text-xs text-amber-700">개 단지</span>
        </div>
        <div className="text-[11px] text-amber-800/80 mt-1">도면 및 진입 게이트 안내 연결</div>
      </button>

      {/* Free Access Card */}
      <button
        onClick={() => onFilterBarrier('noBarrier')}
        className={`p-4 rounded-xl border text-left transition-all bg-white hover:border-emerald-400 ${
          activeFilter === 'noBarrier'
            ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-sm'
            : 'border-slate-200/80 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-emerald-700 text-xs mb-1 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>차단기 미설치 (X)</span>
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
            자유 출입
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-900">{noBarrierCount}</span>
          <span className="text-xs text-emerald-700">개 단지</span>
        </div>
        <div className="text-[11px] text-emerald-800/80 mt-1">차량 통행 및 회차 자유</div>
      </button>

      {/* Volunteer Zone Card */}
      <button
        onClick={() => onFilterBarrier('volunteer')}
        className={`p-4 rounded-xl border text-left transition-all bg-white hover:border-indigo-400 ${
          activeFilter === 'volunteer'
            ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-sm'
            : 'border-slate-200/80 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between text-indigo-700 text-xs mb-1 font-medium">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>편지 봉사 구역</span>
          </span>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
            특별 구역
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-indigo-900">{volunteerCount}</span>
          <span className="text-xs text-indigo-700">개 마을</span>
        </div>
        <div className="text-[11px] text-indigo-800/80 mt-1">사랑마을 · 꿈동산 · 목련마을</div>
      </button>
    </div>
  );
};
