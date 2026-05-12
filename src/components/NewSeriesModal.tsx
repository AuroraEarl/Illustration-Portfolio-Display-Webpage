import { useState } from 'react';
import type { FC } from 'react';

interface NewSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; color: string }) => void;
  colors: string[];
}

export const NewSeriesModal: FC<NewSeriesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  colors,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    });
    setName('');
    setDescription('');
    setSelectedColor(colors[0]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md m-4 overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-mint-700">
              创建新系列
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">系列名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：风景系列"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-100 outline-none transition-all text-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">系列描述（可选）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述这个系列的主题"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-100 outline-none transition-all text-gray-700 resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">选择颜色</label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-gray-800 scale-110 shadow-lg'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-mint-500 text-white font-medium hover:bg-mint-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
              style={{ backgroundColor: selectedColor }}
            >
              创建系列
            </button>
          </form>
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