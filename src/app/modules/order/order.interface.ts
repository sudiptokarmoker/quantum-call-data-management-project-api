export type IOrderProduct = {
  productId: string;
  quantity: number;
  price: number;
  total: number;
};

export type IOrder = {
  userId: string;
  addressId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  subTotal?: number;
  shippingAmount?: number;
  discountAmount?: number;
  total?: number;
  paymentMethod: 'cash_on_delivery' | 'online_payment';
  isPaid: boolean;
  products: IOrderProduct[];
  couponCode?: string;
};

export type IOrderFilters = {
  searchTerm?: string;
  orderId?: string;
  status?: string;
  isPaid?: string;
  paymentMethod?: string;
};
