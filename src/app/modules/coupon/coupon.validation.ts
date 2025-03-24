import { z } from 'zod';
import { DiscountType } from '@prisma/client';

const createCouponZodSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Coupon code is required',
    }),
    discountAmount: z.number({
      required_error: 'Discount amount is required',
    }),
    discountType: z
      .enum([DiscountType.fixed, DiscountType.percentage])
      .default(DiscountType.fixed),
    expirationDate: z.string({
      required_error: 'Expiration date is required',
    }),
    minPurchaseAmount: z.number().optional(),
    maxUsage: z.number().optional(),
    isActive: z.boolean().optional(),
    description: z.string().optional(),
  }),
});

const updateCouponZodSchema = z.object({
  body: z.object({
    code: z.string().optional(),
    discountAmount: z.number().optional(),
    discountType: z
      .enum([DiscountType.fixed, DiscountType.percentage])
      .optional(),
    expirationDate: z.string().optional(),
    minPurchaseAmount: z.number().optional(),
    maxUsage: z.number().optional(),
    isActive: z.boolean().optional(),
    description: z.string().optional(),
  }),
});

const applyCouponZodSchema = z.object({
  body: z.object({
    code: z.string({
      required_error: 'Coupon code is required',
    }),
    totalAmount: z.number({
      required_error: 'Total amount is required',
    }),
  }),
});

export const CouponValidation = {
  createCouponZodSchema,
  updateCouponZodSchema,
  applyCouponZodSchema,
};
