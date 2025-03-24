// create Banner

import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { bannerSearchAbleFields } from './banner.constant';
import { IBanner, IBannerFilters } from './banner.interface';

const createBanner = async (bannerData: IBanner) => {
  const result = await prisma.banner.create({
    data: {
      title: bannerData.title,
      description: bannerData.description,
      link: bannerData.link,
      image: {
        connect: {
          id: bannerData.imageId,
        },
      },
    },
  });
  return result;
};

// get all Banners

const getAllBanner = async (
  filters: IBannerFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: bannerSearchAbleFields.map(field => ({
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
            contains: (filtersData as never)[key],
          },
        };
      }),
    });
  }

  const result = await prisma.banner.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      image: true,
    },

    take: limit,

    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.banner.count({
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

// get Banner by id

const getBannerById = async (id: string) => {
  const result = await prisma.banner.findUnique({
    where: {
      id,
    },
    include: {
      image: true,
    },
  });

  if (!result) {
    throw new Error('Banner not found');
  }

  return result;
};

// update Banner

const updateBanner = async (id: string, bannerData: IBanner) => {
  const banner = await prisma.banner.findUnique({
    where: {
      id,
    },
  });

  if (!banner) {
    throw new Error('Banner not found');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let updateData: any = { ...bannerData };

  if (bannerData.imageId) {
    updateData = {
      ...updateData,
      image: {
        connect: {
          id: bannerData.imageId,
        },
      },
    };
  }

  delete updateData.imageId;

  const result = await prisma.banner.update({
    where: {
      id,
    },
    data: updateData,
  });

  return result;
};

// delete Banner

const deleteBanner = async (id: string) => {
  const banner = await prisma.banner.findUnique({
    where: {
      id,
    },
  });

  if (!banner) {
    throw new Error('Banner not found');
  }

  const result = await prisma.banner.delete({
    where: {
      id,
    },
  });

  return result;
};

export const bannerService = {
  createBanner,
  getAllBanner,
  getBannerById,
  updateBanner,
  deleteBanner,
};
