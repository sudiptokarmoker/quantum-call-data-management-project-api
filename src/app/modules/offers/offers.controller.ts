// create offers

import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';

import { offersService } from './offers.service';

import sendResponse from '../../../shared/sendResponse';

import httpStatus from 'http-status';

import { IOfferFilters } from './offers.interface';

import { IPaginationOptions } from '../../../interfaces/pagination';

import pick from '../../../shared/pick';

import { paginationFields } from '../../../constants/pagination';

const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await offersService.createOffer(req.body);

  sendResponse(res, {
    data: result,

    message: 'Offer created successfully',

    statusCode: httpStatus.CREATED,

    success: true,
  });
});

// get all offers

const getAllOffers = catchAsync(async (req: Request, res: Response) => {
  const filters: IOfferFilters = pick(req.query, [
    'searchTerm',
    'isShowedHome',
  ]);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await offersService.getAllOffers(filters, paginationOptions);

  sendResponse(res, {
    data: result,
    message: 'Offers retrieved successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get single offer

const getSingleOffer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await offersService.getOffer(Number(id));

  sendResponse(res, {
    data: result,
    message: 'Offer retrieved successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update offer

const updateOffer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await offersService.updateOffer(Number(id), req.body);

  sendResponse(res, {
    data: result,
    message: 'Offer updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete offer

const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await offersService.deleteOffer(Number(id));

  sendResponse(res, {
    data: result,
    message: 'Offer deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const offersController = {
  createOffer,
  getAllOffers,
  getSingleOffer,
  updateOffer,
  deleteOffer,
};
