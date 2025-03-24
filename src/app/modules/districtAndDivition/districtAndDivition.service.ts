// get all district

import { Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

import { IDistrictFilters } from './districtAndDivition.interface';
import { districtSearchAbleFields } from './districtAndDivition.constant';

const getAllDistrict = async (
  filters: IDistrictFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: districtSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm.toLowerCase(),
        },
      })),
    });
  }

  const whereConditions: Prisma.DistrictsWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.districts.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { district_id: 'asc' },
  });

  const total = await prisma.districts.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getAllDivision = async () => {
  const result = await prisma.divitions.findMany({
    include: {
      districts: true,
    },
    orderBy: { division_id: 'asc' },
  });
  return result;
};

export const districtAndDivisionService = {
  getAllDistrict,
  getAllDivision,
};
