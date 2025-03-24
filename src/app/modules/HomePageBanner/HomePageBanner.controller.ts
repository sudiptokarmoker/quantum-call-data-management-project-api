// create sideBanner

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { homePageBannerService } from './HomePageBanner.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// create sideBanner

const createHomePageBanner = catchAsync(async (req: Request, res: Response) => {
  const sideBanner = req.body;
  const result = await homePageBannerService.createHomePageBanner(sideBanner);
  sendResponse(res, {
    data: result,
    message: 'Home Page Banner created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all sideBanner

const getAllHomePageBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageBannerService.getAllHomePageBanner();
  sendResponse(res, {
    data: result,
    message: 'All Home Page Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get sideBanner by id

const getHomeBannerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await homePageBannerService.getHomePageBannerById(id);
  sendResponse(res, {
    data: result,
    message: 'Home Page Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update sideBanner

const updateHomePageBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sideBanner = req.body;
  const result = await homePageBannerService.updateHomePageBanner(
    id,
    sideBanner,
  );
  sendResponse(res, {
    data: result,
    message: 'Home Page Banner updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const sideBannerController = {
  createHomePageBanner,
  getAllHomePageBanner,
  getHomeBannerById,
  updateHomePageBanner,
};
