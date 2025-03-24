// create order

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { orderService } from './order.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IOrderFilters } from './order.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import pick from '../../../shared/pick';
import { orderFilterableFields } from './order.constant';
import { paginationFields } from '../../../constants/pagination';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.createOrder(req.body);

  sendResponse(res, {
    data: result,
    message: 'Order created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// cancel order

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.cancelOrder(req.params.id);

  sendResponse(res, {
    data: result,
    message: 'Order cancelled successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get single order

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const result = await orderService.getSingleOrder(id, userId);

  sendResponse(res, {
    data: result,
    message: 'Order retrieved successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get all orders

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters: IOrderFilters = pick(req.query, orderFilterableFields);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await orderService.getAllOrders(filters, paginationOptions);

  sendResponse(res, {
    data: result,
    message: 'Orders retrieved successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

const getSingleOrderForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await orderService.getSingleOrderForAdmin(id);

    sendResponse(res, {
      data: result,
      message: 'Order retrieved successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// change order status

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.changeOrderStatus(
    req.params.id,
    req.body.status,
  );

  sendResponse(res, {
    data: result,
    message: 'Order status updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const orderController = {
  createOrder,
  cancelOrder,
  getSingleOrder,
  getAllOrders,
  getSingleOrderForAdmin,
  changeOrderStatus,
};
