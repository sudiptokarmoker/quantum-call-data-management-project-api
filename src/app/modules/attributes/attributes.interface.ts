export type IAttribute = {
  name: string;
  is_active?: boolean;
  attributeValue: string[];
};

export type IAttributeFilters = {
  searchTerm?: string;
  name?: string;
  attributeValue?: string;
};
