import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { ICameraBuilderSave } from './camera_builder_save.interface';
import { CameraBuilderSaveService } from './camera_builder_save.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createCameraBuilderSave = catchAsync(
  async (req: Request, res: Response) => {
    const body = req.body as ICameraBuilderSave;
    const result = await CameraBuilderSaveService.createCameraBuilderSave(body);
    sendResponse(res, {
      data: result,
      message: 'Camera Builder Save created successfully',
      statusCode: httpStatus.CREATED,
      success: true,
    });
  },
);

// get all camera_builder_save by user id
const getCameraBuilderSaveByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result =
      await CameraBuilderSaveService.getCameraBuilderSaveByUserId(userId);
    sendResponse(res, {
      data: result,
      message: 'All Camera Builder Save fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// get single camera_builder_save by id and user id
const getCameraBuilderSaveById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await CameraBuilderSaveService.getCameraBuilderSaveByIdAndUserId(id);
    sendResponse(res, {
      data: result,
      message: 'Camera Builder Save fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// update camera_builder_save
const updateCameraBuilderSave = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body as ICameraBuilderSave;
    const result = await CameraBuilderSaveService.updateCameraBuilderSave(
      id,
      body,
    );
    sendResponse(res, {
      data: result,
      message: 'Camera Builder Save updated successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// delete camera_builder_save
const deleteCameraBuilderSave = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CameraBuilderSaveService.deleteCameraBuilderSave(id);
    sendResponse(res, {
      message: 'Camera Builder Save deleted successfully',
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      data: result,
    });
  },
);

export const CameraBuilderSaveController = {
  createCameraBuilderSave,
  getCameraBuilderSaveByUserId,
  getCameraBuilderSaveById,
  updateCameraBuilderSave,
  deleteCameraBuilderSave,
};
