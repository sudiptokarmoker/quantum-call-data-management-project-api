import { Router } from 'express';
import { CameraBuilderController } from './camera_builder.controller';

const router = Router();

// create camera_builder
router.post('/', CameraBuilderController.createCameraBuilder);

// get all CameraBuilder

router.get('/', CameraBuilderController.getAllCameraBuilder);

// get CameraBuilder by admin

router.get('/admin', CameraBuilderController.getAllCameraBuilderAdmin);

// get CameraBuilder by id

router.get('/:id', CameraBuilderController.getCameraBuilderById);

// update camera_builder

router.patch('/:id', CameraBuilderController.updateCameraBuilder);

// delete camera_builder

router.delete('/:id', CameraBuilderController.deleteCameraBuilder);

export const CameraBuilderRoutes = router;
