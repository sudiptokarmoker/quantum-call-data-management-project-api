// update home seo

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { homeSeoService } from './homeSeo.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// get home seo

const getHomeSeo = catchAsync(async (req: Request, res: Response) => {
  const result = await homeSeoService.getHomeSeo();

  sendResponse(res, {
    data: result,
    message: 'Home SEO fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update home seo
const updateHomeSeo = catchAsync(async (req: Request, res: Response) => {
  const result = await homeSeoService.updateHomeSeo(req.params.id, req.body);

  sendResponse(res, {
    data: result,
    message: 'Home SEO updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const homeSeoController = {
  updateHomeSeo,
  getHomeSeo,
};
