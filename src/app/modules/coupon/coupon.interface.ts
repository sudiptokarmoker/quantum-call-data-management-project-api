import { DiscountType } from '@prisma/client';

export type ICoupon = {
  id: string;
  code: string;
  discountAmount: number;
  discountType: DiscountType;
  expirationDate: Date;
  minPurchaseAmount?: number;
  maxUsage?: number;
  isActive?: boolean;
  description?: string;
  usedCount?: number;
};

export type ICouponFilters = {
  searchTerm?: string;
  code?: string;
  discountType?: DiscountType;
  isActive?: 'active' | 'inactive';
  expirationStatus?: 'valid' | 'expired';
};

export type IApplyCouponResponse = {
  isValid: boolean;
  discount: number;
  message: string;
  coupon?: ICoupon;
};
