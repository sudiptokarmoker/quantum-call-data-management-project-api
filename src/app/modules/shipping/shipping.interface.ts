export type IShipping = {
  id?: number;
  price: number;
  districtId: number;
};

export type IShippingFilters = {
  searchTerm?: string;
  price?: number;
};
