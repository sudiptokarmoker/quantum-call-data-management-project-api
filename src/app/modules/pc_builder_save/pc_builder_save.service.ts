// create pc_builder_save

import prisma from '../../../shared/prisma';
import { IPCBuilderSave } from './pc_builder_save.interface';

const createPcBuilderSave = async (pcBuilderSave: IPCBuilderSave) => {
  // check userId valid user or not
  const checkUser = await prisma.user.findUnique({
    where: {
      id: pcBuilderSave.userId,
    },
  });

  if (!checkUser) {
    throw new Error('User not found');
  }

  // First, create the PCBuilderSave
  const result = await prisma.pCBuilderSave.create({
    data: {
      name: pcBuilderSave.name,
      description: pcBuilderSave?.description,
      user: {
        connect: {
          id: pcBuilderSave.userId,
        },
      },
    },
  });

  // Then, create the PCBuilderProductSave instances
  for (const product of pcBuilderSave.products) {
    for (const productItem of product.product) {
      await prisma.pCBuilderProductSave.create({
        data: {
          categorySlug: product.categorySlug,
          productId: productItem.id,
          quantity: productItem.quantity,
          PCBuilderSave: {
            connect: {
              id: result.id,
            },
          },
        },
      });
    }
  }

  return result;
};

// get all pc_builder_save by user id

const getPcBuilderSaveByUserId = async (userId: string) => {
  const result = await prisma.pCBuilderSave.findMany({
    where: {
      userId,
    },
    include: {
      products: {
        select: {
          categorySlug: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              selling_price: true,
              regular_price: true,
              special_price: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error('PcBuilderSave not found');
  }

  return result;
};

// get single pc_builder_save by id and user id

const getPcBuilderSaveByIdAndUserId = async (id: string) => {
  const result = await prisma.pCBuilderSave.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        select: {
          categorySlug: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              selling_price: true,
              regular_price: true,
              special_price: true,
              warranty: true,
              warranty_time: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error('PcBuilderSave not found');
  }

  return result;
};

// update pc_builder_save

const updatePcBuilderSave = async (
  id: string,
  pcBuilderSave: IPCBuilderSave,
) => {
  // check if pc_builder_save exist
  const checkPcBuilderSave = await prisma.pCBuilderSave.findUnique({
    where: {
      id,
    },
  });

  if (!checkPcBuilderSave) {
    throw new Error('PcBuilderSave not found');
  }

  // First, update the PCBuilderSave
  const result = await prisma.pCBuilderSave.update({
    where: {
      id,
    },
    data: {
      name: pcBuilderSave.name,
      description: pcBuilderSave?.description,
      user: {
        connect: {
          id: pcBuilderSave.userId,
        },
      },
    },
  });

  // Then, create the PCBuilderProductSave instances
  const products = pcBuilderSave.products.flatMap(product =>
    product.product.map(productItem => ({
      categorySlug: product.categorySlug,
      productId: productItem.id,
      quantity: productItem.quantity,
      PCBuilderSaveId: result.id, // assuming the foreign key in PCBuilderProductSave is PCBuilderSaveId
    })),
  );

  await prisma.pCBuilderProductSave.createMany({
    data: products,
  });

  return result;
};

// delete pc_builder_save

const deletePcBuilderSave = async (id: string) => {
  // check if pc_builder_save exist
  const checkPcBuilderSave = await prisma.pCBuilderSave.findUnique({
    where: {
      id,
    },
  });

  if (!checkPcBuilderSave) {
    throw new Error('PcBuilderSave not found');
  }

  const result = await prisma.pCBuilderSave.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PcBuilderSaveService = {
  createPcBuilderSave,
  getPcBuilderSaveByUserId,
  getPcBuilderSaveByIdAndUserId,
  updatePcBuilderSave,
  deletePcBuilderSave,
};
