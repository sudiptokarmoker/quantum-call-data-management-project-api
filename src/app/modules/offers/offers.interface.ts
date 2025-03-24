export type IOffer = {
  id: number;
  title: string;
  description: string;
  banner_id: number;
  offerStartTime: string;
  offerEndTime: string;
  offerType: 'store' | 'online';
  discountType: 'percentage' | 'fixed';
  discount: number;
  isShowedHome: boolean;
  product?: string[];
};

export type IOfferFilters = {
  searchTerm?: string;
  title?: string;
  offerStartTime?: string;
  offerEndTime?: string;
  offerType?: string;
  isShowedHome?: any;
};
