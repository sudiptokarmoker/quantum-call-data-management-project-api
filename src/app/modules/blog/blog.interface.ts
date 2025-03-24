export type IBlog = {
  title: string;
  description: string;
  is_active?: boolean;
  blogCategoryId: string;
  meta_title?: string;
  meta_description?: string;
};

export type IBlogFilters = {
  searchTerm?: string;
  title?: string;
};
