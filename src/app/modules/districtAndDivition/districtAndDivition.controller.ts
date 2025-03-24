// get all district

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IDistrictFilters } from './districtAndDivition.interface';
import pick from '../../../shared/pick';
import { districtFilterableFields } from './districtAndDivition.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';
import { districtAndDivisionService } from './districtAndDivition.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const getAllDistrict = catchAsync(async (req: Request, res: Response) => {
  const filters: IDistrictFilters = pick(req.query, districtFilterableFields);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await districtAndDivisionService.getAllDistrict(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'District fetched successfully!',
    data: result,
  });
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await districtAndDivisionService.getAllDivision();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Division fetched successfully!',
    data: result,
  });
});

export const districtAndDivisionController = {
  getAllDistrict,
  getAllDivision,
};
