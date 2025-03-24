/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import { IRelationalProductRequest } from './pc_builder_relational_product.interface';

// Create PC Builder Relational Product
const createPcBuilderRelationalProduct = async (
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
  const existingRelations = await prisma.pCBuilderRelationalProduct.findMany({
    where: { parent_product_id },
  });

  if (existingRelations.length > 0) {
    // Remove existing relations
    await prisma.pCBuilderRelationalProduct.deleteMany({
      where: { parent_product_id },
    });
  }

  // Create new relations
  for (const id of relative_product_id) {
    await prisma.pCBuilderRelationalProduct.create({
      data: {
        parent_product_id,
        relative_product_id: id,
      },
    });
  }

  return null;
};

// Get all PC Builder Relational Products
const getAllPcBuilderRelationalProduct = async () => {
  const pcBuilderRelationalProducts =
    await prisma.pCBuilderRelationalProduct.findMany();

  return pcBuilderRelationalProducts;
};

// Get PC Builder Relational Product by ID
const getPcBuilderRelationalProductById = async (id: string) => {
  const pcBuilderRelationalProduct =
    await prisma.pCBuilderRelationalProduct.findUnique({
      where: { id },
    });

  if (!pcBuilderRelationalProduct) {
    throw new Error(
      `PC Builder Relational Product with id ${id} does not exist`,
    );
  }

  return pcBuilderRelationalProduct;
};

// Update PC Builder Relational Product
const updatePcBuilderRelationalProduct = async (
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

  const updatedPcBuilderRelationalProduct =
    await prisma.pCBuilderRelationalProduct.update({
      where: { id },
      data: {
        parent_product_id,
        updatedAt: new Date(),
      },
    });

  return updatedPcBuilderRelationalProduct;
};

// Delete PC Builder Relational Product
const deletePcBuilderRelationalProduct = async (id: string) => {
  const deletedPcBuilderRelationalProduct =
    await prisma.pCBuilderRelationalProduct.delete({
      where: { id },
    });

  return deletedPcBuilderRelationalProduct;
};

export const PcBuilderRelationalProductService = {
  createPcBuilderRelationalProduct,
  getAllPcBuilderRelationalProduct,
  getPcBuilderRelationalProductById,
  updatePcBuilderRelationalProduct,
  deletePcBuilderRelationalProduct,
};
