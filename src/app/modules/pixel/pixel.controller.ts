import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { pixelService } from './pixel.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// create pixel
const createPixel = catchAsync(async (req: Request, res: Response) => {
  const pixel = req.body;
  const create = await pixelService.createPixel(pixel);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    data: create,
    success: true,
    message: 'Pixel created successfully',
  });
});

// get all pixels

const getAllPixels = catchAsync(async (req: Request, res: Response) => {
  const pixels = await pixelService.getAllPixels();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: pixels,
    success: true,
    message: 'All pixels fetched successfully',
  });
});

// update pixel

const updatePixel = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const pixel = req.body;
  const update = await pixelService.updatePixel(id, pixel);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: update,
    success: true,
    message: 'Pixel updated successfully',
  });
});

// delete pixel

const deletePixel = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = await pixelService.deletePixel(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: deleted,
    success: true,
    message: 'Pixel deleted successfully',
  });
});

export const pixelController = {
  createPixel,
  getAllPixels,
  updatePixel,
  deletePixel,
};
