/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { outletSearchAbleFields } from './outlet.constant';
import { IOutlet, IOutletFilters } from './outlet.interface';

// create Outlet
const createOutlet = async (outletData: IOutlet) => {
  // create blog
  const result = await prisma.outlet.create({
    data: outletData,
  });
  return result;
};

// get all Outlet
const getAllOutlet = async (
  filters: IOutletFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: outletSearchAbleFields.map(field => ({
        [field]: {
          contains: lowerCaseSearchTerm,
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            contains: (filtersData as any)[key],
          },
        };
      }),
    });
  }

  const result = await prisma.outlet.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.outlet.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

// get Outlet by id
const getOutletById = async (id: string) => {
  // get Outlet by id
  const result = await prisma.outlet.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error('Outlet not found');
  }

  return result;
};

// update Outlet

const updateOutlet = async (id: string, outletData: IOutlet) => {
  // get Outlet by id
  const Outlet = await prisma.outlet.findUnique({
    where: {
      id,
    },
  });

  if (!Outlet) {
    throw new Error('Outlet not found');
  }

  // update Outlet
  const result = await prisma.outlet.update({
    where: {
      id,
    },
    data: outletData,
  });

  return result;
};

// delete Outlet

const deleteOutlet = async (id: string) => {
  // get Outlet by id
  const Outlet = await prisma.outlet.findUnique({
    where: {
      id,
    },
  });

  if (!Outlet) {
    throw new Error('Outlet not found');
  }

  // delete Outlet
  const result = await prisma.outlet.delete({
    where: {
      id,
    },
  });

  return result;
};

export const OutletService = {
  createOutlet,
  getAllOutlet,
  getOutletById,
  updateOutlet,
  deleteOutlet,
};
