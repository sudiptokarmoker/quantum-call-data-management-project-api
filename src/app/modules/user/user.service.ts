import httpStatus from 'http-status';

import { PrismaClient, User, Provider } from '@prisma/client';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt, { compare } from 'bcryptjs';
import {
  IChangePassword,
  IForgetPassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  ISocialSignIn,
} from './user.interface';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { sendMail } from '../../../helpers/nodeMailer';
import { OtpTemplate } from '../../../helpers/OtpTemplate';
import { sendOtpSms } from '../../../helpers/sendSms';

const prisma = new PrismaClient();

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const {
    email: userEmail,
    password,
    mobile_number: userMobileNumber,
  } = payload;
  // Using Static Methods
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: userEmail }, { mobile_number: userMobileNumber }],
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      provider: true,
      password: true,
      mobile_number: true,
      roles: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  if (
    isUserExist?.email &&
    isUserExist?.provider &&
    isUserExist?.provider !== Provider.credentials
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already in use with ${isUserExist.provider} provider! Please try with ${isUserExist.provider}.`,
    );
  }

  //Check User match Password
  if (
    isUserExist?.password &&
    !(await compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //Create JWT token
  const { id, email, mobile_number } = isUserExist;

  // const rolesPermissions =
  //   isUserExist?.roles?.flatMap(role => role.permissions) || [];
  // const allPermissions = [
  //   ...rolesPermissions,
  //   ...(isUserExist?.permissions || []),
  // ];

  const accessToken = jwtHelpers.createToken(
    { id, email, mobile_number },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    id: isUserExist.id,

    email: isUserExist.email,
    first_name: isUserExist.first_name,
    last_name: isUserExist?.last_name ?? '',
  };
};

// admin login

const adminLogin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const {
    email: userEmail,
    password,
    mobile_number: userMobileNumber,
  } = payload;

  // Using Static Methods
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: userEmail }, { mobile_number: userMobileNumber }],
    },
    include: {
      roles: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      permissions: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  // check if user.roles not includes 'admin' or "super_admin" role then throw error. user.roles is an array of roles,check its name

  // if (
  //   !isUserExist.roles?.some(role => role.name === 'admin') &&
  //   !isUserExist.roles?.some(role => role.name === 'super_admin')
  // ) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
  // }

  // if role not found then throw error

  if (isUserExist.roles.length === 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');
  }

  if (
    isUserExist?.email &&
    isUserExist?.provider &&
    isUserExist?.provider !== Provider.credentials
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already in use with ${isUserExist.provider} provider! Please try with ${isUserExist.provider}.`,
    );
  }

  //Check User match Password
  if (
    isUserExist?.password &&
    !(await compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //Create JWT token
  const { id, email, mobile_number } = isUserExist;

  // const rolesPermissions =
  //   isUserExist?.roles?.flatMap(role => role.permissions) || [];
  // const allPermissions = [
  //   ...rolesPermissions,
  //   ...(isUserExist?.permissions || []),
  // ];

  const accessToken = jwtHelpers.createToken(
    { id, email, mobile_number },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken,
    email: isUserExist.email,
    first_name: isUserExist.first_name,
    last_name: isUserExist?.last_name ?? '',
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  if (!token) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Token is required!');
  }

  const decodeToken = jwtHelpers.decodeToken(token);
  // console.log('decodeToken', decodeToken);

  const { id, email, roles, name, mobile_number } = decodeToken;

  if (!id || !email || !roles || !name || !mobile_number) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token!');
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { mobile_number: mobile_number }],
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  // Create new Access Token
  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,

      email: isUserExist.email,
      // role: isUserExist.role,
      mobile_number: isUserExist.mobile_number,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const socialSignIn = async (
  payload: ISocialSignIn,
): Promise<
  Partial<User> & {
    accessToken: string;
  }
> => {
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,

      roles: true,

      provider: true,
    },
  });

  if (
    user &&
    user.email === payload.email &&
    user.provider !== payload.provider
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already in use with ${user.provider} provider! Please try with ${user.provider}`,
    );
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        mobile_number: payload.mobile_number,
        provider: payload.provider,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,

        roles: true,

        provider: true,
      },
    });
  }

  //Create JWT token
  const { id, email, roles } = user;

  const accessToken = jwtHelpers.createToken(
    { id, email, roles },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    ...user,
    accessToken,
  };
};

const changePassword = async (
  id: string,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // Checking User is exist or not by Using Static Methods
  const isUserExist = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  //Check User match Password
  if (
    isUserExist?.password &&
    !(await compare(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect!');
  }

  // Hashed Password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  // Update User Password
  const updatedData = {
    password: newHashedPassword,
  };

  await prisma.user.update({
    where: { id: id },
    data: updatedData,
  });
};

// forget password with email or mobile number

const forgetPassword = async (payload: IForgetPassword) => {
  // 6 digit random otp generation
  const otp = Math.floor(100000 + Math.random() * 900000);
  // expire time for otp 5 minutes
  const expireTime = new Date();
  expireTime.setMinutes(expireTime.getMinutes() + 5);

  if (payload.email) {
    const isUserExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Email!');
    }

    // Check if an OTP already exists and is not expired
    const existingOtp = await prisma.forgetPasswordOTP.findFirst({
      where: {
        email: payload.email,
        expireTime: {
          gt: new Date(),
        },
      },
    });

    if (existingOtp) {
      const remainingTimeMs =
        existingOtp.expireTime.getTime() - new Date().getTime();
      const remainingMinutes = Math.floor(remainingTimeMs / 60000);
      const remainingSeconds = Math.floor((remainingTimeMs % 60000) / 1000);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Try again in ${remainingMinutes} minute(s) and ${remainingSeconds} second(s).`,
      );
    }

    // Send OTP to user email
    await sendMail(
      payload.email,
      'Forget Password OTP',
      ``,
      OtpTemplate(
        otp,
        `${isUserExist?.first_name + ' ' + isUserExist?.last_name}`,
      ),
    )
      .then(() => console.log('Email sent successfully'))
      .catch(error => console.error('Failed to send email:', error));

    // Store OTP and expire time in database
    const result = await prisma.forgetPasswordOTP.create({
      data: {
        email: payload.email,
        otp: otp,
        expireTime: expireTime,
      },
    });

    return result;
  }

  if (payload.mobile_number) {
    const isUserExist = await prisma.user.findFirst({
      where: {
        mobile_number: payload.mobile_number,
      },
    });
    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Mobile Number!');
    }

    // Check if an OTP already exists and is not expired

    const existingOtp = await prisma.forgetPasswordOTP.findFirst({
      where: {
        mobile_number: payload.mobile_number,
        expireTime: {
          gt: new Date(),
        },
      },
    });

    if (existingOtp) {
      const remainingTimeMs =
        existingOtp.expireTime.getTime() - new Date().getTime();
      const remainingMinutes = Math.floor(remainingTimeMs / 60000);
      const remainingSeconds = Math.floor((remainingTimeMs % 60000) / 1000);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Try again in ${remainingMinutes} minute(s) and ${remainingSeconds} second(s).`,
      );
    }

    // Send OTP to user mobile number

    const message = `Your OTP code is ${otp}. It will expire in 5 minutes. Please do not share this OTP with anyone.`;

    await sendOtpSms(payload.mobile_number, message);

    // Store OTP and expire time in database

    const result = await prisma.forgetPasswordOTP.create({
      data: {
        mobile_number: payload.mobile_number,
        otp: otp,
        expireTime: expireTime,
      },
    });

    return result;
  }
};
// otp verification and reset password

const otpVerification = async (email: string, otp: number) => {
  const isOtpExist = await prisma.forgetPasswordOTP.findFirst({
    where: {
      OR: [{ email: email }, { mobile_number: email }],
      otp: otp,
    },
  });

  if (!isOtpExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP!');
  }

  // check expire time of otp if expire then throw error

  // check if OTP is already verified
  if (isOtpExist.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP is already verified!');
  }

  if (isOtpExist.expireTime < new Date()) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OTP is expired!');
  }

  // update OTP to mark it as verified
  await prisma.forgetPasswordOTP.update({
    where: {
      id: isOtpExist.id,
    },
    data: {
      isVerified: true,
    },
  });

  return isOtpExist;
};

// change password after otp verification

const changePasswordAfterOtpVerification = async (
  email: string,
  newPassword: string,
  otp: number,
) => {
  // Checking User is exist or not by Using Static Methods
  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { mobile_number: email }],
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  // check otp verification

  const isOtpExist = await prisma.forgetPasswordOTP.findFirst({
    where: {
      OR: [{ email: email }, { mobile_number: email }],
      otp: Number(otp),
    },
  });

  if (!isOtpExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP!');
  }

  // Hashed Password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_salt_rounds),
  );

  // Update User Password
  const updatedData = {
    password: newHashedPassword,
  };

  await prisma.user.update({
    where: { email: isUserExist.email },
    data: updatedData,
  });

  return isUserExist;
};

const getUser = async (
  user: JwtPayload | null,
): Promise<Partial<User> | null> => {
  // Checking User is exist or not by Using Static Methods
  const result = await prisma.user.findUnique({
    where: { email: user?.userEmail },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      roles: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      password: false, // Include password if needed
      permissions: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }
  return result;
};

const logout = async (
  refreshToken: string,
): Promise<JwtPayload | undefined> => {
  const verifiedToken = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret,
  );

  const { email } = verifiedToken;
  // Checking User is exist or not by Using Static Methods
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }
  return verifiedToken;
};

export const AuthService = {
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
