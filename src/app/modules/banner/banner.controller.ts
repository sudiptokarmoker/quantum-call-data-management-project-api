// create banner

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { bannerService } from './banner.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { bannerFilterableFields } from './banner.constant';
import { paginationFields } from '../../../constants/pagination';

const createBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = req.body;
  const result = await bannerService.createBanner(banner);
  sendResponse(res, {
    data: result,
    message: 'Banner created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all Banner

const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bannerFilterableFields); //query = serachTerm / Title 

  // pagination

  const paginationOptions = pick(req.query, paginationFields);

  const result = await bannerService.getAllBanner(filters, paginationOptions);
  sendResponse(res, {
    data: result,
    message: 'All Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get Banner by id

const getBannerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bannerService.getBannerById(id);
  sendResponse(res, {
    data: result,
    message: 'Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update Banner

const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const banner = req.body;
  const result = await bannerService.updateBanner(id, banner);
  sendResponse(res, {
    data: result,
    message: 'Banner updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete Banner

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await bannerService.deleteBanner(id);
  sendResponse(res, {
    data: result,
    message: 'Banner deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export default {
  createBanner,
  getAllBanner,
  getBannerById,
  updateBanner,
  deleteBanner,
};
