export interface Series {
  id: string;
  name: string;
  description: string;
  createTime: string;
  color: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createTime: string;
  thumbnail: string;
  fullImage: string;
  seriesId: string; // 所属系列 ID
}

export interface ArtworkFormData {
  title: string;
  description: string;
  tags: string;
  imageFile: File | null;
  seriesId: string;
}