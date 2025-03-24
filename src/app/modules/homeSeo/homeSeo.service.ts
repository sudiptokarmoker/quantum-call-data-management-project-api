// update home seo

import prisma from '../../../shared/prisma';

type HomeSeo = {
  title : string;
  description: string;
};

// get home seo

const getHomeSeo = async () => {
  // get home seo
  const homeSeo = await prisma.homeSEO.findFirst();

  return homeSeo;
};

const updateHomeSeo = async (id: string, data: HomeSeo) => {
  // find the home seo
  const homeSeo = await prisma.homeSEO.findUnique({
    where: { id: id },
  });

  if (!homeSeo) {
    throw new Error('Home SEO not found');
  }

  // update the home seo

  const updatedHomeSeo = await prisma.homeSEO.update({
    where: { id: id },
    data: data,
  });

  return updatedHomeSeo;
};

export const homeSeoService = {
  updateHomeSeo,
  getHomeSeo,
};
