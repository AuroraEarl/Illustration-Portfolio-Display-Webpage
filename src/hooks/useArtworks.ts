import { useState, useEffect, useCallback } from 'react';
import type { Artwork, Series } from '../types/artwork';

const STORAGE_KEY_ARTWORKS = 'aurora-earl-artworks';
const STORAGE_KEY_SERIES = 'aurora-earl-series';

// 预设的薄荷绿色系颜色
const MINT_COLORS = [
  '#10B981', // 主薄荷绿
  '#059669', // 深薄荷绿
  '#34D399', // 浅薄荷绿
  '#6EE7B7', // 更浅薄荷绿
  '#047857', // 深绿
  '#065F46', // 最深绿
];

// 更简单的示例数据（使用简单的SVG）
const createSimpleSVG = (color: string, height: number) => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="${height}" viewBox="0 0 300 ${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`;
};

const DEFAULT_SERIES: Series[] = [
  {
    id: 'default',
    name: '全部作品',
    description: '所有插画作品',
    createTime: new Date().toISOString(),
    color: MINT_COLORS[0],
  },
];

const DEFAULT_ARTWORKS: Artwork[] = [
  {
    id: 'demo1',
    title: '我的第一幅作品',
    description: '这是一幅美丽的插画',
    tags: ['插画', '艺术'],
    createTime: new Date().toISOString(),
    thumbnail: createSimpleSVG('#D1FAE5', 400),
    fullImage: createSimpleSVG('#D1FAE5', 600),
    seriesId: 'default',
  },
  {
    id: 'demo2',
    title: '灵感创作',
    description: '一次灵感爆发的创作',
    tags: ['创意', '灵感'],
    createTime: new Date().toISOString(),
    thumbnail: createSimpleSVG('#A7F3D0', 500),
    fullImage: createSimpleSVG('#A7F3D0', 700),
    seriesId: 'default',
  },
];

// 安全的localStorage操作
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn('localStorage setItem failed:', e);
    return false;
  }
};

const safeGetItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage getItem failed:', e);
    return null;
  }
};

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    const storedArtworks = safeGetItem(STORAGE_KEY_ARTWORKS);
    const storedSeries = safeGetItem(STORAGE_KEY_SERIES);
    
    let loadedArtworks: Artwork[];
    let loadedSeries: Series[];

    // 尝试加载保存的数据
    if (storedArtworks) {
      try {
        loadedArtworks = JSON.parse(storedArtworks);
      } catch {
        loadedArtworks = DEFAULT_ARTWORKS;
      }
    } else {
      loadedArtworks = DEFAULT_ARTWORKS;
    }

    if (storedSeries) {
      try {
        loadedSeries = JSON.parse(storedSeries);
      } catch {
        loadedSeries = DEFAULT_SERIES;
      }
    } else {
      loadedSeries = DEFAULT_SERIES;
    }

    // 确保默认系列存在
    const hasDefault = loadedSeries.some(s => s.id === 'default');
    if (!hasDefault) {
      loadedSeries = [DEFAULT_SERIES[0], ...loadedSeries];
    }

    setArtworks(loadedArtworks);
    setSeries(loadedSeries);
    
    // 确保数据保存到localStorage
    safeSetItem(STORAGE_KEY_ARTWORKS, JSON.stringify(loadedArtworks));
    safeSetItem(STORAGE_KEY_SERIES, JSON.stringify(loadedSeries));
  }, []);

  const addArtwork = useCallback((artwork: Artwork) => {
    setArtworks(prev => {
      const updated = [artwork, ...prev];
      safeSetItem(STORAGE_KEY_ARTWORKS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateArtwork = useCallback((id: string, updates: Partial<Artwork>) => {
    setArtworks(prev => {
      const updated = prev.map(art =>
        art.id === id ? { ...art, ...updates } : art
      );
      safeSetItem(STORAGE_KEY_ARTWORKS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteArtwork = useCallback((id: string) => {
    setArtworks(prev => {
      const updated = prev.filter(art => art.id !== id);
      safeSetItem(STORAGE_KEY_ARTWORKS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addSeries = useCallback((newSeries: Omit<Series, 'id' | 'createTime'>) => {
    const seriesWithId: Series = {
      ...newSeries,
      id: Math.random().toString(36).substring(2, 15),
      createTime: new Date().toISOString(),
    };
    setSeries(prev => {
      const updated = [...prev, seriesWithId];
      safeSetItem(STORAGE_KEY_SERIES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSeries = useCallback((id: string, updates: Partial<Series>) => {
    setSeries(prev => {
      const updated = prev.map(s =>
        s.id === id ? { ...s, ...updates } : s
      );
      safeSetItem(STORAGE_KEY_SERIES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteSeries = useCallback((id: string) => {
    if (id === 'default') return; // 不能删除默认系列
    setSeries(prev => {
      const updated = prev.filter(s => s.id !== id);
      safeSetItem(STORAGE_KEY_SERIES, JSON.stringify(updated));
      return updated;
    });
    // 删除该系列下的作品，或者移到默认系列
    setArtworks(prev => {
      const updated = prev.map(art =>
        art.seriesId === id ? { ...art, seriesId: 'default' } : art
      );
      safeSetItem(STORAGE_KEY_ARTWORKS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getArtworksBySeries = useCallback((seriesId: string) => {
    if (seriesId === 'default') {
      return artworks;
    }
    return artworks.filter(art => art.seriesId === seriesId);
  }, [artworks]);

  return {
    artworks,
    series,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    addSeries,
    updateSeries,
    deleteSeries,
    getArtworksBySeries,
    MINT_COLORS,
  };
}
