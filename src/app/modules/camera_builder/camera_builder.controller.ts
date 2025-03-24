import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CameraBuilderService } from './camera_builder.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
// create camera_builder
const createCameraBuilder = catchAsync(async (req: Request, res: Response) => {
  const cameraBuilder = req.body;
  // console.log('🚀 ~ createPcBuilder ~ cameraBuilder:', cameraBuilder);
  const result = await CameraBuilderService.createCameraBuilder(cameraBuilder);
  sendResponse(res, {
    data: result,
    message: 'CameraBuilder created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all PcBuilder

const getAllCameraBuilder = catchAsync(async (req: Request, res: Response) => {
  const result = await CameraBuilderService.getAllCameraBuilder();
  sendResponse(res, {
    data: result,
    message: 'All CameraBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get PcBuilder by admin

const getAllCameraBuilderAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await CameraBuilderService.getAllCameraBuilderAdmin();
  sendResponse(res, {
    data: result,
    message: 'CameraBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get PcBuilder by id

const getCameraBuilderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CameraBuilderService.getCameraBuilderById(id);
  sendResponse(res, {
    data: result,
    message: 'CameraBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update camera_builder

const updateCameraBuilder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cameraBuilder = req.body;
  const result = await CameraBuilderService.updateCameraBuilder(id, cameraBuilder);
  sendResponse(res, {
    data: result,
    message: 'CameraBuilder updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete camera_builder

const deleteCameraBuilder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CameraBuilderService.deleteCameraBuilder(id);
  sendResponse(res, {
    data: result,
    message: 'CameraBuilder deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const CameraBuilderController = {
  createCameraBuilder,
  getAllCameraBuilder,
  getCameraBuilderById,
  updateCameraBuilder,
  deleteCameraBuilder,
  getAllCameraBuilderAdmin,
};
