import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import type { Artwork, Series } from '../types/artwork';

interface ArtworkDetailProps {
  artwork: Artwork;
  seriesList: Series[];
  onClose: () => void;
  onEdit: (artwork: Artwork) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export const ArtworkDetail: FC<ArtworkDetailProps> = ({
  artwork,
  seriesList,
  onClose,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const series = seriesList.find(s => s.id === artwork.seriesId);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
    };

    const imageEl = imageRef.current;
    if (imageEl) {
      imageEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (imageEl) {
        imageEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这篇作品吗？')) {
      onDelete(artwork.id);
      onClose();
    }
  };

  const addWatermark = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas not found'));
          return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not found'));
          return;
        }
        
        // 设置canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制原图
        ctx.drawImage(img, 0, 0);
        
        // 添加水印 - 右下角
        const watermarkText = '@Aurora Earl';
        ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.06}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 3;
        
        const textWidth = ctx.measureText(watermarkText).width;
        const x = canvas.width - textWidth - 30;
        const y = canvas.height - 30;
        
        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
        
        // 再添加几个水印 - 对角线
        ctx.font = `${Math.min(canvas.width, canvas.height) * 0.03}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        
        const diagonalText = 'Aurora Earl';
        for (let i = 0; i < 3; i++) {
          const dx = (canvas.width / 4) * (i + 1);
          const dy = (canvas.height / 4) * (i + 1);
          ctx.fillText(diagonalText, dx, dy);
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // 导出为低质量JPEG
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = artwork.thumbnail; // 使用缩略图（低画质）
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const watermarkedImage = await addWatermark();
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = watermarkedImage;
      link.download = `${artwork.title}_@AuroraEarl.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      {/* 隐藏的canvas用于加水印 */}
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] m-4 flex flex-col lg:flex-row overflow-hidden shadow-2xl animate-scaleIn">
        <div
          ref={imageRef}
          className="lg:w-2/3 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing relative"
          style={{ minHeight: '400px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 使用缩略图显示，降低质量 */}
          <img
            src={artwork.thumbnail}
            alt={artwork.title}
            className="max-w-full max-h-full object-contain transition-transform duration-100"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              filter: 'contrast(0.95) saturate(0.95)', // 稍微降低画质
              imageRendering: 'pixelated', // 像素化效果
            }}
            draggable={false}
          />
          {scale > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              滚轮缩放 · 拖拽移动
            </div>
          )}
        </div>

        <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex-1 overflow-y-auto">
            {series && (
              <div className="mb-3">
                <span
                  className="inline-block px-3 py-1 text-xs rounded-full text-white"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {series.name}
                </span>
              </div>
            )}
            <h2 
              className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {artwork.title}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {formatDate(artwork.createTime)}
            </p>

            {artwork.description && (
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {artwork.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full text-white"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0.9,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-slate-200">
            {/* 下载按钮 */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载
                </>
              )}
            </button>
            
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(artwork)}
                  className="flex-1 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  编辑
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 text-sm text-slate-400 hover:text-red-500 font-medium transition-colors bg-slate-100 hover:bg-red-50 rounded-lg"
                >
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};
