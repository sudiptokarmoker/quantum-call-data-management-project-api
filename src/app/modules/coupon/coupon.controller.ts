import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { couponFilterableFields } from './coupon.constant';
import { CouponService } from './coupon.service';

// Create coupon
const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCoupon(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

// Get all coupons
const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, couponFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CouponService.getAllCoupons(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Get single coupon
const getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getSingleCoupon(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

// Update coupon
const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.updateCoupon(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

// Delete coupon
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.deleteCoupon(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

// Apply coupon
const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, totalAmount } = req.body;
  const result = await CouponService.applyCoupon(code, totalAmount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.isValid,
    message: result.message,
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
