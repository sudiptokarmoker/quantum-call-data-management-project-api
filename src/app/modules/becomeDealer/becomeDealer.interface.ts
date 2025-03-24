export type IBecomeDealer = {
  name: string;
  email: string;
  number: string;
  message?: string;
  companyName: string;
};

export type IBecomeDealerFilters = {
  searchTerm?: string;
  name?: string;
  companyName?: string;
  email?: string;
};
