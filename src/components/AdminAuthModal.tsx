import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '1234' || pin.trim() === 'admin') {
      setErrorMsg(null);
      setPin('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. (기본 비밀번호: 1234)');
    }
  };

  const handleQuickDemo = () => {
    setErrorMsg(null);
    setPin('');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">관리자 인증 모드</h3>
              <p className="text-[11px] text-slate-400">단지별 차단기 상태 직접 수정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            일반 사용자의 임의 수정 및 오인 터치를 방지하기 위해 <strong>관리자 인증</strong> 후 차단기 상태 직접 변경이 가능합니다.
          </p>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">관리자 비밀번호</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoFocus
                placeholder="비밀번호 입력 (기본: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs focus:border-indigo-500 focus:bg-white outline-hidden font-mono"
              />
            </div>
            <p className="text-[11px] text-indigo-600 font-medium">
              💡 테스트 및 시연용 기본 비밀번호: <strong>1234</strong>
            </p>
          </div>

          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
            >
              인증하고 관리자 모드 실행
            </button>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              원클릭 관리자 체험 (비번 없이 바로 진입)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
