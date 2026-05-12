import type { FC } from 'react';
import type { Series } from '../types/artwork';

interface SeriesTabsProps {
  series: Series[];
  selectedSeriesId: string;
  onSelectSeries: (id: string) => void;
  onAddSeries: () => void;
  onDeleteSeries: (id: string) => void;
  isAdmin: boolean;
}

export const SeriesTabs: FC<SeriesTabsProps> = ({
  series,
  selectedSeriesId,
  onSelectSeries,
  onAddSeries,
  onDeleteSeries,
  isAdmin,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">作品系列</h2>
        {isAdmin && (
          <button
            onClick={onAddSeries}
            className="group inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建系列
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        {series.map((s) => (
          <div key={s.id} className="relative group">
            <button
              onClick={() => onSelectSeries(s.id)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedSeriesId === s.id
                  ? 'shadow-xl scale-105'
                  : 'hover:shadow-md hover:scale-105'
              }`}
              style={{
                background: selectedSeriesId === s.id
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: selectedSeriesId === s.id ? 'white' : '#475569',
                border: selectedSeriesId === s.id ? 'none' : '1px solid #e2e8f0'
              }}
            >
              {s.name}
            </button>
            {isAdmin && s.id !== 'default' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`确定要删除系列"${s.name}"吗？该系列下的作品将移至"全部作品"。`)) {
                    onDeleteSeries(s.id);
                  }
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
