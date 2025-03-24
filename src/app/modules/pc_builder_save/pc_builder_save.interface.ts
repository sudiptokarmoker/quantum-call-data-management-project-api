export type IPCBuilderSave = {
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
