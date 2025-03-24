import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBecomeDealer, IBecomeDealerFilters } from './becomeDealer.interface';

// create become dealer
const createBecomeDealer = async (becomeDealerData: IBecomeDealer) => {
  // create become dealer
  const result = await prisma.becomeDealer.create({
    data: becomeDealerData,
  });
  return result;
};

// get all become dealers

const getAllBecomeDealers = async (
  filters: IBecomeDealerFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: ['name', 'companyName', 'email'].map(field => ({
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            contains: (filtersData as any)[key],
          },
        };
      }),
    });
  }

  const result = await prisma.becomeDealer.findMany({
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

  const count = await prisma.becomeDealer.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      total: count,
      page,
      limit,
    },
  };
};

export const BecomeDealerService = {
  createBecomeDealer,
  getAllBecomeDealers,
};
