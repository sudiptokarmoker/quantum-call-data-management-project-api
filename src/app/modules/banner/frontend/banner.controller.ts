import { Request, Response } from 'express';
import catchAsync from '../../../../shared/catchAsync';
import { bannerService } from './../frontend/banner.service';
import sendResponse from '../../../../shared/sendResponse';
import httpStatus from 'http-status';

const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await bannerService.getAllBanner();
  sendResponse(res, {
    data: result,
    message: 'All Banner fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export default {
  getAllBanner
};
