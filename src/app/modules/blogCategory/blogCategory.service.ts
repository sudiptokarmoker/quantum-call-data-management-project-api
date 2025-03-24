/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBlogCategory, IBlogCategoryFilters } from './blogCategory.interface';

// create blog Category
const createBlogCategory = async (blogCategoryData: IBlogCategory) => {
  // create blog
  const result = await prisma.blogCategory.create({
    data: blogCategoryData,
  });
  return result;
};

// get all blogs Category
const getAllBlogsCategory = async (
  filters: IBlogCategoryFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: ['name'].map(field => ({
        [field]: {
          contains: lowerCaseSearchTerm,
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        return {
          [key]: {
            contains: (filtersData as any)[key],
          },
        };
      }),
    });
  }

  const result = await prisma.blogCategory.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      blogs: true,
    },
    take: limit,
    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.blogCategory.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

// get blog Category by id
const getBlogCategoryById = async (id: string) => {
  // get blog Category by id
  const result = await prisma.blogCategory.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error('Blog Category not found');
  }

  return result;
};

// update blog

const updateBlogCategory = async (id: string, blogData: IBlogCategory) => {
  // get blog by id
  const blog = await prisma.blogCategory.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new Error('Blog Category not found');
  }

  // update blog
  const result = await prisma.blogCategory.update({
    where: {
      id,
    },
    data: blogData,
  });

  return result;
};

// delete blogCategory

const deleteBlogCategory = async (id: string) => {
  // get blog by id
  const blog = await prisma.blogCategory.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new Error('Blog Category not found');
  }

  // delete blog Category
  const result = await prisma.blogCategory.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BlogServiceCategory = {
  createBlogCategory,
  getAllBlogsCategory,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
};
