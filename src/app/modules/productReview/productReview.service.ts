/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  IProductReview,
  IProductReviewFilters,
} from './productReview.interface';

const createProductReview = async (data: IProductReview) => {
  // check product exist or not

  const isExitProduct = await prisma.product.findFirst({
    where: {
      id: data.productId,
    },
  });

  if (!isExitProduct) {
    throw new Error('Product not found');
  }

  // check user exist or not

  const isExitUser = await prisma.user.findFirst({
    where: {
      id: data.userId,
    },
  });

  if (!isExitUser) {
    throw new Error('User not found');
  }

  const productReview = await prisma.productReview.create({
    data: {
      productId: data.productId,
      userId: data.userId,
      review: data.review,
      rating: data.rating,
      status: data.status,
    },
  });

  return productReview;
};

// get all product review

const getAllProductReview = async (
  filters: IProductReviewFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, review, status } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          review: {
            contains: searchTerm,
          },
        },
        {
          status: {
            contains: searchTerm,
          },
        },
      ],
    });
  }

  if (review) {
    andConditions.push({
      review,
    });
  }

  if (status) {
    andConditions.push({
      status,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const productReviews = await prisma.productReview.findMany({
    where: whereConditions,
    include: {
      product: {
        select: {
          name: true,
          id: true,
        },
      },
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
          mobile_number: true,
        },
      },
    },

    take: limit,
    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const totalRecords = await prisma.productReview.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: page,
      total: totalRecords,
      limit: limit,
    },
    data: productReviews,
  };
};

// status change

const changeProductReviewStatus = async (
  id: string,
  status: {
    status: 'approved' | 'pending' | 'rejected';
  },
) => {
  const productReview = await prisma.productReview.update({
    where: {
      id,
    },
    data: {
      status: status?.status,
    },
  });

  return productReview;
};

// delete product review

const deleteProductReview = async (id: string) => {
  const productReview = await prisma.productReview.delete({
    where: {
      id,
    },
  });

  return productReview;
};

export const productReviewService = {
  createProductReview,
  changeProductReviewStatus,
  deleteProductReview,
  getAllProductReview,
};
