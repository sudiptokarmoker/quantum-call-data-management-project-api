/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coupon, DiscountType, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { couponSearchableFields } from './coupon.constant';
import {
  IApplyCouponResponse,
  ICoupon,
  ICouponFilters,
} from './coupon.interface';

// Create coupon
const createCoupon = async (data: ICoupon): Promise<Coupon> => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code: data.code },
  });

  if (existingCoupon) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon code already exists');
  }

  const result = await prisma.coupon.create({
    data,
  });

  return result;
};

// Get all coupons with filters and pagination
const getAllCoupons = async (
  filters: ICouponFilters,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, discountType, isActive, expirationStatus } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: couponSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (discountType) {
    andConditions.push({
      discountType: discountType,
    });
  }

  if (isActive) {
    if (isActive === 'active') {
      andConditions.push({
        isActive: true,
      });
    } else {
      andConditions.push({
        isActive: false,
      });
    }
  }

  if (expirationStatus) {
    if (expirationStatus === 'valid') {
      andConditions.push({
        expirationDate: {
          gt: new Date(),
        },
      });
    } else if (expirationStatus === 'expired') {
      andConditions.push({
        expirationDate: {
          lt: new Date(),
        },
      });
    }
  }

  const whereConditions: Prisma.CouponWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.coupon.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.coupon.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get single coupon
const getSingleCoupon = async (id: string): Promise<Coupon | null> => {
  const result = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }

  return result;
};

// Update coupon
const updateCoupon = async (
  id: string,
  payload: Partial<ICoupon>,
): Promise<Coupon> => {
  const isExist = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }

  const result = await prisma.coupon.update({
    where: { id },
    data: payload,
  });

  return result;
};

// Delete coupon
const deleteCoupon = async (id: string): Promise<Coupon> => {
  const isExist = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }

  const result = await prisma.coupon.delete({
    where: { id },
  });

  return result;
};

// Apply coupon
const applyCoupon = async (
  code: string,
  totalAmount: number,
): Promise<IApplyCouponResponse> => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon) {
    return {
      isValid: false,
      discount: 0,
      message: 'Invalid coupon code',
    };
  }

  if (!coupon.isActive) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon is inactive',
    };
  }

  if (coupon.expirationDate < new Date()) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon has expired',
    };
  }

  if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon usage limit exceeded',
    };
  }

  if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum purchase amount of ${coupon.minPurchaseAmount} required`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === DiscountType.fixed) {
    discountAmount = coupon.discountAmount;
  } else {
    discountAmount = (totalAmount * coupon.discountAmount) / 100;
  }

  // Increment the used count
  await prisma.coupon.update({
    where: { id: coupon.id },
    data: {
      usedCount: {
        increment: 1,
      },
    },
  });

  // Map Prisma Coupon to ICoupon interface
  const mappedCoupon: ICoupon = {
    id: coupon.id,
    code: coupon.code,
    discountAmount: coupon.discountAmount,
    discountType: coupon.discountType,
    expirationDate: coupon.expirationDate,
    minPurchaseAmount: coupon.minPurchaseAmount ?? undefined,
    maxUsage: coupon.maxUsage ?? undefined,
    isActive: coupon.isActive,
    description: coupon.description ?? undefined,
    usedCount: (coupon.usedCount + 1) // Include the incremented used count
  };

  return {
    isValid: true,
    discount: discountAmount,
    message: 'Coupon applied successfully',
    coupon: mappedCoupon,
  };
};

// Update coupon usage
const updateCouponUsage = async (id: string): Promise<void> => {
  await prisma.coupon.update({
    where: { id },
    data: {
      usedCount: {
        increment: 1,
      },
    },
  });
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  updateCouponUsage,
};
