import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Artwork, Series } from '../types/artwork';

const MINT_COLORS = [
  '#10B981',
  '#059669',
  '#34D399',
  '#6EE7B7',
  '#047857',
  '#065F46',
];

const DEFAULT_SERIES: Series[] = [
  {
    id: 'default',
    name: '全部作品',
    description: '所有插画作品',
    createTime: new Date().toISOString(),
    color: MINT_COLORS[0],
  },
];

export function useSupabaseArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedArtworks: Artwork[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        tags: item.tags || [],
        thumbnail: item.thumbnail_url,
        fullImage: item.full_image_url || item.thumbnail_url,
        seriesId: item.series_id || 'default',
        createTime: item.created_at,
      }));

      setArtworks(mappedArtworks);
    } catch (err) {
      console.error('Error fetching artworks:', err);
      setError('加载作品失败');
    }
  }, []);

  const fetchSeries = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      let mappedSeries: Series[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        color: item.color || MINT_COLORS[0],
        createTime: item.created_at,
      }));

      const hasDefault = mappedSeries.some(s => s.id === 'default');
      if (!hasDefault) {
        mappedSeries = [DEFAULT_SERIES[0], ...mappedSeries];
      }

      setSeries(mappedSeries);
    } catch (err) {
      console.error('Error fetching series:', err);
      setError('加载系列失败');
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchArtworks(), fetchSeries()]);
      setLoading(false);
    };

    initializeData();
  }, [fetchArtworks, fetchSeries]);

  const addArtwork = useCallback(async (artwork: Omit<Artwork, 'id' | 'createTime'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('artworks')
        .insert([
          {
            title: artwork.title,
            description: artwork.description,
            tags: artwork.tags,
            thumbnail_url: artwork.thumbnail,
            full_image_url: artwork.fullImage,
            series_id: artwork.seriesId,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      const newArtwork: Artwork = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        tags: data.tags || [],
        thumbnail: data.thumbnail_url,
        fullImage: data.full_image_url || data.thumbnail_url,
        seriesId: data.series_id || 'default',
        createTime: data.created_at,
      };

      setArtworks(prev => [newArtwork, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Error adding artwork:', err);
      return { success: false, error: '添加作品失败' };
    }
  }, []);

  const updateArtwork = useCallback(async (id: string, updates: Partial<Artwork>) => {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.thumbnail) updateData.thumbnail_url = updates.thumbnail;
      if (updates.fullImage) updateData.full_image_url = updates.fullImage;
      if (updates.seriesId) updateData.series_id = updates.seriesId;
      updateData.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('artworks')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      setArtworks(prev =>
        prev.map(art =>
          art.id === id ? { ...art, ...updates } : art
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error updating artwork:', err);
      return { success: false, error: '更新作品失败' };
    }
  }, []);

  const deleteArtwork = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setArtworks(prev => prev.filter(art => art.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting artwork:', err);
      return { success: false, error: '删除作品失败' };
    }
  }, []);

  const addSeries = useCallback(async (newSeries: Omit<Series, 'id' | 'createTime'>) => {
    try {
      const seriesId = Math.random().toString(36).substring(2, 15);
      const { data, error: insertError } = await supabase
        .from('series')
        .insert([
          {
            id: seriesId,
            name: newSeries.name,
            description: newSeries.description,
            color: newSeries.color,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      const seriesWithId: Series = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        color: data.color || MINT_COLORS[0],
        createTime: data.created_at,
      };

      setSeries(prev => [...prev, seriesWithId]);
      return { success: true };
    } catch (err) {
      console.error('Error adding series:', err);
      return { success: false, error: '添加系列失败' };
    }
  }, []);

  const updateSeries = useCallback(async (id: string, updates: Partial<Series>) => {
    try {
      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.color) updateData.color = updates.color;

      const { error: updateError } = await supabase
        .from('series')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      setSeries(prev =>
        prev.map(s =>
          s.id === id ? { ...s, ...updates } : s
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error updating series:', err);
      return { success: false, error: '更新系列失败' };
    }
  }, []);

  const deleteSeries = useCallback(async (id: string) => {
    if (id === 'default') return { success: false, error: '不能删除默认系列' };

    try {
      const { error: deleteError } = await supabase
        .from('series')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSeries(prev => prev.filter(s => s.id !== id));
      setArtworks(prev =>
        prev.map(art =>
          art.seriesId === id ? { ...art, seriesId: 'default' } : art
        )
      );
      return { success: true };
    } catch (err) {
      console.error('Error deleting series:', err);
      return { success: false, error: '删除系列失败' };
    }
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
    loading,
    error,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    addSeries,
    updateSeries,
    deleteSeries,
    getArtworksBySeries,
    MINT_COLORS,
    refetch: () => {
      fetchArtworks();
      fetchSeries();
    },
  };
}
