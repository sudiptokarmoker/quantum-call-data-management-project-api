import { IPaginationOptions } from './../../../interfaces/pagination';
import { IPopularSearchProductFilters } from './popularSearchProduct.interface';
// create popularSearchProduct

import prisma from '../../../shared/prisma';
import { IPopularSearchProduct } from './popularSearchProduct.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createPopularSearchProduct = async (
  popularSearchProduct: IPopularSearchProduct,
) => {
  // check product already exists then count + 1

  const popularSearchProductExists =
    await prisma.popularSearchProduct.findFirst({
      where: {
        productId: popularSearchProduct.productId,
      },
    });

  if (popularSearchProductExists) {
    await prisma.popularSearchProduct.update({
      where: {
        id: popularSearchProductExists.id,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.popularSearchProduct.create({
      data: {
        productId: popularSearchProduct.productId,
        count: 1,
      },
    });
  }

  return true;
};

// get  all popular search product

const getAllPopularSearchProduct = async (
  filters: IPopularSearchProductFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  let { searchTerm } = filters;

  const andConditions = [];

  //   if search term exists then search by product name

  if (searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    andConditions.push({
      product: {
        name: {
          contains: searchTerm,
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const popularSearchProduct = await prisma.popularSearchProduct.findMany({
    where: whereConditions,
    include: {
      product: {
        select: {
          name: true,
          id: true,
          slug: true,
          selling_price: true,
          special_price: true,
          regular_price: true,
          stock: true,
          Offers: {
            include: {
              banner: true,
            },
          },

          thumbnail: {
            select: {
              id: true,
              image: true,
            },
          },
          category:true
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

  const total = await prisma.popularSearchProduct.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      total,
      limit,
    },
    data: popularSearchProduct,
  };
};

export const popularSearchProductService = {
  createPopularSearchProduct,
  getAllPopularSearchProduct,
};
