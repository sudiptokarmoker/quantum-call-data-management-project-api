import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IOffer, IOfferFilters } from './offers.interface';

const createOffer = async (offer: IOffer) => {
  if (offer.isShowedHome) {
    await prisma.offers.updateMany({
      where: {
        isShowedHome: true,
      },
      data: {
        isShowedHome: false,
      },
    });
  }

  // check if product is already associated with another offer then provide error  [product name] is already associated with [offer name] offer

  if (offer?.product) {
    const productIds = offer.product.map(product => product);

    const existingOffer = await prisma.offers.findFirst({
      where: {
        product: {
          some: {
            id: {
              in: productIds,
            },
          },
        },
      },
    });

    if (existingOffer) {
      const product = await prisma.product.findUnique({
        where: {
          id: productIds[0],
        },
      });

      throw new Error(
        `${product?.name} is already associated with ${existingOffer?.title} offer`,
      );
    }
  }

  // Create offer logic

  const result = await prisma.offers.create({
    data: {
      title: offer.title,
      description: offer.description,
      banner_id: offer.banner_id,
      offerStartTime: offer.offerStartTime,
      offerEndTime: offer.offerEndTime,
      offerType: offer.offerType,
      discountType: offer.discountType,
      discount: offer.discount,
      isShowedHome: offer.isShowedHome,
      product: {
        connect: offer.product
          ? offer.product.map(product => ({ id: product }))
          : [],
      },
    },
  });

  return result;
};

// get all offers

const getAllOffers = async (
  filters: IOfferFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, isShowedHome } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: [
        {
          title: {
            contains: lowerCaseSearchTerm,
          },
        },
        {
          offerType: {
            contains: lowerCaseSearchTerm,
          },
        },
      ],
    });
  }

  if (isShowedHome) {
    andConditions.push({
      isShowedHome: isShowedHome === 'true' ? true : false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offers.findMany({
    where: whereConditions,
    include: {
      banner: true,
      product: {
        include: {
          thumbnail: true,
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

  const total = await prisma.offers.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single offer

const getOffer = async (id: number) => {
  const result = await prisma.offers.findUnique({
    where: {
      id,
    },
    include: {
      banner: true,
      product: {
        include: {
          thumbnail: true,
        },
      },
    },
  });

  return result;
};

// update offer

const updateOffer = async (id: number, offer: IOffer) => {
  if (offer.isShowedHome) {
    await prisma.offers.updateMany({
      where: {
        id: {
          not: id,
        },
      },
      data: {
        isShowedHome: false,
      },
    });
  }

  // check if product is already associated with another offer then provide error  [product name] is already associated with [offer name] offer

  if (offer?.product) {
    const productIds = offer.product.map(product => product);

    const existingOffer = await prisma.offers.findFirst({
      where: {
        product: {
          some: {
            id: {
              in: productIds,
            },
          },
        },
        id: {
          not: id,
        },
      },
    });

    if (existingOffer) {
      const product = await prisma.product.findUnique({
        where: {
          id: productIds[0],
        },
      });

      throw new Error(
        `${product?.name} is already associated with ${existingOffer?.title} offer`,
      );
    }
  }

  const result = await prisma.offers.update({
    where: {
      id,
    },
    data: {
      title: offer.title,
      description: offer.description,
      banner_id: offer.banner_id,
      offerStartTime: offer.offerStartTime,
      offerEndTime: offer.offerEndTime,
      offerType: offer.offerType,
      discountType: offer.discountType,
      discount: offer.discount,
      isShowedHome: offer.isShowedHome,
      product: {
        connect: offer.product
          ? offer.product.map(product => ({ id: product }))
          : [],
      },
    },
  });

  return result;
};

// delete offer

const deleteOffer = async (id: number) => {
  const result = await prisma.offers.delete({
    where: {
      id,
    },
  });

  return result;
};

export const offersService = {
  createOffer,
  getAllOffers,
  getOffer,
  updateOffer,
  deleteOffer,
};
