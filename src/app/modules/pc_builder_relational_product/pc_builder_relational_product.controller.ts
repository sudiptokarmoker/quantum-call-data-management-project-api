import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PcBuilderRelationalProductService } from './pc_builder_relational_product.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';


// create PC Builder Relational Product
const createPcBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const pcBuilderRelationalProduct = req.body;
  const result = await PcBuilderRelationalProductService.createPcBuilderRelationalProduct(pcBuilderRelationalProduct);
  sendResponse(res, {
    data: result,
    message: 'PC Builder Relational Product Created Successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});



// get all get All PcBuilder Relational Product
const getAllPcBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await PcBuilderRelationalProductService.getAllPcBuilderRelationalProduct();
  sendResponse(res, {
    data: result,
    message: 'All Pc Builder Relational Product Fetched Successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});


// get PcBuilderRelationalProduct by id
const getPcBuilderRelationalProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PcBuilderRelationalProductService.getPcBuilderRelationalProductById(id);
  sendResponse(res, {
    data: result,
    message: 'PcBuilder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update pcBuilderRelationalProduct
const updatePcBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const pcBuilderRelationalProduct = req.body;
  const result = await PcBuilderRelationalProductService.updatePcBuilderRelationalProduct(id, pcBuilderRelationalProduct);
  sendResponse(res, {
    data: result,
    message: 'pcBuilder Relational Product updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});


// delete pc Builder Relational Product
const deletePcBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PcBuilderRelationalProductService.deletePcBuilderRelationalProduct(id);
  sendResponse(res, {
    data: result,
    message: 'Pc Builder Relational Product deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});


export const PcBuilderRelationalProductController = {
  createPcBuilderRelationalProduct,
  getAllPcBuilderRelationalProduct,
  getPcBuilderRelationalProductById,
  updatePcBuilderRelationalProduct,
  deletePcBuilderRelationalProduct,
};
