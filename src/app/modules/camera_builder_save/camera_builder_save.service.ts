// create camera_builder_save

import prisma from '../../../shared/prisma';
import { ICameraBuilderSave } from './camera_builder_save.interface';

const createCameraBuilderSave = async (
  cameraBuilderSave: ICameraBuilderSave,
) => {
  // check userId valid user or not
  const checkUser = await prisma.user.findUnique({
    where: {
      id: cameraBuilderSave.userId,
    },
  });
  if (!checkUser) {
    throw new Error('User not found');
  }

  // First, create the CameraBuilderSave
  const result = await prisma.cameraBuilderSave.create({
    data: {
      name: cameraBuilderSave.name,
      description: cameraBuilderSave?.description,
      user: {
        connect: {
          id: cameraBuilderSave.userId,
        },
      },
    },
  });

  // Then, create the CameraBuilderProductSave instances
  for (const product of cameraBuilderSave.products) {
    for (const productItem of product.product) {
      await prisma.cameraBuilderProductSave.create({
        data: {
          categorySlug: product.categorySlug,
          productId: productItem.id,
          quantity: productItem.quantity,
          CameraBuilderSave: {
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

// get all camera_builder_save by user id
const getCameraBuilderSaveByUserId = async (userId: string) => {
  const result = await prisma.cameraBuilderSave.findMany({
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
    throw new Error('CameraBuilderSave not found');
  }
  return result;
};

// get single camera_builder_save by id and user id
const getCameraBuilderSaveByIdAndUserId = async (id: string) => {
  const result = await prisma.cameraBuilderSave.findUnique({
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
    throw new Error('CameraBuilderSave not found');
  }
  return result;
};

// update camera_builder_save
const updateCameraBuilderSave = async (
  id: string,
  cameraBuilderSave: ICameraBuilderSave,
) => {
  // check if camera_builder_save exist
  const checkCameraBuilderSave = await prisma.cameraBuilderSave.findUnique({
    where: {
      id,
    },
  });
  if (!checkCameraBuilderSave) {
    throw new Error('CameraBuilderSave not found');
  }

  // First, update the CameraBuilderSave
  const result = await prisma.cameraBuilderSave.update({
    where: {
      id,
    },
    data: {
      name: cameraBuilderSave.name,
      description: cameraBuilderSave?.description,
      user: {
        connect: {
          id: cameraBuilderSave.userId,
        },
      },
    },
  });

  // Then, create the CameraBuilderProductSave instances
  const products = cameraBuilderSave.products.flatMap(product =>
    product.product.map(productItem => ({
      categorySlug: product.categorySlug,
      productId: productItem.id,
      quantity: productItem.quantity,
      CameraBuilderSaveId: result.id, // assuming the foreign key in CameraBuilderProductSave is CameraBuilderSaveId
    })),
  );
  await prisma.cameraBuilderProductSave.createMany({
    data: products,
  });
  return result;
};

// delete camera_builder_save
const deleteCameraBuilderSave = async (id: string) => {
  // check if camera_builder_save exist
  const checkCameraBuilderSave = await prisma.cameraBuilderSave.findUnique({
    where: {
      id,
    },
  });
  if (!checkCameraBuilderSave) {
    throw new Error('CameraBuilderSave not found');
  }
  const result = await prisma.cameraBuilderSave.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CameraBuilderSaveService = {
  createCameraBuilderSave,
  getCameraBuilderSaveByUserId,
  getCameraBuilderSaveByIdAndUserId,
  updateCameraBuilderSave,
  deleteCameraBuilderSave,
};
