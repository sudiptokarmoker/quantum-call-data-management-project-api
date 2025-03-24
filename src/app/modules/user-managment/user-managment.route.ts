import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user-managment.controller';
import { UserValidation } from './user-managment.validation';
// import auth from '../../middlewares/auth';
import multer from 'multer';

import fs from 'fs';

const router = express.Router();

const uploadDir = './uploads/user';

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const upload = multer({
  storage: storage,
});

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  // auth('users.create'),
  UserController.createUser,
);
router.get(
  '/',

  // auth('users.view'),
  UserController.getAllUsers,
);

// getAllCustomers

router.get(
  '/customers',

  // auth('customer.view'),
  UserController.getAllCustomers,
);

router.get(
  '/:id',
  //  auth('users.view'),
  UserController.getSingleUser,
);
router.get('/email/:email', UserController.getSingleUserByEmail);

router.patch(
  '/:id',
  //  auth('users.update'),
  upload.single('image'),
  UserController.updateUser,
);

router.delete(
  '/:id',
  //  auth('users.delete'),
  UserController.deleteUser,
);

// create address for user

router.post('/address/:id', UserController.createAddress);

// update address
router.patch('/address/:id', UserController.updateAddress);

// delete address for user

router.delete('/address/:id', UserController.deleteAddress);

export const UserRoutes = router;
