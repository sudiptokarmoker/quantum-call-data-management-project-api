import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { galleryService } from './gallery.service';
import pick from '../../../shared/pick';
import { galleryFilterableFields } from './gallary.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

// create image gallery
const createSigImage = catchAsync(async (req: Request, res: Response) => {
  const result = await galleryService.createImage(req, res);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Image created successfully',
    data: result,
    success: true,
  });
});

// create multiple images gallery
const createMulImages = catchAsync(async (req: Request, res: Response) => {
  const result = await galleryService.createMultipleImages(req, res);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Images created successfully',
    data: result,
    success: true,
  });
});

// get all images
const getAllImages = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, galleryFilterableFields);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await galleryService.getAllImages(filter, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Images fetched successfully',
    data: result,
    success: true,
  });
});

// delete image from database also from uploads folder
const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await galleryService.deleteImage(Number(id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Image deleted successfully',
    data: result,
    success: true,
  });
});

// delete many
const deleteManyImages = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const result = await galleryService.deleteManyImages(ids);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Images deleted successfully',
    data: result,
    success: true,
  });
});

// download image

const downloadImage = catchAsync(async (req: Request, res: Response) => {
  await galleryService.downloadImage(req, res);
});

export const galleryController = {
  createSigImage,
  createMulImages,
  getAllImages,
  deleteImage,
  deleteManyImages,
  downloadImage,
};
