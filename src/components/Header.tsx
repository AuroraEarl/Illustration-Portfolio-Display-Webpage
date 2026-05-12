import type { FC } from 'react';

interface HeaderProps {
  onUploadClick: () => void;
  isAdmin: boolean;
}

export const Header: FC<HeaderProps> = (props) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-4-8.494l8 4m-8 0l8-4" />
            </svg>
          </div>
          <span className="text-lg font-medium bg-clip-text text-transparent" style={{
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            插画集
          </span>
        </div>
        
        <button
          onClick={props.onUploadClick}
          className="group relative inline-flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
          aria-label="上传作品"
        >
          <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </header>
  );
};
