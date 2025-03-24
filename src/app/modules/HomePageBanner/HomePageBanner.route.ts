import { Router } from 'express';
import { sideBannerController } from './HomePageBanner.controller';

const route = Router();

// create sideBanner

route.post('/', sideBannerController.createHomePageBanner);

// get all sideBanner

route.get('/', sideBannerController.getAllHomePageBanner);

// get sideBanner by id

route.get('/:id', sideBannerController.getHomeBannerById);

// update sideBanner

route.patch('/:id', sideBannerController.updateHomePageBanner);

export const HomePageBannerRouter = route;
