import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAnalytics();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics data retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getAnalytics,
}; 