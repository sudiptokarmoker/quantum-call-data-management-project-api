// create camera_builder

import prisma from '../../../shared/prisma';
import { ICameraBuilder } from './camera_builder.interface';

type Item = {
  id: string;
  categoryId: string;
  is_required: boolean;
  logoId: number;
  isMultiple: boolean;
  sort_order: number;
  componentType: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  logo: {
    id: number;
    image: string;
    name: string;
  };
};

type GroupedItem = {
  id: number;
  category: string;
  components: Item[];
};

const createCameraBuilder = async (cameraBuilderData: ICameraBuilder) => {
  /**
   * check category is true or not
   */
  const isExistCategory = await prisma.category.findFirst({
    where: {
      id: cameraBuilderData.categoryId,
      is_active: true
    },
  });

  if(!isExistCategory){
    throw new Error('Category not found');  
  }

  const categoryInCameraBuilderIsExist = await prisma.cameraBuilder.findFirst({
    where: {
      categoryId: cameraBuilderData.categoryId,
    },
  });
  /**
   * category checking with existing or not
   */
  if(categoryInCameraBuilderIsExist) {
    throw new Error('Category already exists');
  }

  const result = await prisma.cameraBuilder.create({
    data: cameraBuilderData,
  });
  return result;
};

// get all Camera_builder for front and

const getAllCameraBuilder = async () => {
  const result: Item[] = await prisma.cameraBuilder.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      logo: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      sort_order: 'asc',
    },
  });

  const grouped = result?.reduce<Record<string, GroupedItem>>((acc, item) => {
    if (!acc[item.componentType]) {
      acc[item.componentType] = {
        id: Object.keys(acc).length + 1,
        category: item.componentType,
        components: [],
      };
    }
    acc[item.componentType].components.push(item);
    return acc;
  }, {});

  const final = Object.values(grouped);

  return final;
};

// get all Camera_builder  for admin

const getAllCameraBuilderAdmin = async () => {
  const result: Item[] = await prisma.cameraBuilder.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      logo: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
    orderBy: {
      sort_order: 'asc',
    },
  });

  return result;
};

// get Camera_builder by id

const getCameraBuilderById = async (id: string) => {
  const result = await prisma.cameraBuilder.findUnique({
    where: {
      id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      logo: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error('CameraBuilder not found');
  }

  return result;
};

// update Camera_builder

const updateCameraBuilder = async (id: string, cameraBuilderData: ICameraBuilder) => {
  // get camera_builder by id
  const cameraBuilder = await prisma.cameraBuilder.findUnique({
    where: {
      id,
    },
  });

  if (!cameraBuilder) {
    throw new Error('Camera Builder not found');
  }

  // check if categoryId already exists and not the same id then throw error

  const category = await prisma.cameraBuilder.findFirst({
    where: {
      categoryId: cameraBuilderData.categoryId,
      NOT: {
        id,
      },
    },
  });

  if (category) {
    throw new Error('Category already exists');
  }

  // update camera_builder
  const result = await prisma.cameraBuilder.update({
    where: {
      id,
    },
    data: cameraBuilderData,
  });

  return result;
};

// delete camera_builder

const deleteCameraBuilder = async (id: string) => {
  // get camera_builder by id
  const cameraBuilder = await prisma.cameraBuilder.findUnique({
    where: {
      id,
    },
  });

  if (!cameraBuilder) {
    throw new Error('CameraBuilder not found');
  }

  // delete camera_builder
  const result = await prisma.cameraBuilder.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CameraBuilderService = {
  createCameraBuilder,
  getAllCameraBuilder,
  getCameraBuilderById,
  updateCameraBuilder,
  deleteCameraBuilder,
  getAllCameraBuilderAdmin,
};
