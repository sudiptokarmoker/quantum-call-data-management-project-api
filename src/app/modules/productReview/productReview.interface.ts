export type IProductReview = {
  id: number;
  productId: string;
  userId: string;
  review: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
};

export type IProductReviewFilters = {
  searchTerm?: string;
  review?: string;
  status?: string;
};
