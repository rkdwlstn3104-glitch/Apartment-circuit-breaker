import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon, Trash2, Car, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { ApartmentEntry } from '../types/barrier';

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: ApartmentEntry | null;
  onSave: (updatedApt: ApartmentEntry) => void;
}

export const EditImageModal: React.FC<EditImageModalProps> = ({
  isOpen,
  onClose,
  apartment,
  onSave,
}) => {
  if (!isOpen || !apartment) return null;

  const [siteImage, setSiteImage] = useState<string>(apartment.siteImage || '');
  const [parkingTip, setParkingTip] = useState<string>(apartment.parkingTip || '');
  const [gateDesc, setGateDesc] = useState<string>(apartment.gateDesc || '');
  const [address, setAddress] = useState<string>(apartment.address || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (apartment) {
      setSiteImage(apartment.siteImage || '');
      setParkingTip(apartment.parkingTip || '');
      setGateDesc(apartment.gateDesc || '');
      setAddress(apartment.address || '');
      setSelectedFile(null);
      setUploadError(null);
    }
  }, [apartment]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setSiteImage(result);
      }
    };
    reader.onerror = () => {
      setUploadError('파일을 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    let finalImageUrl = siteImage;

    if (selectedFile) {
      try {
        console.log('[Client] Uploading file on submit:', selectedFile.name, 'Size:', selectedFile.size, 'Apartment ID:', apartment.id);
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            filename: selectedFile.name,
            apartmentId: apartment.id,
          }),
        });
        const data = await res.json().catch(() => ({}));
        console.log('[Client] Submit upload response:', res.status, data);
        if (res.ok && data.success && typeof data.url === 'string' && data.url) {
          // Verify the returned URL can actually serve the uploaded image before saving its reference.
          const imageCheck = await fetch(data.url, { method: 'GET', cache: 'no-store' });
          const contentType = imageCheck.headers.get('content-type') || '';
          if (!imageCheck.ok || !contentType.startsWith('image/')) {
            setUploadError('이미지 파일은 전송됐지만 서버에서 다시 불러오지 못했습니다. 저장소 설정과 이미지 URL을 확인해 주세요.');
            setUploading(false);
            return;
          }
          finalImageUrl = data.url;
        } else {
          setUploadError(data.error || `이미지 서버 저장 실패 (HTTP ${res.status})`);
          setUploading(false);
          return;
        }
      } catch (err: any) {
        console.error('[Client] Submit upload failed:', err);
        setUploadError('서버 연결 실패로 저장을 완료할 수 없습니다.');
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    onSave({
      ...apartment,
      siteImage: finalImageUrl || undefined,
      parkingTip: parkingTip.trim() || undefined,
      gateDesc: gateDesc.trim() || undefined,
      address: address.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center text-indigo-200">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">현장 이미지 등록 및 수정</h3>
              <p className="text-xs text-indigo-200">
                {apartment.village} {apartment.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block flex items-center justify-between">
              <span>현장 및 차단기 이미지 (사진/도면)</span>
              {siteImage && (
                <button
                  type="button"
                  onClick={() => setSiteImage('')}
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>이미지 삭제</span>
                </button>
              )}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
              />
            </div>
            {uploading && (
              <div className="flex items-center gap-2 text-indigo-600 font-bold py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>서버에 이미지 저장 및 확인 중...</span>
              </div>
            )}
            {uploadError && (
              <p className="text-rose-600 text-[11px] font-medium">{uploadError}</p>
            )}
            {siteImage ? (
              <div className="relative w-full h-40 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                <img src={siteImage} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="w-full h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1">
                <ImageIcon className="w-6 h-6 text-slate-300" />
                <span>등록된 이미지가 없습니다 (파일을 선택해 업로드하세요)</span>
              </div>
            )}
          </div>

          {/* Parking Tip */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>주차 및 출입 안내</span>
            </label>
            <textarea
              rows={2}
              value={parkingTip}
              onChange={(e) => setParkingTip(e.target.value)}
              placeholder="예: 방문객 1차선 서행 진입, 경비실 호출 필요"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:bg-white outline-hidden leading-relaxed"
            />
          </div>

          {/* Gate Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-indigo-600" />
              <span>차단기 및 진입로 설명</span>
            </label>
            <input
              type="text"
              value={gateDesc}
              onChange={(e) => setGateDesc(e.target.value)}
              placeholder="예: 정문 자동 차량 차단기 (방문증 필요)"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white outline-hidden"
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>도로명 위치 안내</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 경기도 부천시 원미구 소향로"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:bg-white outline-hidden"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>업로드 중...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>저장하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
