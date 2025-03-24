import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PcBuilderService } from './pc_builder.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
// create pc_builder
const createPcBuilder = catchAsync(async (req: Request, res: Response) => {
  const pcBuilder = req.body;
  // console.log('🚀 ~ createPcBuilder ~ pcBuilder:', pcBuilder);
  const result = await PcBuilderService.createPcBuilder(pcBuilder);
  sendResponse(res, {
    data: result,
    message: 'PcBuilder created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all PcBuilder

const getAllPcBuilder = catchAsync(async (req: Request, res: Response) => {
  const result = await PcBuilderService.getAllPcBuilder();
  sendResponse(res, {
    data: result,
    message: 'All PcBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get PcBuilder by admin

const getAllPcBuilderAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await PcBuilderService.getAllPcBuilderAdmin();
  sendResponse(res, {
    data: result,
    message: 'PcBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get PcBuilder by id

const getPcBuilderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PcBuilderService.getPcBuilderById(id);
  sendResponse(res, {
    data: result,
    message: 'PcBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update pc_builder

const updatePcBuilder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const pcBuilder = req.body;
  const result = await PcBuilderService.updatePcBuilder(id, pcBuilder);
  sendResponse(res, {
    data: result,
    message: 'PcBuilder updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete pc_builder

const deletePcBuilder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PcBuilderService.deletePcBuilder(id);
  sendResponse(res, {
    data: result,
    message: 'PcBuilder deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const PcBuilderController = {
  createPcBuilder,
  getAllPcBuilder,
  getPcBuilderById,
  updatePcBuilder,
  deletePcBuilder,
  getAllPcBuilderAdmin,
};
