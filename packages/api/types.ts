export interface Category {
  id: number;
  name: string;
  created_time: Date;
  sort_order: number;
  featured_photo_id?: number;
}

export interface CategoryWithFeaturePhoto extends Category {
  photo_id?: number;
  photo_xs?: string;
  photo_xs_width?: number;
  photo_xs_height?: number;
  photo_s?: string;
  photo_s_width?: number;
  photo_s_height?: number;
  photo_m?: string;
  photo_m_width?: number;
  photo_m_height?: number;
  photo_l?: string;
  photo_l_width?: number;
  photo_l_height?: number;
  blurhash?: string;
}
