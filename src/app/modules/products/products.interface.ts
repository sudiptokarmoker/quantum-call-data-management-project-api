/* eslint-disable @typescript-eslint/no-explicit-any */
export type IProduct = {
  id: string;
  name: string;
  specification: string;
  key_features: string;
  description?: string;
  images: any;
  thumbnailId?: any;
  dynamic_banner_id?: any;
  video_link?: string;
  selling_price: number;
  regular_price: number;
  special_price?: number;
  stock: number;
  slug: string;
  is_active: boolean;
  unit: string;
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
  brandId?: any;
  // attribute?: any;
  ProductAttribute: IProductAttribute[];
  outlet?: any;
  category?: any;
  sku?: string;
  product_code?: number;
  tags?: any;
  is_featured?: boolean;
  product_type?: 'physical' | 'digital';
  lowStockAlert?: number;
  watt: number;

  seo_id?: any;
  seo?: ISeo | undefined;
  CanonicalUrl?: string;

  warranty: number;
  warranty_time?: 'day' | 'month' | 'year';
  product_disclaimer?: string;
};

export type IProductAttribute = {
  attributeValue: string[];
  atrributeId: string;
};

type ISeo = {
  title: string;
  description: string;
  meta_description_in_head?: string;
};

export type ProductImage = {
  productId: string;

  imageId: number;
};

export type IProductFilters = {
  searchTerm?: string;
  name?: string;
  selling_price?: string;
  regular_price?: string;
  special_price?: string;
  stock?: string;
  unit?: string;
  weight?: string;
  slug?: string;
  Brand?: string;
  attribute?: string;
  outlet?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  attributeValueId?: string;
  BrandIds?: string;
  CategoryIds?: string;
  outletIds?: string;
  CanonicalUrl?: string;
  pc_builder_parent_product_ids?: string;
  camera_builder_parent_product_ids?: string;

  warranty?: string;
  warranty_time?: 'day' | 'month' | 'year';
};
