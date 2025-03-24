import { Router } from 'express';
import { PcBuilderRelationalProductController } from './pc_builder_relational_product.controller';
import validateRequest from '../../middlewares/validateRequest';
import PcBuilderRelationalProductSchema from './pc_builder_relational_product.validation';
const router = Router();

router.post('/', validateRequest(PcBuilderRelationalProductSchema), PcBuilderRelationalProductController.createPcBuilderRelationalProduct);
router.put('/:id', validateRequest(PcBuilderRelationalProductSchema), PcBuilderRelationalProductController.updatePcBuilderRelationalProduct);
router.delete('/:id', validateRequest(PcBuilderRelationalProductSchema), PcBuilderRelationalProductController.deletePcBuilderRelationalProduct);
router.get('/', PcBuilderRelationalProductController.getAllPcBuilderRelationalProduct);
router.get('/:id', validateRequest(PcBuilderRelationalProductSchema), PcBuilderRelationalProductController.getPcBuilderRelationalProductById);
export const PcBuilderRelationalProductRoutes = router;
