import { Router } from 'express';
import { sideBannerController } from './sidebanner.controller';

const route = Router();

// create sideBanner

route.post('/', sideBannerController.createSideBanner);

// get all sideBanner

route.get('/', sideBannerController.getAllSideBanner);

// get sideBanner by id

route.get('/:id', sideBannerController.getSideBannerById);

// update sideBanner

route.patch('/:id', sideBannerController.updateSideBanner);

export const sideBannerRouter = route;
