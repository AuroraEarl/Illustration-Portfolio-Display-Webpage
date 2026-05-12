import { supabase } from './supabase';

export const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not found'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file: File, folder: string = 'artworks', compress: boolean = true): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    let fileToUpload: File | Blob = file;
    const originalFileName = file.name;

    if (compress) {
      const compressedDataUrl = await compressImage(file);
      const response = await fetch(compressedDataUrl);
      fileToUpload = await response.blob();
      const fileExt = originalFileName.split('.').pop();
      const compressedFileName = `compressed_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt || 'jpg'}`;
      fileToUpload = new File([fileToUpload], compressedFileName, { type: 'image/jpeg' });
    }

    const fileExt = (fileToUpload as File).name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt || 'jpg'}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from('artworks')
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (err) {
    console.error('Upload exception:', err);
    return { success: false, error: '上传失败，请重试' };
  }
};

export const deleteImage = async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${fileName}`;

    const { error: deleteError } = await supabase.storage
      .from('artworks')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return { success: false, error: deleteError.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete exception:', err);
    return { success: false, error: '删除图片失败' };
  }
};

export const generateThumbnailUrl = (imageUrl: string): string => {
  return imageUrl;
};
