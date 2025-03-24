import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';

import { popularSearchProductService } from './popularSearchProduct.service';

import sendResponse from '../../../shared/sendResponse';

import httpStatus from 'http-status';

import { IPopularSearchProductFilters } from './popularSearchProduct.interface';

import { IPaginationOptions } from '../../../interfaces/pagination';

import pick from '../../../shared/pick';

import { paginationFields } from '../../../constants/pagination';

const createPopularSearchProduct = catchAsync(
  async (req: Request, res: Response) => {
    const result = await popularSearchProductService.createPopularSearchProduct(
      req.body,
    );

    sendResponse(res, {
      data: result,
      message: 'Popular search product created successfully',
      statusCode: httpStatus.CREATED,
      success: true,
    });
  },
);

const getAllPopularSearchProduct = catchAsync(
  async (req: Request, res: Response) => {
    const filters: IPopularSearchProductFilters = pick(req.query, [
      'searchTerm',
    ]);

    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result = await popularSearchProductService.getAllPopularSearchProduct(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      data: result,
      message: 'Popular search product retrieved successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

export const popularSearchProductController = {
  createPopularSearchProduct,
  getAllPopularSearchProduct,
};
