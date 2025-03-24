import { Router } from 'express';
import { CameraBuilderRelationalProductController } from './camera_builder_relational_product.controller';
import validateRequest from '../../middlewares/validateRequest';
import CameraBuilderRelationalProductSchema from './camera_builder_relational_product.validation';
const router = Router();

router.post('/', validateRequest(CameraBuilderRelationalProductSchema), CameraBuilderRelationalProductController.createCameraBuilderRelationalProduct);
router.put('/:id', validateRequest(CameraBuilderRelationalProductSchema), CameraBuilderRelationalProductController.updateCameraBuilderRelationalProduct);
router.delete('/:id', validateRequest(CameraBuilderRelationalProductSchema), CameraBuilderRelationalProductController.deleteCameraBuilderRelationalProduct);
router.get('/', CameraBuilderRelationalProductController.getAllCameraBuilderRelationalProduct);
router.get('/:id', validateRequest(CameraBuilderRelationalProductSchema), CameraBuilderRelationalProductController.getCameraBuilderRelationalProductById);
export const CameraBuilderRelationalProductRoutes = router;
