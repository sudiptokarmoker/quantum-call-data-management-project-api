import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BrandService } from './brand.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IBrandFilters } from './brand.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { brandFilterableFields } from './brand.constant';

// create brand
const createBrand = catchAsync(async (req: Request, res: Response) => {
  const brand = req.body;

  const result = await BrandService.createBrand(brand);
  sendResponse(res, {
    data: result,
    message: 'Brand created successfully',
    statusCode: httpStatus.CREATED,
    success: true,
  });
});

// get all brands
const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const filters: IBrandFilters = pick(req.query, brandFilterableFields);
  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await BrandService.getAllBrands(filters, paginationOptions);
  sendResponse(res, {
    data: result,
    message: 'All brands fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// get brand by id
const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.getBrandById(id);
  sendResponse(res, {
    data: result,
    message: 'Brand fetched successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// update brand

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = req.body;
  const result = await BrandService.updateBrand(id, brand);
  sendResponse(res, {
    data: result,
    message: 'Brand updated successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

// delete brand

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BrandService.deleteBrand(id);
  sendResponse(res, {
    data: result,
    message: 'Brand deleted successfully',
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
