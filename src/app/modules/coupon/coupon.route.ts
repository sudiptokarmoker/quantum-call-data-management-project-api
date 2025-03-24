import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';

const router = express.Router();

// Create coupon
router.post(
  '/',

  validateRequest(CouponValidation.createCouponZodSchema),
  CouponController.createCoupon,
);

// Apply coupon
router.post(
  '/apply',
  validateRequest(CouponValidation.applyCouponZodSchema),
  CouponController.applyCoupon,
);

// Get all coupons
router.get('/', CouponController.getAllCoupons);

// Get single coupon
router.get('/:id', CouponController.getSingleCoupon);

// Update coupon
router.patch(
  '/:id',

  validateRequest(CouponValidation.updateCouponZodSchema),
  CouponController.updateCoupon,
);

// Delete coupon
router.delete('/:id', CouponController.deleteCoupon);

export const CouponRoutes = router;
