// create pc_builder_save

import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { IPCBuilderSave } from './pc_builder_save.interface';

import { PcBuilderSaveService } from './pc_builder_save.service';

import sendResponse from '../../../shared/sendResponse';

import httpStatus from 'http-status';

const createPcBuilderSave = catchAsync(async (req: Request, res: Response) => {
  const body = req.body as IPCBuilderSave;
  const result = await PcBuilderSaveService.createPcBuilderSave(body);

  sendResponse(res, {
    data: result,
    message: 'PC Builder Save created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all pc_builder_save by user id

const getPcBuilderSaveByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await PcBuilderSaveService.getPcBuilderSaveByUserId(userId);

    sendResponse(res, {
      data: result,
      message: 'All PC Builder Save fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// get single pc_builder_save by id and user id

const getPcBuilderSaveById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PcBuilderSaveService.getPcBuilderSaveByIdAndUserId(id);

  sendResponse(res, {
    data: result,
    message: 'PC Builder Save fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update pc_builder_save

const updatePcBuilderSave = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as IPCBuilderSave;

  const result = await PcBuilderSaveService.updatePcBuilderSave(id, body);

  sendResponse(res, {
    data: result,
    message: 'PC Builder Save updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete pc_builder_save

const deletePcBuilderSave = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PcBuilderSaveService.deletePcBuilderSave(id);

  sendResponse(res, {
    message: 'PC Builder Save deleted successfully',
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    data: result,
  });
});

export const PcBuilderSaveController = {
  createPcBuilderSave,
  getPcBuilderSaveByUserId,
  getPcBuilderSaveById,
  updatePcBuilderSave,
  deletePcBuilderSave,
};
