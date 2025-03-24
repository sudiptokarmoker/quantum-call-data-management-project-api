import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { User } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import { IRefreshTokenResponse } from './user.interface';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Logged in successfully!',
    data: result,
  });
});

// admin login

const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.adminLogin(loginData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Logged in successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers?.authorization?.split(' ')[1];
  const result = await AuthService.refreshToken(token!);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully!',
    data: result,
  });
});

const socialSignIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.socialSignIn(req.body);

  sendResponse<
    Partial<User> & {
      accessToken: string;
    }
  >(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Sign-in Successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...passwordData } = req.body;
  await AuthService.changePassword(id, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.getUser(user);

  sendResponse<Partial<User> | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retrieve User successfully!',
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.logout(refreshToken);
  if (result?.userCode) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logout successfully!',
  });
});

// forget password with email or mobile number

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  const result = await AuthService.forgetPassword(body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'forget Password send',
    data: result,
  });
});

// otp verification and reset password

const otpVerification = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const result = await AuthService.otpVerification(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'otp verify successfully',
    data: result,
  });
});

// change password after otp verification

const changePasswordAfterOtpVerification = catchAsync(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;

    const result = await AuthService.changePasswordAfterOtpVerification(
      email,
      newPassword,
      otp,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'changePasswordAfterOtpVerification successfully',
      data: result,
    });
  },
);

export const AuthController = {
  loginUser,
  socialSignIn,
  refreshToken,
  changePassword,
  getUser,
  logout,
  adminLogin,
  forgetPassword,
  otpVerification,
  changePasswordAfterOtpVerification,
};
