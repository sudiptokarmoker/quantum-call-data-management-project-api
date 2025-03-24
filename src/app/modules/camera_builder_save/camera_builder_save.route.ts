import { Router } from 'express';
import { CameraBuilderSaveController } from './camera_builder_save.controller';

const router = Router();

// create Camera_builder_save
router.post('/', CameraBuilderSaveController.createCameraBuilderSave);

// get single Camera_builder_save by id and user id
router.get('/:id', CameraBuilderSaveController.getCameraBuilderSaveById);

// get all Camera_builder_save by user id
router.get('/:userId', CameraBuilderSaveController.getCameraBuilderSaveByUserId);

// update Camera_builder_save
router.patch('/:id', CameraBuilderSaveController.updateCameraBuilderSave);

// delete Camera_builder_save
router.delete('/:id', CameraBuilderSaveController.deleteCameraBuilderSave);

export const CameraBuilderSaveRoute = router;
