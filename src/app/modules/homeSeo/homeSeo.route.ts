import { Router } from 'express';
import { homeSeoController } from './homeSeo.controller';

const router = Router();

// get home seo

router.get('/', homeSeoController.getHomeSeo);

// update home seo

router.patch('/:id', homeSeoController.updateHomeSeo);

export const homeSeoRoutes = router;
