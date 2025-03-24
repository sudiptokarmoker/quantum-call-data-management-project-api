export type IBanner = {
  title: string;
  description: string;
  imageId: number;
  is_active?: boolean;
  link: string;
};

export type IBannerFilters = {
  searchTerm?: string;
  title?: string;
};
