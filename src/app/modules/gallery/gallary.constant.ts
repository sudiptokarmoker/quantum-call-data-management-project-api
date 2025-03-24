export type IGalleryFilters = {
  searchTerm?: string;
  name?: string;
};

export const galleryFilterableFields: string[] = ['searchTerm', 'name'];

export const gallerySearchAbleFields: string[] = ['name'];
