export type IOutlet = {
  name: string;
  address: string;
  email: string;
  phone: string;
  is_active?: boolean;
};

export type IOutletFilters = {
  searchTerm?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};
