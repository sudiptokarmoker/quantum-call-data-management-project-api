/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  attributeRelationalFields,
  attributeRelationalFieldsMapper,
  attributeSearchAbleFields,
} from './attribute.constant';
import { IAttribute, IAttributeFilters } from './attributes.interface';

// create attributes
const createAttributes = async (attributes: IAttribute) => {
  const result = prisma.attribute.create({
    data: {
      name: attributes.name,
      is_active: attributes.is_active,
      AttributeValue: {
        create: attributes.attributeValue.map(value => ({ value })),
      },
    },
    include: {
      AttributeValue: true,
    },
  });

  return result;
};

// get all attributes
const getAttributes = async (
  filters: IAttributeFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: attributeSearchAbleFields.map(field => ({
        [field]: {
          contains: lowerCaseSearchTerm,
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (attributeRelationalFields.includes(key)) {
          return {
            [attributeRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.AttributeWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.attribute.findMany({
    where: whereConditions,
    include: {
      AttributeValue: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.attribute.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get attributes by id

const getAttributesById = async (id: string) => {
  const result = prisma.attribute.findUnique({
    where: {
      id,
    },
    include: {
      AttributeValue: true,
    },
  });

  if (!result) {
    throw new Error('Attributes not found');
  }

  return result;
};

// update attributes

const updateAttributes = async (id: string, attributes: IAttribute) => {
  // Find the existing attribute and its values
  const checkAttributes = await prisma.attribute.findUnique({
    where: {
      id,
    },
    include: {
      AttributeValue: true,
    },
  });

  if (!checkAttributes) {
    throw new Error('Attributes not found');
  }

  // Extract existing values and new values
  const existingValues = checkAttributes.AttributeValue.map(attr => attr.value);
  const newValues = attributes.attributeValue.map((attr:any) => attr.value);

  // Determine which values need to be created and which need to be deleted
  const valuesToCreate = newValues.filter(value => !existingValues.includes(value));
  const valuesToDelete = existingValues.filter(value => !newValues.includes(value));

  // Perform deletion of old attribute values
  await prisma.attributeValue.deleteMany({
    where: {
      attributeId: id,
      value: {
        in: valuesToDelete,
      },
    },
  });

  // Perform creation of new attribute values
  await prisma.attributeValue.createMany({
    data: valuesToCreate.map(value => ({
      attributeId: id,
      value,
    })),
  });

  // Update the attribute itself
  const result = await prisma.attribute.update({
    where: {
      id,
    },
    data: {
      name: attributes.name,
      is_active: attributes.is_active,
    },
    include: {
      AttributeValue: true,
    },
  });

  return result;
};


// delete attributes

const deleteAttributes = async (id: string) => {
  // check if attributes exist
  const checkAttributes = await prisma.attribute.findUnique({
    where: {
      id,
    },
  });

  if (!checkAttributes) {
    throw new Error('Attributes not found');
  }

  // First, delete the AttributeValues
  await prisma.attributeValue.deleteMany({
    where: {
      attributeId: id,
    },
  });

  await prisma.productAttribute.deleteMany({
    where: {
      attribute : {
        id
      }
    },
  });

  const result = prisma.attribute.delete({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error('Attributes not found');
  }

  return result;
};

export const AttributesService = {
  createAttributes,
  getAttributes,
  getAttributesById,
  updateAttributes,
  deleteAttributes,
};
