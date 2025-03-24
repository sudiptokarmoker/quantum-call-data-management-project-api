// create products

import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { productsService } from './products.service';
import { Request, Response } from 'express';
import { IProductFilters } from './products.interface';
import pick from '../../../shared/pick';
import { productsFilterableFields } from './products.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationFields } from '../../../constants/pagination';

//product create
const createProducts = catchAsync(async (req: Request, res: Response) => {
  const product = req.body;
  const result = await productsService.createProduct(product);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Products created successfully!',
    data: result,
  });
});

// get all products

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  // filter products

  const filters: IProductFilters = pick(req.query, productsFilterableFields);

  const paginationOptions: IPaginationOptions = pick(
    req.query,
    paginationFields,
  );

  const result = await productsService.getAllProducts(
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products fetched successfully!',
    data: result,
  });
});

// get product by id or slug

const getProductByIdOrSlug = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productsService.getProductByIdOrSlug(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully!',
    data: result,
  });
});

// getActiveFeaturedProducts

const getActiveFeaturedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productsService.getActiveFeaturedProducts();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Featured products fetched successfully!',
      data: result,
    });
  },
);

// update product

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = req.body;
  const result = await productsService.updateProduct(id, product);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

// bulk update product price and stock

const bulkUpdateProductPriceAndStock = catchAsync(
  async (req: Request, res: Response) => {
    const products = req.body;
    const result =
      await productsService.bulkUpdateProductPriceAndStock(products);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Products updated successfully!',
      data: result,
    });
  },
);

// copy product by id

const copyProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productsService.copyProductById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product copied successfully!',
    data: result,
  });
});

// delete product

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productsService.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

// delete product

const upateProductSlugIfAny = catchAsync(
  async (req: Request, res: Response) => {
    console.log('ok');

    const result = await productsService.updateProductSlugs();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product slug updated successfully!',
      data: result,
    });
  },
);



export const productsController = {
  createProducts,
  getAllProducts,
  getProductByIdOrSlug,
  updateProduct,
  deleteProduct,
  getActiveFeaturedProducts,
  bulkUpdateProductPriceAndStock,
  copyProductById,
  upateProductSlugIfAny,
};
