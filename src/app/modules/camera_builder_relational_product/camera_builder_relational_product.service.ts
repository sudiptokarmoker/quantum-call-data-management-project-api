/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import { IRelationalProductRequest } from './camera_builder_relational_product.interface';

// Create Camera Builder Relational Product
const createCameraBuilderRelationalProduct = async (
  relationalProductParam: IRelationalProductRequest,
) => {
  const { parent_product_id, relative_product_id } = relationalProductParam;

  // check if the parent product ID is valid
  const validParentProduct = await prisma.product.findUnique({
    where: { id: parent_product_id },
  });

  if (!validParentProduct) {
    throw new Error(
      `Parent product with id ${parent_product_id} does not exist`,
    );
  }

  // check if the relative product IDs are valid
  for (const id of relative_product_id) {
    const validRelativeProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!validRelativeProduct) {
      throw new Error(`Relative product with id ${id} does not exist`);
    }
  }

  // Check if the parent product has existing relations
  const existingRelations =
    await prisma.cameraBuilderRelationalProduct.findMany({
      where: { parent_product_id },
    });

  if (existingRelations.length > 0) {
    // Remove existing relations
    await prisma.cameraBuilderRelationalProduct.deleteMany({
      where: { parent_product_id },
    });
  }

  // Create new relations
  for (const id of relative_product_id) {
    await prisma.cameraBuilderRelationalProduct.create({
      data: {
        parent_product_id,
        relative_product_id: id,
      },
    });
  }

  return null;
};

// Get all Camera Builder Relational Products
const getAllCameraBuilderRelationalProduct = async () => {
  const cameraBuilderRelationalProducts =
    await prisma.cameraBuilderRelationalProduct.findMany();

  return cameraBuilderRelationalProducts;
};

// Get Camera Builder Relational Product by ID
const getCameraBuilderRelationalProductById = async (id: string) => {
  const cameraBuilderRelationalProduct =
    await prisma.cameraBuilderRelationalProduct.findUnique({
      where: { id },
    });

  if (!cameraBuilderRelationalProduct) {
    throw new Error(
      `Camera Builder Relational Product with id ${id} does not exist`,
    );
  }
  return cameraBuilderRelationalProduct;
};

// Update Camera Builder Relational Product
const updateCameraBuilderRelationalProduct = async (
  id: string,
  relationalProductParam: IRelationalProductRequest,
) => {
  const { parent_product_id } = relationalProductParam;

  // Check if the parent product ID is valid
  const validParentProduct = await prisma.product.findUnique({
    where: { id: parent_product_id },
  });

  if (!validParentProduct) {
    console.error(`Parent product with id ${parent_product_id} does not exist`);
    throw new Error(
      `Parent product with id ${parent_product_id} does not exist`,
    );
  }

  const updatedCameraBuilderRelationalProduct =
    await prisma.pCBuilderRelationalProduct.update({
      where: { id },
      data: {
        parent_product_id,
        updatedAt: new Date(),
      },
    });

  console.log(
    'Updated Camera Builder Relational Product:',
    updatedCameraBuilderRelationalProduct,
  );

  return updatedCameraBuilderRelationalProduct;
};

// Delete Camera Builder Relational Product
const deleteCameraBuilderRelationalProduct = async (id: string) => {
  const deletedCameraBuilderRelationalProduct =
    await prisma.cameraBuilderRelationalProduct.delete({
      where: { id },
    });

  return deletedCameraBuilderRelationalProduct;
};

export const CameraBuilderRelationalProductService = {
  createCameraBuilderRelationalProduct,
  getAllCameraBuilderRelationalProduct,
  getCameraBuilderRelationalProductById,
  updateCameraBuilderRelationalProduct,
  deleteCameraBuilderRelationalProduct,
};
