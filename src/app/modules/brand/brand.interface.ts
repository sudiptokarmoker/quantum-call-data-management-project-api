export type IBrand = {
  name: string;
  description: string;
  is_active?: boolean;
  imageId?: number;
};

export type IBrandFilters = {
  searchTerm?: string;
  name?: string;
};
