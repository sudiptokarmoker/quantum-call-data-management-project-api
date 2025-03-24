export type ICameraBuilderSave = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  products: {
    categorySlug: string;
    product: {
      id: string;
      quantity: number;
    }[];
  }[];
};
