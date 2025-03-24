import catchAsync from '../../../shared/catchAsync';

import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';
import { OutletService } from './outlet.service';
import { IOutletFilters } from './outlet.interface';
import { outletFilterableFields } from './outlet.constant';

// create outlet
const createOutlet = catchAsync(async (req: Request, res: Response) => {
  const outlet = req.body;
  const result = await OutletService.createOutlet(outlet);
  sendResponse(res, {
    data: result,
    message: 'Outlet created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all Outlet
const getAllOutlet = catchAsync(async (req: Request, res: Response) => {
  // filter
  const filters: IOutletFilters = pick(req.query, outletFilterableFields);

  // pagination
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await OutletService.getAllOutlet(filters, paginationOptions);
  sendResponse(res, {
    data: result,
    message: 'All Outlet fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get Outlet by id

const getOutletById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OutletService.getOutletById(id);
  sendResponse(res, {
    data: result,
    message: 'Outlet fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update blog

const updateOutlet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = req.body;
  const result = await OutletService.updateOutlet(id, blog);
  sendResponse(res, {
    data: result,
    message: 'Outlet updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete Outlet

const deleteOutlet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OutletService.deleteOutlet(id);
  sendResponse(res, {
    data: result,
    message: 'Outlet deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const OutletController = {
  createOutlet,
  getAllOutlet,
  getOutletById,
  updateOutlet,
  deleteOutlet,
};
