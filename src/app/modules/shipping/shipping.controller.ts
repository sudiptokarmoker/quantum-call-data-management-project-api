// create shipping

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { shippingService } from './shipping.service';
import { Request, Response } from 'express';
import { IShippingFilters } from './shipping.interface';
import pick from '../../../shared/pick';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

const createShipping = catchAsync(async (req: Request, res: Response) => {
  const shipping = req.body;
  const result = await shippingService.createShipping(shipping);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Shipping created successfully!',
    data: result,
  });
});

// get all shippings

const getShippings = catchAsync(async (req: Request, res: Response) => {
  const filters: IShippingFilters = pick(req.query, ['searchTerm']);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await shippingService.getShippings(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shippings fetched successfully!',
    data: result,
  });
});

// update shipping

const updateShipping = catchAsync(async (req: Request, res: Response) => {
  const shippingId = req.params.id;
  const shipping = req.body;

  const result = await shippingService.updateShipping(shippingId, shipping);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping updated successfully!',
    data: result,
  });
});

// delete shipping

const deleteShipping = catchAsync(async (req: Request, res: Response) => {
  const shippingId = req.params.id;

 const result = await shippingService.deleteShipping(shippingId);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Shipping deleted successfully!',
    data: result,

  });
});

export const shippingController = {
  createShipping,
  getShippings,
  updateShipping,
  deleteShipping,
};
