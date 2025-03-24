import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ICategoryFilters } from './category.interface';
import pick from '../../../shared/pick';
import { categoryFilterableFields } from './category.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

// create category
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = req.body;
  const result = await CategoryService.createCategory(category);
  sendResponse(res, {
    data: result,
    message: 'Category created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    data: result,
    message: 'All categories fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});
// get all getAllCategoriesForMenu
const getAllCategoriesForMenu = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategoriesForMenu();
    sendResponse(res, {
      data: result,
      message: 'All categories fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// get all categories without children

const getAllCategoryWithoutChildren = catchAsync(
  async (req: Request, res: Response) => {
    const filters: ICategoryFilters = pick(req.query, categoryFilterableFields);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result = await CategoryService.getAllCategoryWithoutChildren(
      filters,
      paginationOptions,
    );
    sendResponse(res, {
      data: result,
      message: 'All categories fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// get category witch is active is_featured

const getFeaturedCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.getFeaturedCategories();
    sendResponse(res, {
      data: result,
      message: 'All categories fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// get category by id
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getCategoryById(id);

  sendResponse(res, {
    data: result,
    message: 'Category fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update category

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = req.body;
  const result = await CategoryService.updateCategory(id, category);
  sendResponse(res, {
    data: result,
    message: 'Category updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete category

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id);
  sendResponse(res, {
    data: result,
    message: 'Category deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoryWithoutChildren,
  getAllCategoriesForMenu,
  getFeaturedCategories,
};
