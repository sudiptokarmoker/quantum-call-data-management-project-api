// create sideBanner

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { sideBannerService } from './sideBanner.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// create sideBanner

const createSideBanner = catchAsync(async (req: Request, res: Response) => {
  const sideBanner = req.body;
  const result = await sideBannerService.createSideBanner(sideBanner);
  sendResponse(res, {
    data: result,
    message: 'Side Banner created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all sideBanner

const getAllSideBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await sideBannerService.getAllSideBanner();
  sendResponse(res, {
    data: result,
    message: 'All Side Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get sideBanner by id

const getSideBannerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await sideBannerService.getSideBannerById(
    id as unknown as number,
  );
  sendResponse(res, {
    data: result,
    message: 'Side Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update sideBanner

const updateSideBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sideBanner = req.body;
  const result = await sideBannerService.updateSideBanner(
    id as unknown as number,
    sideBanner,
  );
  sendResponse(res, {
    data: result,
    message: 'Side Banner updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const sideBannerController = {
  createSideBanner,
  getAllSideBanner,
  getSideBannerById,
  updateSideBanner,
};
