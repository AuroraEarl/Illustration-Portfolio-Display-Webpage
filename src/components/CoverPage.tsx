import type { FC } from 'react';

interface CoverPageProps {
  onEnter: () => void;
}

export const CoverPage: FC<CoverPageProps> = ({ onEnter }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffecd2 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}
      onClick={onEnter}
    >
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'rgba(255,255,255,0.5)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'rgba(255,255,255,0.4)' }}
        />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center px-8">
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, #ffffff, #f0f9ff, #e0f2fe, #ffffff)',
            textShadow: '0 0 40px rgba(255,255,255,0.5)'
          }}
        >
          Aurora Earl
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-12 font-light tracking-wide">
          Illustration Portfolio
        </p>

        {/* 进入按钮 */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
          className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-purple-900 bg-white/90 rounded-full shadow-2xl hover:shadow-white/40 hover:scale-105 transition-all duration-300"
        >
          <span>进入画廊</span>
          <svg 
            className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* 底部提示 */}
      <div className="absolute bottom-12 left-0 right-0 text-center text-white/70 text-sm animate-bounce">
        点击任意位置或按钮进入
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};
