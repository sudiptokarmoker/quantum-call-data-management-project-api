import { Router } from 'express';
import bannerController from './banner.controller';

const route = Router();

// create banner

route.post('/', bannerController.createBanner);

// get all banner

route.get('/', bannerController.getAllBanner);

// get banner by id

route.get('/:id', bannerController.getBannerById);

// update banner

route.patch('/:id', bannerController.updateBanner);

// delete banner

route.delete('/:id', bannerController.deleteBanner);

export const bannerRouter = route;
