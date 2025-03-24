export const productsFilterableFields: string[] = [
  'searchTerm',
  'name',
  'selling_price',
  'regular_price',
  'special_price',
  'stock',
  'unit',
  'weight',
  'slug',
  'Brand',
  'attribute',
  'outlet',
  'category',
  'minPrice',
  'maxPrice',
  'attributeValueId',
  'BrandIds',
  'CategoryIds',
  'outletIds',
  'CanonicalUrl',
  'warranty',
  'warranty_time',
  'pc_builder_parent_product_ids',
  'camera_builder_parent_product_ids',
  'product_code',
];

export const productsSearchAbleFields: string[] = [
  'name',
  'slug',
  'selling_price',
  'regular_price',
  'special_price',
  'stock',
  'unit',
  'CanonicalUrl',
  'weight',
  'warranty',
  'product_code',
];

export const productsRelationalFields: string[] = [
  'Brand',
  'attribute',
  'outlet',
  'category',
];

export const productsRelationalFieldsMapper: { [key: string]: string } = {
  Brand: 'Brand',
  attribute: 'attribute',
  outlet: 'outlet',
  category: 'category',
};
