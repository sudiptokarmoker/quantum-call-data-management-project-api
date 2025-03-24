import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(UserValidation.loginZodSchema),
  AuthController.loginUser,
);

router.post(
  '/admin-login',
  validateRequest(UserValidation.loginZodSchema),
  AuthController.adminLogin,
);

router.post('/forgetPassword', AuthController.forgetPassword);

router.post('/otpVerification', AuthController.otpVerification);

router.post(
  '/changePasswordAfterOtpVerification',
  AuthController.changePasswordAfterOtpVerification,
);

router.post(
  '/social-signIn',
  validateRequest(UserValidation.socialSignInZodSchema),
  AuthController.socialSignIn,
);

router.post(
  '/refresh-token',
  validateRequest(UserValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

router.get(
  '/user',

  AuthController.getUser,
);

router.post('/logout', AuthController.logout);

router.post(
  '/change-password/:id',
  validateRequest(UserValidation.changePasswordZodSchema),
  AuthController.changePassword,
);

export const AuthRoutes = router;
