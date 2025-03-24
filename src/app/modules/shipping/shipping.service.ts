// create shopping

import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IShipping, IShippingFilters } from './shipping.interface';

const createShipping = async (shipping: IShipping) => {
  // Validate the shipping object
  if (!shipping.price) {
    throw new Error('Price is missing');
  } else if (!shipping.districtId) {
    throw new Error('DistrictId is missing');
  }

  // check if the districtId already exists

  const existingShipping = await prisma.shipping.findFirst({
    where: {
      districtId: Number(shipping.districtId),
    },
  });

  if (existingShipping) {
    throw new Error('Shipping already exists');
  }

  // Create the shipping

  const newShipping = await prisma.shipping.create({
    data: {
      price: Number(shipping.price),
      districtId: Number(shipping.districtId),
    },
  });

  return newShipping;
};

// get all shippings

const getShippings = async (
  filters: IShippingFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm } = filters;

  const andConditions = [];

  if (searchTerm) {
    const orConditions = [];
    const price = Number(searchTerm);

    if (!isNaN(price)) {
      orConditions.push({ price });
    }

    orConditions.push({
      district: {
        name: {
          contains: searchTerm.toLowerCase(),
        },
      },
    });

    andConditions.push({ OR: orConditions });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const shippings = await prisma.shipping.findMany({
    where: whereConditions,
    include: {
      district: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.shipping.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: shippings,
  };
};

// update shipping

const updateShipping = async (id: string, shipping: IShipping) => {
  // Validate the shipping object
  if (!shipping.price) {
    throw new Error('Price is missing');
  } else if (!shipping.districtId) {
    throw new Error('DistrictId is missing');
  }

  // check if the shipping exists

  const existingShipping = await prisma.shipping.findFirst({
    where: {
      id: id,
    },
  });

  if (!existingShipping) {
    throw new Error('Shipping does not exist');
  }

  //   if districtId is changed, check if the new districtId already exists

  if (existingShipping.districtId !== shipping.districtId) {
    const existingShipping = await prisma.shipping.findFirst({
      where: {
        districtId: Number(shipping.districtId),
      },
    });

    if (existingShipping) {
      throw new Error('Same district already exists in another shipping');
    }
  }

  // Update the shipping

  const updatedShipping = await prisma.shipping.update({
    where: {
      id: id,
    },
    data: {
      price: Number(shipping.price),
      districtId: Number(shipping.districtId),
    },
  });

  return updatedShipping;
};

// delete shipping

const deleteShipping = async (id: string) => {
  const existingShipping = await prisma.shipping.findFirst({
    where: {
      id: id,
    },
  });

  if (!existingShipping) {
    throw new Error('Shipping does not exist');
  }

  const result = await prisma.shipping.delete({
    where: {
      id: id,
    },
  });

  return result;
};

export const shippingService = {
  createShipping,
  getShippings,
  updateShipping,
  deleteShipping,
};
