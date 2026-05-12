import { useState } from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { ArtworkDetail } from './components/ArtworkDetail';
import { UploadModal } from './components/UploadModal';
import { Footer } from './components/Footer';
import { CoverPage } from './components/CoverPage';
import { SeriesTabs } from './components/SeriesTabs';
import { NewSeriesModal } from './components/NewSeriesModal';
import { PasswordModal } from './components/PasswordModal';
import { useSupabaseArtworks } from './hooks/useSupabaseArtworks';
import type { Artwork } from './types/artwork';
import './index.css';

function App() {
  const {
    series,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    addSeries,
    deleteSeries,
    getArtworksBySeries,
    MINT_COLORS,
  } = useSupabaseArtworks();
  
  const [showCover, setShowCover] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState('default');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewSeriesOpen, setIsNewSeriesOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingAction, setPendingAction] = useState<'upload' | 'newSeries' | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  const filteredArtworks = getArtworksBySeries(selectedSeriesId);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowCover(false);
      setIsTransitioning(false);
    }, 600);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseDetail = () => {
    setSelectedArtwork(null);
  };

  const handleEdit = (artwork: Artwork) => {
    if (!isAdmin) {
      setEditingArtwork(artwork);
      setSelectedArtwork(null);
      setPendingAction('upload');
      setIsPasswordOpen(true);
    } else {
      setEditingArtwork(artwork);
      setSelectedArtwork(null);
      setIsUploadOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteArtwork(id);
    if (!result.success) {
      alert(result.error || '删除失败');
    }
  };

  const handleDeleteSeries = async (id: string) => {
    const result = await deleteSeries(id);
    if (!result.success) {
      alert(result.error || '删除失败');
    } else if (selectedSeriesId === id) {
      setSelectedSeriesId('default');
    }
  };

  const handleUploadClick = () => {
    if (!isAdmin) {
      setPendingAction('upload');
      setIsPasswordOpen(true);
    } else {
      setIsUploadOpen(true);
    }
  };

  const handleAddSeriesClick = () => {
    if (!isAdmin) {
      setPendingAction('newSeries');
      setIsPasswordOpen(true);
    } else {
      setIsNewSeriesOpen(true);
    }
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
    setEditingArtwork(null);
  };

  const handleSubmit = async (data: Omit<Artwork, 'id' | 'createTime'>) => {
    if (editingArtwork) {
      const result = await updateArtwork(editingArtwork.id, data);
      setEditingArtwork(null);
      setIsUploadOpen(false);
      return result;
    } else {
      const result = await addArtwork(data);
      setEditingArtwork(null);
      setIsUploadOpen(false);
      return result;
    }
  };

  const handleNewSeries = async (data: { name: string; description: string; color: string }) => {
    const result = await addSeries(data);
    if (!result.success) {
      alert(result.error || '添加失败');
    }
    setIsNewSeriesOpen(false);
  };

  const handlePasswordSuccess = () => {
    setIsAdmin(true);
    setIsPasswordOpen(false);
    if (pendingAction === 'upload') {
      setIsUploadOpen(true);
    } else if (pendingAction === 'newSeries') {
      setIsNewSeriesOpen(true);
    }
    setPendingAction(null);
  };

  const handlePasswordClose = () => {
    setIsPasswordOpen(false);
    setPendingAction(null);
    setEditingArtwork(null);
  };

  return (
    <div className="min-h-screen">
      {/* 封面页（带滑动动画） */}
      <div 
        className={`fixed inset-0 z-50 transition-transform duration-600 ease-in-out ${isTransitioning ? '-translate-y-full' : ''} ${!showCover && !isTransitioning ? 'hidden' : ''}`}
      >
        {showCover && <CoverPage onEnter={handleEnter} />}
      </div>

      {/* 主内容页 */}
      <div 
        className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 transition-opacity duration-600 ${!showCover ? 'opacity-100' : 'opacity-0'}`}
        style={{ visibility: !showCover ? 'visible' : 'hidden' }}
      >
        {/* 渐变色彩条 */}
        <div 
          className="h-24 w-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffecd2 100%)',
            backgroundSize: '300% 300%',
            animation: 'colorBarShift 20s ease infinite'
          }}
        >
          <h1 
            className="text-2xl md:text-3xl font-bold text-white tracking-widest"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Aurora Earl
          </h1>
          {isAdmin && (
            <span className="ml-4 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              管理员模式
            </span>
          )}
        </div>

        <Header onUploadClick={handleUploadClick} isAdmin={isAdmin} />

        <main className="max-w-6xl mx-auto px-4 pt-8 pb-8">
          <SeriesTabs
            series={series}
            selectedSeriesId={selectedSeriesId}
            onSelectSeries={setSelectedSeriesId}
            onAddSeries={handleAddSeriesClick}
            onDeleteSeries={handleDeleteSeries}
            isAdmin={isAdmin}
          />
          
          <Gallery
            artworks={filteredArtworks}
            onArtworkClick={handleArtworkClick}
          />
        </main>

        <Footer />

        {selectedArtwork && (
          <ArtworkDetail
            artwork={selectedArtwork}
            seriesList={series}
            onClose={handleCloseDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isAdmin={isAdmin}
          />
        )}

        <UploadModal
          isOpen={isUploadOpen}
          onClose={handleUploadClose}
          onSubmit={handleSubmit}
          editData={editingArtwork}
          series={series}
          defaultSeriesId={selectedSeriesId}
        />

        <NewSeriesModal
          isOpen={isNewSeriesOpen}
          onClose={() => setIsNewSeriesOpen(false)}
          onSubmit={handleNewSeries}
          colors={MINT_COLORS}
        />

        <PasswordModal
          isOpen={isPasswordOpen}
          onClose={handlePasswordClose}
          onSuccess={handlePasswordSuccess}
        />
      </div>

      {/* 全局动画样式 */}
      <style>{`
        @keyframes colorBarShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default App;
