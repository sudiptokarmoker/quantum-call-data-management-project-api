// create pc_builder

import prisma from '../../../shared/prisma';
import { IPcBuilder } from './pc_builder.interface';

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

const createPcBuilder = async (pcBuilderData: IPcBuilder) => {
  /**
   * check category is true or not
   */
  const isExistCategory = await prisma.category.findFirst({
    where: {
      id: pcBuilderData.categoryId,
      is_active: true
    },
  });

  if(!isExistCategory){
    throw new Error('Category not found');  
  }

  const categoryInPCBuilderIsExist = await prisma.pCBuilder.findFirst({
    where: {
      categoryId: pcBuilderData.categoryId,
    },
  });
  /**
   * category checking with existing or not
   */
  if(categoryInPCBuilderIsExist) {
    throw new Error('Category already exists');
  }

  const result = await prisma.pCBuilder.create({
    data: pcBuilderData,
  });
  return result;
};

// get all pc_builder for front and

const getAllPcBuilder = async () => {
  const result: Item[] = await prisma.pCBuilder.findMany({
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

// get all pc_builder  for admin

const getAllPcBuilderAdmin = async () => {
  const result: Item[] = await prisma.pCBuilder.findMany({
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

// get pc_builder by id

const getPcBuilderById = async (id: string) => {
  const result = await prisma.pCBuilder.findUnique({
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
    throw new Error('PcBuilder not found');
  }

  return result;
};

// update pc_builder

const updatePcBuilder = async (id: string, pcBuilderData: IPcBuilder) => {
  // get pc_builder by id
  const pcBuilder = await prisma.pCBuilder.findUnique({
    where: {
      id,
    },
  });

  if (!pcBuilder) {
    throw new Error('PcBuilder not found');
  }

  // check if categoryId already exists and not the same id then throw error

  const category = await prisma.pCBuilder.findFirst({
    where: {
      categoryId: pcBuilderData.categoryId,
      NOT: {
        id,
      },
    },
  });

  if (category) {
    throw new Error('Category already exists');
  }

  // update pc_builder
  const result = await prisma.pCBuilder.update({
    where: {
      id,
    },
    data: pcBuilderData,
  });

  return result;
};

// delete pc_builder

const deletePcBuilder = async (id: string) => {
  // get pc_builder by id
  const pcBuilder = await prisma.pCBuilder.findUnique({
    where: {
      id,
    },
  });

  if (!pcBuilder) {
    throw new Error('PcBuilder not found');
  }

  // delete pc_builder
  const result = await prisma.pCBuilder.delete({
    where: {
      id,
    },
  });

  return result;
};

export const PcBuilderService = {
  createPcBuilder,
  getAllPcBuilder,
  getPcBuilderById,
  updatePcBuilder,
  deletePcBuilder,
  getAllPcBuilderAdmin,
};
