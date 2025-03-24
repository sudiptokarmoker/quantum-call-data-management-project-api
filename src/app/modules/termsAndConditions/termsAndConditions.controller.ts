// update home seo

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { termsAndConditionsService } from './termsAndConditions.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// get home seo

const getTermsAndConditions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await termsAndConditionsService.getTermsAndConditions();

    sendResponse(res, {
      data: result,
      message: 'Terms And Conditions fetched successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

// updateTermsAndConditions
const updateTermsAndConditions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await termsAndConditionsService.updateTermsAndConditions(
      req.params.id,
      req.body,
    );

    sendResponse(res, {
      data: result,
      message: 'Terms and Conditions updated successfully',
      statusCode: httpStatus.OK,
      success: true,
    });
  },
);

export const termsAndConditionsServiceController = {
  getTermsAndConditions,
  updateTermsAndConditions,
};
