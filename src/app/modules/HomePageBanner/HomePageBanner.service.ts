// create side banner

import prisma from '../../../shared/prisma';
import { IHomePageBanner } from './HomePageBanner.interface';

const createHomePageBanner = async (bannerData: IHomePageBanner) => {
  const { homePageBannerOne, homePageBannerTwo, is_active } = bannerData;

  if (!homePageBannerOne) {
    throw new Error('Home Banner One is required');
  } else if (!homePageBannerTwo) {
    throw new Error('Home Banner Two is required');
  }

  //   check is already side banner exist or not

  const isHomeBannerExist = await prisma.homePageBanner.findFirst();

  if (isHomeBannerExist) {
    // update home banner
    const updatedHomePageBannerOne = await prisma.homePageBannerOne.update({
      where: {
        id: isHomeBannerExist.homePageBannerOneId,
      },
      data: homePageBannerOne,
    });

    const updatedHomePageBannerTwo = await prisma.homePageBannerTwo.update({
      where: {
        id: isHomeBannerExist.homePageBannerTwoId,
      },
      data: homePageBannerTwo,
    });

    const updatedHomePageBanner = await prisma.homePageBanner.update({
      where: {
        id: isHomeBannerExist.id,
      },
      data: {
        homePageBannerOneId: updatedHomePageBannerOne.id,
        homePageBannerTwoId: updatedHomePageBannerTwo.id,
        is_active: is_active === true ? true : false,
      },
    });

    return updatedHomePageBanner;
  } else {
    const newHomeBannerOne = await prisma.homePageBannerOne.create({
      data: homePageBannerOne,
    });

    const newHomeBannerTwo = await prisma.homePageBannerTwo.create({
      data: homePageBannerTwo,
    });

    const newHomeBanner = await prisma.homePageBanner.create({
      data: {
        homePageBannerOneId: newHomeBannerOne.id,
        homePageBannerTwoId: newHomeBannerTwo.id,
        is_active: is_active ? is_active : true,
      },
    });

    return newHomeBanner;
  }
};

// get all side banner

const getAllHomePageBanner = async () => {
  const homePageBanner = await prisma.homePageBanner.findFirst({
    include: {
      homePageBannerOne: {
        include: {
          image: true,
        },
      },
      homePageBannerTwo: {
        include: {
          image: true,
        },
      },
    },
  });

  return homePageBanner;
};

// get side banner by id

const getHomePageBannerById = async (id: string) => {
  const sideBanner = await prisma.homePageBanner.findUnique({
    where: {
      id: id,
    },
    include: {
      homePageBannerOne: {
        include: {
          image: true,
        },
      },
      homePageBannerTwo: {
        include: {
          image: true,
        },
      },
    },
  });

  return sideBanner;
};

// update side banner

const updateHomePageBanner = async (
  id: string,
  bannerData: IHomePageBanner,
) => {
  const { homePageBannerOne, homePageBannerTwo, is_active } = bannerData;

  if (!homePageBannerOne) {
    throw new Error('Home Page Banner One is required');
  } else if (!homePageBannerTwo) {
    throw new Error('Home Page Banner Two is required');
  }

  const updatedHomePageBannerOne = await prisma.homePageBannerOne.update({
    where: {
      id: homePageBannerOne.id,
    },
    data: {
      image_id: {
        set: homePageBannerOne.image_id,
      },
      link: homePageBannerOne.link,
    },
  });

  const updatedHomePageBannerTwo = await prisma.homePageBannerTwo.update({
    where: {
      id: homePageBannerTwo.id,
    },
    data: {
      image_id: {
        set: homePageBannerTwo.image_id,
      },
      link: homePageBannerTwo.link,
    },
  });

  const updatedHomePageBanner = await prisma.homePageBanner.update({
    where: {
      id: id,
    },
    data: {
      homePageBannerOneId: updatedHomePageBannerOne.id,
      homePageBannerTwoId: updatedHomePageBannerTwo.id,
      is_active: is_active === true ? true : false,
    },
  });

  return updatedHomePageBanner;
};

export const homePageBannerService = {
  createHomePageBanner,
  getAllHomePageBanner,
  getHomePageBannerById,
  updateHomePageBanner,
};
