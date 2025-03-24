/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { brandSearchAbleFields } from './brand.constant';
import { IBrand, IBrandFilters } from './brand.interface';

// create brand
const createBrand = async (brand: IBrand) => {
  if (!brand) {
    throw new Error('please provide brand details');
  }

  const result = await prisma.brand.create({
    data: brand,
  });
  return result;
};

// get all brands
const getAllBrands = async (
  filters: IBrandFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: brandSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm.toLowerCase(),
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            equals: (filtersData as any)[key].toLowerCase(),
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.BrandWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.brand.findMany({
    where: whereConditions,
    include: {
      image: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.brand.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get brand by id
const getBrandById = async (id: string) => {
  const result = await prisma.brand.findUnique({
    where: {
      id,
    },
    include: {
      image: true,
    },
  });

  if (!result) {
    throw new Error('Brand not found');
  }

  return result;
};

// update brand
const updateBrand = async (id: string, payload: IBrand) => {
  // find brand by id
  const getBrand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  // if brand not found
  if (!getBrand) {
    throw new Error('Brand not found');
  }

  const result = await prisma.brand.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// delete brand

const deleteBrand = async (id: string) => {
  // find brand by id
  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  // if brand not found
  if (!brand) {
    throw new Error('Brand not found');
  }

  const result = await prisma.brand.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
