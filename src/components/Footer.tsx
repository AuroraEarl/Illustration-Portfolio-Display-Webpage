import type { FC } from 'react';

export const Footer: FC = () => {
  return (
    <footer className="py-12 text-center border-t border-slate-200/50 mt-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
      </div>
      <p className="text-slate-600 mb-2 font-light">
        © 2026 Aurora Earl · 插画作品集
      </p>
      <p className="text-sm text-slate-400">
        Original Made · All rights reserved
      </p>
    </footer>
  );
};