export type IBlogCategory = {
  name: string;
  is_active?: boolean;
};

export type IBlogCategoryFilters = {
  searchTerm?: string;
  name?: string;
  
};
