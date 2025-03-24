// create become dealer

import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { BecomeDealerService } from './becomeDealer.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { IBecomeDealerFilters } from './becomeDealer.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

const createBecomeDealer = catchAsync(async (req: Request, res: Response) => {
  const becomeDealer = req.body;
  const result = await BecomeDealerService.createBecomeDealer(becomeDealer);
  sendResponse(res, {
    data: result,
    message: 'Become dealer created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all become dealers

const getAllBecomeDealers = catchAsync(async (req: Request, res: Response) => {
  // filter
  const filters: IBecomeDealerFilters = pick(req.query, [
    'name',
    'companyName',
    'email',
  ]);

  // pagination
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await BecomeDealerService.getAllBecomeDealers(
    filters,
    paginationOptions,
  );
  sendResponse(res, {
    data: result,
    message: 'All become dealers fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const BecomeDealerController = {
  createBecomeDealer,
  getAllBecomeDealers,
};
