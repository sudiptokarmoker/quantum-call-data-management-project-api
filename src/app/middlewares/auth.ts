import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';

const auth =
  (requiredRoles: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      // console.log('🚀 ~ token:', token);

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // decode token

      const decodedToken = jwtHelpers.decodeToken(token);

      // // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      // console.log('🚀 ~ verifiedUser:', verifiedUser);

      req.user = verifiedUser; // role  , userid

      // const isPermissionsExist = decodedToken.permissions.some(
      //   (permission: { id: string; name: string }) =>
      //     permission?.name === requiredRoles,
      // );

      // get user

      const isUserExist = await prisma.user.findFirst({
        where: {
          id: decodedToken?.id,
        },
        select: {
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
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      const rolesPermissions =
        isUserExist?.roles?.flatMap(role => role.permissions) || [];
      const allPermissions = [
        ...rolesPermissions,
        ...(isUserExist?.permissions || []),
      ];

      const isPermissionsExist = allPermissions?.some(
        (permission: { id: string; name: string }) =>
          permission?.name === requiredRoles,
      );

      if (!isPermissionsExist) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
