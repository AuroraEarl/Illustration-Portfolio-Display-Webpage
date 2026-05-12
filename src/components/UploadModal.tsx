import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import type { Artwork, ArtworkFormData, Series } from '../types/artwork';
import { uploadImage } from '../lib/storage';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Artwork, 'id' | 'createTime'>) => Promise<{ success: boolean; error?: string }>;
  editData?: Artwork | null;
  series: Series[];
  defaultSeriesId?: string;
}

export const UploadModal: FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  series,
  defaultSeriesId = 'default',
}) => {
  const [formData, setFormData] = useState<ArtworkFormData>({
    title: '',
    description: '',
    tags: '',
    imageFile: null,
    seriesId: defaultSeriesId,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        description: editData.description,
        tags: editData.tags.join(', '),
        imageFile: null,
        seriesId: editData.seriesId,
      });
      setPreview(editData.thumbnail);
    } else if (isOpen) {
      setFormData({
        title: '',
        description: '',
        tags: '',
        imageFile: null,
        seriesId: defaultSeriesId,
      });
      setPreview(null);
    }
  }, [editData, isOpen, defaultSeriesId]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      let imageUrl = preview || '';

      if (formData.imageFile) {
        const uploadResult = await uploadImage(formData.imageFile);
        if (!uploadResult.success) {
          alert(uploadResult.error || '图片上传失败');
          setIsLoading(false);
          return;
        }
        imageUrl = uploadResult.url!;
      }

      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const result = await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags,
        thumbnail: imageUrl,
        fullImage: imageUrl,
        seriesId: formData.seriesId,
      });

      if (!result.success) {
        alert(result.error || '保存失败');
        setIsLoading(false);
        return;
      }

      setFormData({ title: '', description: '', tags: '', imageFile: null, seriesId: defaultSeriesId });
      setPreview(null);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上传失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg m-4 overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {editData ? '编辑作品' : '上传作品'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">所属系列</label>
              <select
                value={formData.seriesId}
                onChange={(e) => setFormData(prev => ({ ...prev, seriesId: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700 bg-white"
              >
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-all duration-300"
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                  />
                  <div className="mt-2 text-sm text-slate-500">点击更换图片</div>
                </div>
              ) : (
                <div className="text-slate-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">点击或拖拽图片到此处</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="作品标题"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="作品简介（可选）"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700 resize-none"
                rows={3}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="标签（用逗号分隔，例如：风景, 插画, 原创）"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.title.trim() || (!preview && !editData)}
              className="w-full py-3 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {isLoading ? '上传中...' : editData ? '保存修改' : '发布作品'}
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
