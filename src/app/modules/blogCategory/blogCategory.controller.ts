import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { BlogServiceCategory } from './blogCategory.service';
import { IBlogCategoryFilters } from './blogCategory.interface';
import { blogCategoryFilterableFields } from './blogCategory.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

// create blog Category
const createBlogCategory = catchAsync(async (req: Request, res: Response) => {
  const blog = req.body;
  const result = await BlogServiceCategory.createBlogCategory(blog);
  sendResponse(res, {
    data: result,
    message: 'Blog Category created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all blogs Category
const getAllBlogsCategory = catchAsync(async (req: Request, res: Response) => {
  const filters: IBlogCategoryFilters = pick(
    req.query,
    blogCategoryFilterableFields,
  );
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await BlogServiceCategory.getAllBlogsCategory(
    filters,
    paginationOptions,
  );
  sendResponse(res, {
    data: result,
    message: 'All blogs Category fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get blog Category by id

const getBlogCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogServiceCategory.getBlogCategoryById(id);
  sendResponse(res, {
    data: result,
    message: 'Blog Category fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update blog

const updateBlogCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = req.body;
  const result = await BlogServiceCategory.updateBlogCategory(id, blog);
  sendResponse(res, {
    data: result,
    message: 'Blog Category updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete blog

const deleteBlogCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await BlogServiceCategory.deleteBlogCategory(id);
  sendResponse(res, {
    message: 'Blog Category deleted successfully',
    statusCode: httpStatus.NO_CONTENT,
    success: true,
  });
});

export const BlogCategoryController = {
  createBlogCategory,
  getAllBlogsCategory,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
};
