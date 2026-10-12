export type ZoneCategory = 'all' | 'general' | 'volunteer';

export interface ApartmentEntry {
  id: string;
  village: string; // 마을 이름 (예: 백송마을, 보람마을, 포도마을 ...)
  name: string; // 아파트 이름 (예: 뉴서울, 아주, 전체, 한라 ...)
  subApartments?: string[]; // 세부 포함 아파트 목록
  hasBarrier: boolean; // 차단기 유무 (O: true, X: false)
  category: 'general' | 'volunteer'; // 일반 구역 또는 편지 봉사 구역
  siteImage?: string; // 현장/차단기 이미지 URL 또는 Base64
  notes?: string; // 비고
  parkingTip?: string; // 주차 관련 꿀팁/안내
  adminMemo?: string; // 관리자 현장 메모 (비번, 경비실 연락처 등)
  gateDesc?: string; // 차단기 및 진입로 상세 설명
  address?: string; // 대략적인 도로명/위치 (부천시 원미구 상동 일대)
  complexInfo?: string; // 세대수나 단지 특징
  lastVerifiedDate?: string; // 관리자/현장 검증 일자
}

export interface BarrierReport {
  id: string;
  apartmentId: string;
  apartmentName: string;
  village: string;
  currentBarrier: boolean;
  suggestedBarrier: boolean; // 제보된 상태 (true: 차단기 있음, false: 없음)
  reason: string; // 현장 상황 설명
  reporterName?: string;
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected';
}
