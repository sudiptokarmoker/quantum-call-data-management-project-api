/* eslint-disable @typescript-eslint/no-explicit-any */
export type IPcBuilderRelationalProduct = {
  id: string;
  parent_product_id: string;
  relative_product_id: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type IRelationalProductRequest = {
  parent_product_id: string;
  relative_product_id: string[];
};
