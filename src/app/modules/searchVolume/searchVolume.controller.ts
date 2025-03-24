import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';

import { searchVolumeService } from './searchVolume.service';

import sendResponse from '../../../shared/sendResponse';

import httpStatus from 'http-status';

import { ISearchVolumeFilters } from './searchVolume.interface';

import { IPaginationOptions } from '../../../interfaces/pagination';

import pick from '../../../shared/pick';

import { paginationFields } from '../../../constants/pagination';

const createSearchVolume = catchAsync(async (req: Request, res: Response) => {
  const result = await searchVolumeService.createSearchVolume(req.body);

  sendResponse(res, {
    data: result,
    message: 'Search volume created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

const getAllSearchVolume = catchAsync(async (req: Request, res: Response) => {
  const filters: ISearchVolumeFilters = pick(req.query, ['searchTerm']);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await searchVolumeService.getAllSearchVolume(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    data: result,
    message: 'Search volume retrieved successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const searchVolumeController = {
  createSearchVolume,
  getAllSearchVolume,
};
