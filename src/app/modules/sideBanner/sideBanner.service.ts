// create side banner

import prisma from '../../../shared/prisma';
import { ISideBanner } from './sideBanner.interface';

const createSideBanner = async (bannerData: ISideBanner) => {
  const { sideBannerOne, sideBannerTwo, is_active } = bannerData;

  if (!sideBannerOne) {
    throw new Error('Side Banner One is required');
  } else if (!sideBannerTwo) {
    throw new Error('Side Banner Two is required');
  }

  //   check is already side banner exist or not

  const isSideBannerExist = await prisma.sideBanner.findFirst();

  if (isSideBannerExist) {
    throw new Error('You can not create more than one side banner');
  }

  const newSideBannerOne = await prisma.sideBannerOne.create({
    data: sideBannerOne,
  });

  const newSideBannerTwo = await prisma.sideBannerTwo.create({
    data: sideBannerTwo,
  });

  const newSideBanner = await prisma.sideBanner.create({
    data: {
      sideBannerOneId: newSideBannerOne.id,
      sideBannerTwoId: newSideBannerTwo.id,
      is_active: is_active ? is_active : true,
    },
  });

  return newSideBanner;
};

// get all side banner

const getAllSideBanner = async () => {
  const sideBanner = await prisma.sideBanner.findFirst({
    include: {
      side_banner_one: {
        include: {
          image: true,
        },
      },
      side_banner_two: {
        include: {
          image: true,
        },
      },
    },
  });

  return sideBanner;
};

// get side banner by id

const getSideBannerById = async (id: number) => {
  const sideBanner = await prisma.sideBanner.findUnique({
    where: {
      id: id,
    },
    include: {
      side_banner_one: true,
      side_banner_two: true,
    },
  });

  return sideBanner;
};

// update side banner

const updateSideBanner = async (id: number, bannerData: ISideBanner) => {
  const { sideBannerOne, sideBannerTwo, is_active } = bannerData;

  if (!sideBannerOne) {
    throw new Error('Side Banner One is required');
  } else if (!sideBannerTwo) {
    throw new Error('Side Banner Two is required');
  }

  const updatedSideBannerOne = await prisma.sideBannerOne.update({
    where: {
      id: sideBannerOne.id,
    },
    data: {
      imageId: {
        set: sideBannerOne.imageId,
      },
      title: sideBannerOne.title,
      link: sideBannerOne.link,
    },
  });

  const updatedSideBannerTwo = await prisma.sideBannerTwo.update({
    where: {
      id: sideBannerTwo.id,
    },
    data: {
      imageId: {
        set: sideBannerTwo.imageId,
      },
      title: sideBannerTwo.title,
      link: sideBannerTwo.link,
    },
  });

  const updatedSideBanner = await prisma.sideBanner.update({
    where: {
      id: Number(id),
    },
    data: {
      sideBannerOneId: updatedSideBannerOne.id,
      sideBannerTwoId: updatedSideBannerTwo.id,
      is_active: is_active === true ? true  : false,
    },
  });

  return updatedSideBanner;
};

export const sideBannerService = {
  createSideBanner,
  getAllSideBanner,
  getSideBannerById,
  updateSideBanner,
};
