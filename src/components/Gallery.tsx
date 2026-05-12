import type { FC } from 'react';
import type { Artwork } from '../types/artwork';

interface GalleryProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export const Gallery: FC<GalleryProps> = ({ artworks, onArtworkClick }) => {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div 
          className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.6
          }}
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xl font-light mb-2">暂无作品</p>
        <p className="text-sm text-slate-400">点击右上角 + 上传您的第一幅作品</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 小红书风格的多列瀑布流 */}
      <style>{`
        .waterfall {
          column-count: 1;
          column-gap: 16px;
        }
        @media (min-width: 640px) {
          .waterfall {
            column-count: 2;
          }
        }
        @media (min-width: 1024px) {
          .waterfall {
            column-count: 3;
          }
        }
        @media (min-width: 1280px) {
          .waterfall {
            column-count: 4;
          }
        }
        .waterfall-item {
          break-inside: avoid;
          margin-bottom: 16px;
        }
      `}</style>
      
      <div className="waterfall">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="waterfall-item">
            <div
              onClick={() => onArtworkClick(artwork)}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl group"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={artwork.thumbnail}
                  alt={artwork.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* 图片悬停时的渐变效果 */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: 'linear-gradient(to top, rgba(102, 126, 234, 0.3) 0%, transparent 60%)'
                  }}
                />
                {/* 查看图标 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transform: 'scale(0.8)',
                      transition: 'transform 0.4s'
                    }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 
                  className="text-lg font-semibold mb-3 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {artwork.title}
                </h3>
                
                {/* 标签 */}
                {artwork.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {artwork.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full text-white"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          opacity: 0.9
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* 简介（如果有） */}
                {artwork.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {artwork.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};