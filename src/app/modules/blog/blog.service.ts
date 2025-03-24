/* eslint-disable @typescript-eslint/no-explicit-any */
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBlog, IBlogFilters } from './blog.interface';

// create blog
const createBlog = async (blogData: IBlog) => {
  // create blog
  const result = await prisma.blog.create({
    data: blogData,
  });
  return result;
};

// get all blogs
const getAllBlogs = async (
  filters: IBlogFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    andConditions.push({
      OR: ['title'].map(field => ({
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

  const result = await prisma.blog.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      BlogCategory: true,
      image: true,
    },
    take: limit,
    skip,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.blog.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

// get blog by id
const getBlogById = async (id: string) => {
  // get blog by id
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error('Blog not found');
  }

  return result;
};

// update blog

const updateBlog = async (id: string, blogData: IBlog) => {
  // get blog by id
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new Error('Blog not found');
  }

  // update blog
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: blogData,
  });

  return result;
};

// delete blog

const deleteBlog = async (id: string) => {
  // get blog by id
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new Error('Blog not found');
  }

  // delete blog
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });

  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
