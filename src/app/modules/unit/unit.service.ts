import { Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IUnit, IUnitFilters } from './unit.interface';

// create unit
const createUnit = async (payload: IUnit) => {
  // check payload.name is unique or not
  const unit = await prisma.unit.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (unit) {
    throw new Error('Already unit exists with this name');
  }

  const result = await prisma.unit.create({
    data: payload,
  });

  return result;
};

// get all unit

const getAllUnit = async (
  filters: IUnitFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm } = filters;

  const andConditions = [];

  // search by name
  if (searchTerm) {
    andConditions.push({
      name: {
        contains: searchTerm,
      },
    });
  }

  const whereConditions: Prisma.UnitWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.unit.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.unit.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: data,
  };
};

const updateUnit = async (id: string, payload: IUnit) => {
  const unit = await prisma.unit.findUnique({
    where: {
      id,
    },
  });

  if (!unit) {
    throw new Error('Unit not found');
  }

  const result = await prisma.unit.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// delete unit

const deleteUnit = async (id: string) => {
  const unit = await prisma.unit.findUnique({
    where: {
      id,
    },
  });

  if (!unit) {
    throw new Error('Unit not found');
  }

  const result = await prisma.unit.delete({
    where: {
      id,
    },
  });

  return result;
};

export const UnitService = {
  createUnit,
  getAllUnit,
  updateUnit,
  deleteUnit,
};
