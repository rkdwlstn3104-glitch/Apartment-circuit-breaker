import React, { useState, useMemo, useEffect } from 'react';
import { APARTMENTS_DATA } from './data/barrierData';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { VillageFilter } from './components/VillageFilter';
import { ApartmentCard } from './components/ApartmentCard';
import { BarrierTableView } from './components/BarrierTableView';
import { MobileTabBar } from './components/MobileTabBar';
import { PwaInstallGuide } from './components/PwaInstallGuide';
import { AddApartmentModal } from './components/AddApartmentModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { EditImageModal } from './components/EditImageModal';
import { ApartmentEntry } from './types/barrier';
import {
  LayoutGrid,
  List,
  HelpCircle,
} from 'lucide-react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">화면을 표시하는 중 문제가 발생했습니다</h2>
            <p className="text-xs text-slate-500 mb-6">
              저장된 데이터에 오류가 있거나 일시적인 문제가 발생했습니다. 아래 버튼을 눌러 데이터를 초기화하고 정상 화면으로 복구할 수 있습니다.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md cursor-pointer"
            >
              데이터 초기화 및 새로고침
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const saveCustomDataToLocalStorage = (items: ApartmentEntry[]) => {
    try {
      const sanitized = items.map((item) => ({
        ...item,
        siteImage: item.siteImage && item.siteImage.startsWith('data:') ? undefined : item.siteImage,
      }));
      localStorage.setItem('apt_barrier_custom_data_v2', JSON.stringify(sanitized));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  // Main Apartments Data with Local Persistence & Robust Merging with APARTMENTS_DATA
  const [apartments, setApartments] = useState<ApartmentEntry[]>(() => {
    let list = APARTMENTS_DATA;
    let savedMemos: Record<string, string> = {};
    try {
      const m = localStorage.getItem('apt_barrier_memos');
      if (m) savedMemos = JSON.parse(m);
    } catch {}

    try {
      const saved = localStorage.getItem('apt_barrier_custom_data_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultIds = new Set(APARTMENTS_DATA.map((d) => d.id));
          const savedIds = new Set(parsed.map((p: ApartmentEntry) => p.id));

          const baseMerged = APARTMENTS_DATA.filter((defaultItem) => savedIds.has(defaultItem.id)).map((defaultItem) => {
            const found = parsed.find((p: ApartmentEntry) => p.id === defaultItem.id);
            return {
              ...defaultItem,
              ...found,
              siteImage: found?.siteImage || defaultItem.siteImage,
              adminMemo: found?.adminMemo || savedMemos[defaultItem.id] || defaultItem.adminMemo,
            };
          });

          const customAdded = parsed.filter((p: ApartmentEntry) => !defaultIds.has(p.id));
          list = [...baseMerged, ...customAdded];
        }
      } else {
        list = APARTMENTS_DATA.map((item) => ({
          ...item,
          adminMemo: item.adminMemo || savedMemos[item.id],
        }));
      }
    } catch (e) {
      console.error('Failed to parse apt_barrier_custom_data_v2', e);
    }
    return list;
  });

  // Load and sync state from server on mount, window focus, and periodic check
  useEffect(() => {
    const loadServerState = () => {
      fetch('/api/load-state')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data === 'object') {
            let savedMemos: Record<string, string> = {};
            try {
              const m = localStorage.getItem('apt_barrier_memos');
              if (m) savedMemos = JSON.parse(m);
            } catch {}

            if (Array.isArray(data.apartments) && data.apartments.length > 0) {
              const serverApts = data.apartments;
              const defaultIds = new Set(APARTMENTS_DATA.map((d) => d.id));
              const serverIds = new Set(serverApts.map((p: ApartmentEntry) => p.id));

              const merged = APARTMENTS_DATA.filter((defaultItem) => serverIds.has(defaultItem.id)).map((defaultItem) => {
                const found = serverApts.find((p: ApartmentEntry) => p.id === defaultItem.id);
                return {
                  ...defaultItem,
                  ...found,
                  siteImage: found?.siteImage || defaultItem.siteImage,
                  adminMemo: found?.adminMemo || savedMemos[defaultItem.id] || defaultItem.adminMemo,
                };
              });
              const customAdded = serverApts.filter((p: ApartmentEntry) => !defaultIds.has(p.id));
              const finalApts = [...merged, ...customAdded];
              setApartments(finalApts);
              saveCustomDataToLocalStorage(finalApts);
            }
          }
        })
        .catch((err) => console.warn('Failed to load server state:', err));
    };

    loadServerState();

    // Sync on window focus (switching tabs or returning to mobile browser)
    const handleFocus = () => {
      loadServerState();
    };
    window.addEventListener('focus', handleFocus);

    // Periodic sync every 15 seconds to ensure multi-device / PC-mobile sync
    const intervalId = setInterval(loadServerState, 15000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  const syncStateToServer = (newApts: ApartmentEntry[]) => {
    fetch('/api/save-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apartments: newApts }),
    }).catch((err) => console.warn('Failed to sync state to server:', err));
  };

  // Modal States
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedAptForImageViewer, setSelectedAptForImageViewer] = useState<ApartmentEntry | null>(null);

  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingImageApt, setEditingImageApt] = useState<ApartmentEntry | null>(null);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);

  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('apt_barrier_admin_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const handleToggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      try {
        localStorage.setItem('apt_barrier_admin_mode', 'false');
      } catch {}
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminMode(true);
    try {
      localStorage.setItem('apt_barrier_admin_mode', 'true');
    } catch {}
  };

  // Local Memos state
  const [memos, setMemos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('apt_barrier_memos');
      const parsed = saved ? JSON.parse(saved) : {};
      // Also extract adminMemo from apartments if present
      const initialMap: Record<string, string> = { ...parsed };
      apartments.forEach((apt) => {
        if (apt.adminMemo && !initialMap[apt.id]) {
          initialMap[apt.id] = apt.adminMemo;
        }
      });
      return initialMap;
    } catch {
      return {};
    }
  });

  const handleSaveMemo = (id: string, text: string) => {
    setApartments((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, adminMemo: text } : item
      );
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });

    const updatedMemos = { ...memos, [id]: text };
    setMemos(updatedMemos);
    try {
      localStorage.setItem('apt_barrier_memos', JSON.stringify(updatedMemos));
    } catch (e) {
      console.error(e);
    }
  };

  // Open Image Viewer Modal
  const handleOpenImageViewer = (apt: ApartmentEntry) => {
    setSelectedAptForImageViewer(apt);
    setIsImageViewerOpen(true);
  };

  // Open Edit Image Modal
  const handleOpenEditImage = (apt: ApartmentEntry) => {
    setEditingImageApt(apt);
    setIsEditImageModalOpen(true);
  };

  // Save Apartment Image & Guide
  const handleSaveImageGuide = (updatedApt: ApartmentEntry) => {
    setApartments((prev) => {
      const updated = prev.map((item) => (item.id === updatedApt.id ? updatedApt : item));
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });

    if (selectedAptForImageViewer && selectedAptForImageViewer.id === updatedApt.id) {
      setSelectedAptForImageViewer(updatedApt);
    }
  };

  // Delete Site Image
  const handleDeleteImage = (itemId: string) => {
    setApartments((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, siteImage: undefined } : item
      );
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });
    if (selectedAptForImageViewer && selectedAptForImageViewer.id === itemId) {
      setSelectedAptForImageViewer((prev) => (prev ? { ...prev, siteImage: undefined } : null));
    }
  };

  // Toggle barrier status (O <-> X)
  const handleToggleBarrier = (id: string) => {
    setApartments((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nextHasBarrier = !item.hasBarrier;
          return {
            ...item,
            hasBarrier: nextHasBarrier,
          };
        }
        return item;
      });
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });
  };

  // Toggle volunteer zone status
  const handleToggleVolunteer = (id: string) => {
    setApartments((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              category: (item.category === 'volunteer' ? 'general' : 'volunteer') as 'general' | 'volunteer',
            }
          : item
      );
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });
  };

  const handleUpdateParkingTip = (id: string, tip: string) => {
    setApartments((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, parkingTip: tip } : item
      );
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });
  };

  // Add new apartment
  const handleAddApartment = (newEntry: ApartmentEntry) => {
    setApartments((prev) => {
      const updated = [newEntry, ...prev];
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });
  };

  // Delete apartment entry
  const handleDeleteApartment = (id: string) => {
    if (!window.confirm('정말 이 아파트(단지) 정보를 삭제하시겠습니까?')) return;
    setApartments((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCustomDataToLocalStorage(updated);
      syncStateToServer(updated);
      return updated;
    });
    if (selectedAptForImageViewer && selectedAptForImageViewer.id === id) {
      setIsImageViewerOpen(false);
      setSelectedAptForImageViewer(null);
    }
  };

  // Distinct villages list
  const villages = useMemo(() => {
    return Array.from(new Set(apartments.map((d) => d.village)));
  }, [apartments]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return apartments.filter((item) => {
      if (selectedVillage !== 'all' && item.village !== selectedVillage) {
        return false;
      }
      if (selectedCategory === 'barrier' && !item.hasBarrier) return false;
      if (selectedCategory === 'noBarrier' && item.hasBarrier) return false;
      if (selectedCategory === 'general' && item.category !== 'general') return false;
      if (selectedCategory === 'volunteer' && item.category !== 'volunteer') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchVillage = item.village.toLowerCase().includes(q);
        const matchName = item.name.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        const matchTips = item.parkingTip?.toLowerCase().includes(q);
        const matchSub = item.subApartments?.some((sub) => sub.toLowerCase().includes(q));

        if (!matchVillage && !matchName && !matchNotes && !matchTips && !matchSub) {
          return false;
        }
      }

      return true;
    });
  }, [apartments, searchQuery, selectedCategory, selectedVillage]);

  // Statistics
  const barrierCount = useMemo(() => apartments.filter((a) => a.hasBarrier).length, [apartments]);
  const noBarrierCount = useMemo(() => apartments.filter((a) => !a.hasBarrier).length, [apartments]);
  const volunteerVillages = useMemo(
    () => new Set(apartments.filter((a) => a.category === 'volunteer').map((a) => a.village)).size,
    [apartments]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleToggleAdminMode}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full pb-28 sm:pb-8">
        {/* Stats Overview Grid */}
        <StatsOverview
          totalCount={apartments.length}
          barrierCount={barrierCount}
          noBarrierCount={noBarrierCount}
          volunteerCount={volunteerVillages}
          onFilterBarrier={(type) => {
            if (type === 'all') {
              setSelectedCategory('all');
              setSelectedVillage('all');
            } else if (type === 'barrier') {
              setSelectedCategory('barrier');
            } else if (type === 'noBarrier') {
              setSelectedCategory('noBarrier');
            } else if (type === 'volunteer') {
              setSelectedCategory('volunteer');
            }
          }}
          activeFilter={selectedCategory}
        />

        {/* Category & Village Filters */}
        <VillageFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedVillage={selectedVillage}
          onSelectVillage={setSelectedVillage}
          villages={villages}
        />

        {/* List Header / View Mode Controls */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 flex-wrap">
            <span>검색 결과:</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md font-bold font-mono">
              {filteredData.length}개
            </span>
            {selectedVillage !== 'all' && (
              <span className="text-slate-400">({selectedVillage})</span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('grid')}
              title="카드 격자 뷰"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">카드</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="표 테이블 뷰"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">표 (테이블)</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-6">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              검색 조건에 맞는 아파트가 없습니다
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              검색어 또는 필터를 변경하여 다시 확인해보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedVillage('all');
              }}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
            >
              전체 목록으로 초기화
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredData.map((item) => (
              <ApartmentCard
                key={item.id}
                item={item}
                onOpenImageViewer={handleOpenImageViewer}
                savedMemo={item.adminMemo || memos[item.id] || ''}
                onSaveMemo={handleSaveMemo}
                onToggleBarrier={handleToggleBarrier}
                onToggleVolunteer={handleToggleVolunteer}
                isAdminMode={isAdminMode}
                onEditImage={handleOpenEditImage}
                onUpdateParkingTip={handleUpdateParkingTip}
                onDeleteApartment={handleDeleteApartment}
              />
            ))}
          </div>
        ) : (
          <BarrierTableView
            items={filteredData}
            onOpenImageViewer={handleOpenImageViewer}
            onToggleBarrier={handleToggleBarrier}
            onToggleVolunteer={handleToggleVolunteer}
            isAdminMode={isAdminMode}
            onEditImage={handleOpenEditImage}
            onDeleteApartment={handleDeleteApartment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-700">부천 상동·중동 아파트 마을별 차단기 현황</span>
          </div>
          <div className="text-slate-400">
            현장 방문·택배·배달·우편 및 편지 봉사자를 위한 안내 도구 (오로지 이미지 기반 관리)
          </div>
        </div>
      </footer>

      {/* Interactive Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        apartment={selectedAptForImageViewer}
        isAdminMode={isAdminMode}
        onEditImage={handleOpenEditImage}
        onDeleteImage={handleDeleteImage}
      />

      {/* Mobile Bottom Navigation Tab Bar */}
      <MobileTabBar
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPdf={() => {
          if (filteredData.length > 0) {
            handleOpenImageViewer(filteredData[0]);
          }
        }}
        barrierCount={barrierCount}
      />

      {/* PWA / Mobile App Installation Instructions Guide */}
      <PwaInstallGuide
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
      />

      {/* Add New Apartment / Complex Modal */}
      <AddApartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApartment={handleAddApartment}
        existingVillages={villages}
      />

      {/* Edit Image Guide Modal */}
      <EditImageModal
        isOpen={isEditImageModalOpen}
        onClose={() => {
          setIsEditImageModalOpen(false);
          setEditingImageApt(null);
        }}
        apartment={editingImageApt}
        onSave={handleSaveImageGuide}
      />

      {/* Admin Password Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
  );
}
