import React, { useState } from 'react';
import { X, PlusCircle, ShieldAlert, ShieldCheck, MapPin, Building2, HelpCircle, Mail } from 'lucide-react';
import { ApartmentEntry } from '../types/barrier';

interface AddApartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApartment: (newApt: ApartmentEntry) => void;
  existingVillages: string[];
}

export const AddApartmentModal: React.FC<AddApartmentModalProps> = ({
  isOpen,
  onClose,
  onAddApartment,
  existingVillages,
}) => {
  const [villageType, setVillageType] = useState<'existing' | 'new'>('existing');
  const [selectedVillage, setSelectedVillage] = useState<string>(existingVillages[0] || '포도마을');
  const [newVillageName, setNewVillageName] = useState<string>('');
  const [apartmentName, setApartmentName] = useState<string>('');
  const [hasBarrier, setHasBarrier] = useState<boolean>(true);
  const [category, setCategory] = useState<'general' | 'volunteer'>('general');
  const [notes, setNotes] = useState<string>('');
  const [parkingTip, setParkingTip] = useState<string>('');
  const [gateDesc, setGateDesc] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const finalVillage = villageType === 'new' ? newVillageName.trim() : selectedVillage;
    if (!finalVillage) {
      setFormError('마을명을 입력하거나 선택해주세요.');
      return;
    }
    if (!apartmentName.trim()) {
      setFormError('아파트 단지명을 입력해주세요.');
      return;
    }

    const newEntry: ApartmentEntry = {
      id: `custom-${Date.now()}`,
      village: finalVillage,
      name: apartmentName.trim(),
      hasBarrier,
      category,
      notes: notes.trim() || (hasBarrier ? '차단기 신규 설치 단지' : '차단기 미설치'),
      parkingTip: parkingTip.trim() || (hasBarrier ? '방문객 차선 서행 진입 권장' : '자유 주차 가능'),
      gateDesc: gateDesc.trim() || (hasBarrier ? '자동 차량 차단봉 운영' : '개방형 출입구'),
      complexInfo: `${apartmentName.trim()} 단지`,
      address: address.trim() || `경기도 부천시 원미구 ${finalVillage}`,
    };

    onAddApartment(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-700/80 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">신규 아파트 단지 등록</h3>
              <p className="text-xs text-indigo-200">차단기 신설 또는 신규 단지 현황 유지보수</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium text-xs">
              ⚠️ {formError}
            </div>
          )}

          {/* 1. Village Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">마을 선택 / 신규 입력</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setVillageType('existing')}
                className={`py-1.5 px-3 rounded-lg border font-semibold transition-all ${
                  villageType === 'existing'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                기존 마을 선택
              </button>
              <button
                type="button"
                onClick={() => setVillageType('new')}
                className={`py-1.5 px-3 rounded-lg border font-semibold transition-all ${
                  villageType === 'new'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                + 새 마을 등록
              </button>
            </div>

            {villageType === 'existing' ? (
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white outline-hidden"
              >
                {existingVillages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="예: 미리내마을, 하얀마을, 중동마을 등"
                value={newVillageName}
                onChange={(e) => setNewVillageName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white outline-hidden"
                required
              />
            )}
          </div>

          {/* 2. Apartment Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">아파트 단지명 *</label>
            <input
              type="text"
              placeholder="예: 롯데캐슬, 푸르지오, e편한세상 등"
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white outline-hidden"
              required
            />
          </div>

          {/* 3. Barrier Status (Crucial) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">차량 차단기 설치 여부 *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHasBarrier(true)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-bold transition-all ${
                  hasBarrier
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>차단기 있음 (운영중)</span>
              </button>
              <button
                type="button"
                onClick={() => setHasBarrier(false)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-bold transition-all ${
                  !hasBarrier
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>차단기 없음 (자유통행)</span>
              </button>
            </div>
          </div>

          {/* 4. Volunteer Zone Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">구역 분류 (편지 봉사 구역 여부)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('volunteer')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-bold transition-all ${
                  category === 'volunteer'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>편지 봉사 구역</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('general')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border font-bold transition-all ${
                  category === 'general'
                    ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>일반 구역</span>
              </button>
            </div>
          </div>

          {/* 5. Parking & Entry Tip */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">진입 및 주차 꿀팁</label>
            <input
              type="text"
              placeholder="예: 방문객 차선 서행 진입, 인근 공영주차장 이용 권장 등"
              value={parkingTip}
              onChange={(e) => setParkingTip(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white outline-hidden"
            />
          </div>

          {/* 5. Gate Description & Route Guide */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">진입 위치 및 게이트 안내</label>
            <input
              type="text"
              placeholder="예: 정문 방문객 1차선, 경비초소 인터폰 호출 필요"
              value={gateDesc}
              onChange={(e) => setGateDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white outline-hidden"
            />
          </div>

          {/* 6. Address / Navigation */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">도로명 주소</label>
            <input
              type="text"
              placeholder="예: 경기도 부천시 원미구 상동로 ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              단지 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
