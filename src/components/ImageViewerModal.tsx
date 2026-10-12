import React from 'react';
import { X, MapPin, AlertCircle, Car, Edit3, Trash2, Image as ImageIcon } from 'lucide-react';
import { ApartmentEntry } from '../types/barrier';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: ApartmentEntry | null;
  isAdminMode?: boolean;
  onEditImage?: (item: ApartmentEntry) => void;
  onDeleteImage?: (itemId: string) => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  apartment,
  isAdminMode = false,
  onEditImage,
  onDeleteImage,
}) => {
  const [hasImgError, setHasImgError] = React.useState(false);

  React.useEffect(() => {
    setHasImgError(false);
  }, [apartment?.siteImage]);

  if (!isOpen || !apartment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-400 font-semibold">{apartment.village}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {apartment.hasBarrier ? '차단기 O' : '차단기 X'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{apartment.name} 아파트 현장 안내</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Image Display Area */}
          <div className="relative w-full h-64 sm:h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center group shadow-inner">
            {apartment.siteImage && !hasImgError ? (
              <img
                src={apartment.siteImage}
                alt={`${apartment.name} 현장 이미지`}
                className="max-h-full max-w-full object-contain"
                onError={() => setHasImgError(true)}
              />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-300">
                  {hasImgError ? '이미지 파일을 찾을 수 없거나 로드에 실패했습니다.' : '등록된 현장/차단기 이미지가 없습니다.'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isAdminMode ? '관리자 모드에서 올바른 이미지를 등록하거나 수정할 수 있습니다.' : '아직 현장 이미지가 등록되지 않았거나 경로가 올바르지 않습니다.'}
                </p>
              </div>
            )}

            {/* Admin Floating Image Action Overlay */}
            {isAdminMode && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700 shadow-lg">
                {onEditImage && (
                  <button
                    onClick={() => {
                      onClose();
                      onEditImage(apartment);
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{apartment.siteImage ? '이미지 변경' : '이미지 등록'}</span>
                  </button>
                )}
                {apartment.siteImage && onDeleteImage && (
                  <button
                    onClick={() => {
                      if (window.confirm('정말 이 현장 이미지를 삭제하시겠습니까?')) {
                        onDeleteImage(apartment.id);
                      }
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="이미지 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {apartment.parkingTip && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">주차 및 출입 안내</span>
                  <p className="text-slate-600 leading-relaxed">{apartment.parkingTip}</p>
                </div>
              </div>
            )}

            {apartment.gateDesc && (
              <div className="flex items-start gap-2">
                <Car className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">차단기 및 진입로 설명</span>
                  <p className="text-slate-600 leading-relaxed">{apartment.gateDesc}</p>
                </div>
              </div>
            )}

            {apartment.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">위치 정보</span>
                  <p className="text-slate-600">{apartment.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            <span>부천 상동·중동 아파트 현장 안내 도구</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
