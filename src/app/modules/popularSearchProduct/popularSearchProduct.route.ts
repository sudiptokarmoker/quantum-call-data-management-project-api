import { Router } from 'express';
import { popularSearchProductController } from './popularSearchProduct.controller';

const router = Router();

router.post('/', popularSearchProductController.createPopularSearchProduct);

router.get('/', popularSearchProductController.getAllPopularSearchProduct);

export const popularSearchProductRoute = router;
