/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Provider, User } from '@prisma/client';

import httpStatus from 'http-status';
import fs from 'fs';

import { genSalt, hash } from 'bcryptjs';
import {
  IAddress,
  ICreateUser,
  IUserFilters,
} from './user-managment.interface';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  userRelationalFields,
  userRelationalFieldsMapper,
  userSearchAbleFields,
} from './user-managment.constant';
import { Request } from 'express';

const createUser = async (data: ICreateUser) => {
  const { password, email, mobile_number } = data;

  // check if ICreateUser any required field is missing then throw error

  const requiredFields = ['first_name', 'email', 'password', 'mobile_number'];

  const missingFields = requiredFields.filter(
    field => !Object.keys(data).includes(field),
  );

  if (missingFields.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${missingFields.join(', ')} is required!`,
    );
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { mobile_number: mobile_number }],
    },
  });
  // Check if user already exist with same mobile number
  if (isUserExist?.mobile_number === data.mobile_number) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Mobile number is already exist!',
    );
  }

  if (
    isUserExist?.email &&
    isUserExist?.provider &&
    isUserExist?.provider !== Provider.credentials
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email is already use with ${isUserExist.provider} provider! Please try with ${isUserExist.provider}.`,
    );
  }

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already exist!');
  }

  const result = await prisma.user.create({
    data: {
      ...data,
      email,
      mobile_number: data.mobile_number,

      password: await hash(password, await genSalt(10)),
      roles: data.roles
        ? {
            connect: data.roles.map(roleId => ({ id: roleId })),
          }
        : undefined,
      address: {
        create: data.address,
      },
    },
  });
  return result;
};

const updateUser = async (id: string, data: any, req: Request) => {
  // check if user exist or not
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (data.email) {
    const isEmailExist = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (isEmailExist && isEmailExist.id !== id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already exist!');
    }
  }

  if (data.mobile_number) {
    const isMobileExist = await prisma.user.findFirst({
      where: { mobile_number: data.mobile_number },
    });

    if (isMobileExist && isMobileExist.id !== id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Mobile number is already exist!',
      );
    }
  }

  // if user want to update password then hash it
  if (data.password) {
    data.password = await hash(data.password, await genSalt(10));
  }

  // if user wants to update image, gender, marital_status, or date_of_birth
  if (req.file || data.gender || data.marital_status || data.date_of_birth) {
    const userPersonalDetails = await prisma.userPersonalDetails.findFirst({
      where: { userId: id },
    });

    if (userPersonalDetails) {
      // If a new image is uploaded, delete the old image

      if (userPersonalDetails.image) {
        fs.unlink(userPersonalDetails.image, err => {
          if (err) {
            console.error(err);
            return;
          }
          //file removed
        });
      }

      await prisma.userPersonalDetails.update({
        where: { id: userPersonalDetails.id },
        data: {
          image: req.file ? req.file.path : userPersonalDetails.image,
          gender: data.gender ?? userPersonalDetails.gender,
          marital_status:
            data.marital_status ?? userPersonalDetails.marital_status,
          date_of_birth:
            data.date_of_birth ?? userPersonalDetails.date_of_birth,
        },
      });
    } else {
      // if UserPersonalDetails record does not exist, create it
      await prisma.userPersonalDetails.create({
        data: {
          userId: id,
          image: req.file ? req.file.path : null,
          gender: data.gender,
          marital_status: data.marital_status,
          date_of_birth: data.date_of_birth,
        },
      });
    }
  }

  const result = await prisma.user.update({
    where: { id },
    data: {
      first_name: data.first_name || isUserExist.first_name,
      last_name: data.last_name || isUserExist.last_name,
      email: data.email || isUserExist.email,
      mobile_number: data.mobile_number || isUserExist.mobile_number,
      is_admin: data.is_admin || isUserExist.is_admin,
      // ...data,
      ...(data.roles && {
        roles: {
          set: [],
          connect: data.roles.map((roleId: string) => ({ id: roleId })),
        },
      }),
      ...(data.permissions && {
        permissions: {
          set: [],
          connect: data.permissions.map((permissionId: string) => ({
            id: permissionId,
          })),
        },
      }),
    },
  });
  return result;
};

const getSingleUser = async (id: string): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_admin: true,
      mobile_number: true,
      // UserRole: true,
      roles: false,
      address: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      orders: {
        select: {
          address: true,
          discountAmount: true,
          id: true,
          isPaid: true,
          paymentMethod: true,
          shippingAmount: true,
          orderId: true,
          status: true,
          subTotal: true,
          total: true,
          products: {
            select: {
              id: true,
              price: true,
              productId: true,
              quantity: true,
              total: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnail: true,
                  special_price: true,
                  regular_price: true,
                  selling_price: true,
                  stock: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      UserPersonalDetails: true,
      permissions: false,
      PCBuilderSave: {
        select: {
          id: true,
          name: true,
          description: true,
          products: {
            select: {
              categorySlug: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnail: true,
                  special_price: true,
                  regular_price: true,
                  selling_price: true,
                  stock: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      CameraBuilderSave: {
        select: {
          id: true,
          name: true,
          description: true,
          products: {
            select: {
              categorySlug: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnail: true,
                  special_price: true,
                  regular_price: true,
                  selling_price: true,

                  stock: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found user!');
  }
  return result;
};

// get single user by email

const getSingleUserByEmail = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_admin: true,
      mobile_number: true,
      // UserRole: true,
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
      address: true,
      UserPersonalDetails: true,
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found user!');
  }

  const rolesPermissions =
    result?.roles?.flatMap(role => role.permissions) || [];
  const allPermissions = [...rolesPermissions, ...(result?.permissions || [])];

  result.permissions = allPermissions;

  return result;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (userRelationalFields.includes(key)) {
          return {
            [userRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      is_admin: true,
      mobile_number: true,
      // UserRole: true,
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
      address: true,
      UserPersonalDetails: true,
      permissions: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get all customers

const getAllCustomers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (userRelationalFields.includes(key)) {
          return {
            [userRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  // Ensure users have at least one order
  andConditions.push({
    orders: {
      some: {},
    },
  });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      mobile_number: true,
      address: true,
      UserPersonalDetails: true,
      orders: {
        select: {
          id: true,
          isPaid: true,
          total: true,
          products: true,
        },
      },
    },

    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  const finalResult = result.map(user => {
    const total_order_amount = user.orders.reduce(
      (acc, order) => acc + (order?.total ?? 0),
      0,
    );
    return {
      ...user,
      total_order_amount,
    };
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: finalResult,
  };
};

const deleteUser = async (id: string): Promise<User> => {
  // Check if user exist or not
  const isUserExist = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: true,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // check if user role is super_admin then throw error

  if (isUserExist.roles.some(role => role.name === 'super_admin')) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can not delete super admin!',
    );
  }

  const result = await prisma.user.delete({
    where: { id },
  });
  return result;
};

// create address for user

const createAddress = async (id: string, data: IAddress) => {
  // Check if user exist or not
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check if there's a default address
  const defaultAddress = await prisma.address.findFirst({
    where: { userId: id, is_default: true },
  });

  // If there's no default address or the new address is set as default
  if (!defaultAddress || data.is_default) {
    // Set all other addresses as non-default
    await prisma.address.updateMany({
      where: { userId: id },
      data: { is_default: false },
    });

    // Set the new address as default
    data.is_default = true;
  }

  const result = await prisma.address.create({
    data: {
      ...data,
      userId: id,
    },
  });
  return result;
};

// update address

const updateAddress = async (id: string, data: IAddress) => {
  // Check if address exist or not
  const isAddressExist = await prisma.address.findUnique({
    where: { id },
  });

  if (!isAddressExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found!');
  }

  // Check if there's a default address
  const defaultAddress = await prisma.address.findFirst({
    where: { userId: isAddressExist.userId, is_default: true },
  });

  // If there's no default address or the new address is set as default
  if (!defaultAddress || data.is_default) {
    // Set all other addresses as non-default
    await prisma.address.updateMany({
      where: { userId: isAddressExist.userId },
      data: { is_default: false },
    });

    // Set the new address as default
    data.is_default = true;
  }

  const result = await prisma.address.update({
    where: { id },
    data,
  });
  return result;
};

// delete address for user

const deleteAddress = async (id: string) => {
  // Check if address exist or not
  const isAddressExist = await prisma.address.findUnique({
    where: { id },
  });

  if (!isAddressExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found!');
  }

  // If the address is set as default, throw an error
  if (isAddressExist.is_default) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot delete default address!',
    );
  }

  const result = await prisma.address.delete({
    where: { id },
  });
  return result;
};

export const UserService = {
  createUser,
  updateUser,
  getSingleUser,
  getAllUsers,
  deleteUser,
  getSingleUserByEmail,
  createAddress,
  deleteAddress,
  updateAddress,
  getAllCustomers,
};
