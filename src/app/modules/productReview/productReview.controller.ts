// create product review

import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';

import { productReviewService } from './productReview.service';

import sendResponse from '../../../shared/sendResponse';

import httpStatus from 'http-status';

import { IProductReviewFilters } from './productReview.interface';

import { IPaginationOptions } from '../../../interfaces/pagination';

import pick from '../../../shared/pick';

import { productReviewFilterableFields } from './productReview.constant';

import { paginationFields } from '../../../constants/pagination';

const createProductReview = catchAsync(async (req: Request, res: Response) => {
  const result = await productReviewService.createProductReview(req.body);

  sendResponse(res, {
    data: result,
    message: 'Product review created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all product review

const getAllProductReview = catchAsync(async (req: Request, res: Response) => {
  const filters: IProductReviewFilters = pick(
    req.query,
    productReviewFilterableFields,
  );

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await productReviewService.getAllProductReview(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    data: result,
    message: 'Product review retrieved successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// status change

const changeStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await productReviewService.changeProductReviewStatus(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    data: result,
    message: 'Product review status changed successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete product review

const deleteProductReview = catchAsync(async (req: Request, res: Response) => {
  const result = await productReviewService.deleteProductReview(req.params.id);

  sendResponse(res, {
    data: result,
    message: 'Product review deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const productReviewController = {
  createProductReview,
  getAllProductReview,
  changeStatus,
  deleteProductReview,
};
