import prisma from '../../../shared/prisma';
import { IPixel } from './pixel.interface';

const createPixel = async (pixel: IPixel): Promise<IPixel> => {
  // check if the pixel already exists
  const existing = await prisma.pixel.findFirst({
    where: {
      slug: pixel.slug,
    },
  });

  if (existing) {
    throw new Error('Pixel already exists with this slug');
  }

  const create = await prisma.pixel.create({
    data: pixel,
  });

  return create;
};

// get all pixels

const getAllPixels = async (): Promise<IPixel[]> => {
  return await prisma.pixel.findMany();
};

// update pixel

const updatePixel = async (id: number, pixel: IPixel): Promise<IPixel> => {
  return await prisma.pixel.update({
    where: {
      id,
    },
    data: pixel,
  });
};

// delete pixel

const deletePixel = async (id: number): Promise<IPixel> => {
  return await prisma.pixel.delete({
    where: {
      id,
    },
  });
};

export const pixelService = {
  createPixel,
  getAllPixels,
  updatePixel,
  deletePixel,
};
