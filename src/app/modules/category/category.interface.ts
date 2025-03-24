export type ICategory = {
  name: string;
  description: string;
  is_active?: boolean;
  slug: string;
  parent_id?: string;
  image_id?: number;
  CanonicalUrl?: string;
  categorySeoDescription?: string;
  meta_title?: string;
  category_meta_description_in_head?: string;
};

export type ICategoryFilters = {
  searchTerm?: string;
  name?: string;
  slug?: string;
};
