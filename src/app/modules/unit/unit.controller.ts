import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { UnitService } from './unit.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IPermissionFilter } from '../permission_group/permission_group.interface';
import pick from '../../../shared/pick';
import { unitFilterableFields } from './unit.constant';
import { paginationFields } from '../../../constants/pagination';
import { IPaginationOptions } from '../../../interfaces/pagination';

// create unit
const createUnit = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const result = await UnitService.createUnit(body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Unit created successfully!',
    data: result,
  });
});

// get all unit

const getAllUnit = catchAsync(async (req: Request, res: Response) => {
  const filters: IPermissionFilter = pick(req.query, unitFilterableFields);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await UnitService.getAllUnit(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit fetched successfully!',
    data: result,
  });
});

// update unit

const updateUnit = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const result = await UnitService.updateUnit(id, body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit updated successfully!',
    data: result,
  });
});

// delete unit

const deleteUnit = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UnitService.deleteUnit(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit deleted successfully!',
    data: result,
  });
});

export const UnitController = {
  createUnit,
  getAllUnit,
  updateUnit,
  deleteUnit,
};
