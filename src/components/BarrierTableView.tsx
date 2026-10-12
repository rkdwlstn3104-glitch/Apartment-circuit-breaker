import React from 'react';
import { ApartmentEntry } from '../types/barrier';
import { ImageIcon, MapPin, ExternalLink, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';

interface BarrierTableViewProps {
  items: ApartmentEntry[];
  onOpenImageViewer: (item: ApartmentEntry) => void;
  onToggleBarrier?: (id: string) => void;
  onToggleVolunteer?: (id: string) => void;
  isAdminMode?: boolean;
  onEditImage?: (item: ApartmentEntry) => void;
  onDeleteApartment?: (id: string) => void;
}

export const BarrierTableView: React.FC<BarrierTableViewProps> = ({
  items,
  onOpenImageViewer,
  onToggleBarrier,
  onToggleVolunteer,
  isAdminMode = false,
  onEditImage,
  onDeleteApartment,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">마을</th>
              <th className="py-3 px-4">아파트</th>
              <th className="py-3 px-4 text-center">차단기</th>
              <th className="py-3 px-4">현장 이미지 안내</th>
              <th className="py-3 px-4">주차 안내 및 비고</th>
              <th className="py-3 px-4 text-right">지도</th>
              {isAdminMode && onDeleteApartment && <th className="py-3 px-4 text-center">관리</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {items.map((apt) => (
              <tr
                key={apt.id}
                className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                onClick={() => onOpenImageViewer(apt)}
              >
                {/* 마을 */}
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>{apt.village}</span>
                    {isAdminMode && onToggleVolunteer ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVolunteer(apt.id);
                        }}
                        title={
                          apt.category === 'volunteer'
                            ? '[관리자] 클릭 시 편지봉사 구역 해제'
                            : '[관리자] 클릭 시 편지봉사 구역 지정'
                        }
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                          apt.category === 'volunteer'
                            ? 'text-indigo-700 bg-indigo-100 border-indigo-300 hover:bg-rose-100 hover:text-rose-700'
                            : 'text-slate-400 bg-slate-100 border-slate-200 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {apt.category === 'volunteer' ? '편지봉사 O' : '+ 편지봉사'}
                      </button>
                    ) : (
                      apt.category === 'volunteer' && (
                        <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                          편지봉사
                        </span>
                      )
                    )}
                  </div>
                </td>

                {/* 아파트 */}
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  <div>{apt.name}</div>
                  {apt.subApartments && (
                    <div className="text-[11px] text-slate-400 font-normal">
                      {apt.subApartments.join(', ')}
                    </div>
                  )}
                </td>

                {/* 차단기 유무 */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  {isAdminMode && onToggleBarrier ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBarrier(apt.id);
                      }}
                      title="[관리자 모드] 클릭하여 차단기 상태 즉시 변경 (설치 ↔ 미설치)"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all active:scale-95 cursor-pointer border ring-1 ring-amber-400 ${
                        apt.hasBarrier
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {apt.hasBarrier ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>O (설치)</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>X (미설치)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-1">
                      {apt.hasBarrier ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>O</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>X</span>
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* 현장 이미지 연동 링크 */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {apt.hasBarrier ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImageViewer(apt);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-2xs hover:shadow transition-all"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{apt.siteImage ? '현장 이미지 보기' : '이미지 등록'}</span>
                      </button>

                      {isAdminMode && onEditImage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditImage(apt);
                          }}
                          title="[관리자 모드] 현장 이미지 등록 및 수정"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md text-[11px] font-bold transition-colors"
                        >
                          <ImageIcon className="w-3 h-3 text-indigo-600" />
                          <span>{apt.siteImage ? '수정' : '+ 등록'}</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">-</span>
                  )}
                </td>

                {/* 주차 팁 & 비고 */}
                <td className="py-3.5 px-4 text-slate-600 max-w-xs sm:max-w-md">
                  <div className="line-clamp-2 leading-relaxed space-y-0.5">
                    {apt.adminMemo && (
                      <span className="text-indigo-700 font-bold block">📝 메모: {apt.adminMemo}</span>
                    )}
                    <div>{apt.parkingTip || apt.notes || '-'}</div>
                  </div>
                </td>

                {/* 지도 */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(`${apt.village} ${apt.name} 아파트`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                    title="카카오맵 길찾기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>

                {isAdminMode && onDeleteApartment && (
                  <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDeleteApartment(apt.id)}
                      title="[관리자 모드] 아파트 삭제"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
