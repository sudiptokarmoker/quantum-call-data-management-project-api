import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CameraBuilderRelationalProductService } from './camera_builder_relational_product.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';


// create Camera Builder Relational Product
const createCameraBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const cameraBuilderRelationalProduct = req.body;
  const result = await CameraBuilderRelationalProductService.createCameraBuilderRelationalProduct(cameraBuilderRelationalProduct);
  sendResponse(res, {
    data: result,
    message: 'Camera Builder Relational Product Created Successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});



// get all get All Camera Builder Relational Product
const getAllCameraBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await CameraBuilderRelationalProductService.getAllCameraBuilderRelationalProduct();
  sendResponse(res, {
    data: result,
    message: 'All Camera Builder Relational Product Fetched Successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});


// get Camera BuilderRelationalProduct by id
const getCameraBuilderRelationalProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CameraBuilderRelationalProductService.getCameraBuilderRelationalProductById(id);
  sendResponse(res, {
    data: result,
    message: 'Camera Builder fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update Camera BuilderRelationalProduct
const updateCameraBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cameraBuilderRelationalProduct = req.body;
  const result = await CameraBuilderRelationalProductService.updateCameraBuilderRelationalProduct(id, cameraBuilderRelationalProduct);
  sendResponse(res, {
    data: result,
    message: 'Camera Builder Relational Product updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});


// delete Camera Builder Relational Product
const deleteCameraBuilderRelationalProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CameraBuilderRelationalProductService.deleteCameraBuilderRelationalProduct(id);
  sendResponse(res, {
    data: result,
    message: 'Camera Builder Relational Product deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});


export const CameraBuilderRelationalProductController = {
  createCameraBuilderRelationalProduct,
  getAllCameraBuilderRelationalProduct,
  getCameraBuilderRelationalProductById,
  updateCameraBuilderRelationalProduct,
  deleteCameraBuilderRelationalProduct,
};
