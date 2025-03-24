import prisma from '../../../../shared/prisma';

const getAllBanner = async () => {
  const result = await prisma.banner.findMany({
    where: {
      is_active: true
    },
    include: {
      image: true,
    },
    take: 5,
      orderBy: { updatedAt: 'desc' },
  })
  return {
    data: result,
    meta: {
      total: result.length
    },
  };
};

export const bannerService = {
  getAllBanner
};
