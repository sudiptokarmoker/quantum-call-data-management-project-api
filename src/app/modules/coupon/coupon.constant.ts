export const couponFilterableFields: string[] = [
  'searchTerm',
  'code',
  'discountType',
  'isActive',
  'expirationStatus',
];
export const couponSearchableFields: string[] = ['code'];

export const couponRelationalFields: string[] = ['orders'];

export const couponRelationalFieldsMapper: { [key: string]: string } = {
  orders: 'orders',
};
