import express from 'express';
import { PermissionController } from './permission.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// create permission
router.post(
  '/',
  // auth('permission.create'),
  PermissionController.createPermissionGroup,
);
// get all permission
router.get(
  '/',
  auth('permission.view'),
  PermissionController.getAllPermissionGroup,
);
// get single permission
router.get(
  '/:id',
  // auth('permission.view'),
  PermissionController.getSinglePermissionGroup,
);
// update permission
router.patch(
  '/:id',
  // auth('permission.update'),
  PermissionController.updatePermissionGroup,
);
// delete permission
router.delete(
  '/:id',
  // auth('permission.delete'),
  PermissionController.deletePermissionGroup,
);

export const PermissionRoute = router;
