// create searchVolume

import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { ISearchVolume, ISearchVolumeFilters } from './searchVolume.interface';

const createSearchVolume = async (searchVolume: ISearchVolume) => {
  const searchVolumeExists = await prisma.searchVolume.findFirst({
    where: {
      keyword: searchVolume?.keyword,
    },
  });

  if (searchVolumeExists) {
    await prisma.searchVolume.update({
      where: {
        id: searchVolumeExists.id,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } else {
    await prisma.searchVolume.create({
      data: {
        keyword: searchVolume.keyword,
        count: 1,
      },
    });
  }

  return true;
};

// get all search volume

const getAllSearchVolume = async (
  filters: ISearchVolumeFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      keyword: {
        contains: searchTerm,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const searchVolume = await prisma.searchVolume.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.searchVolume.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      total,
      limit,
    },
    data: searchVolume,
  };
};

export const searchVolumeService = {
  createSearchVolume,
  getAllSearchVolume,
};
