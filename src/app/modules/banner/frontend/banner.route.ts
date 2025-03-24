import { Router } from 'express';
import bannerController from './../frontend/banner.controller';
const route = Router();

route.get('/', bannerController.getAllBanner);

export const bannerRouterFrontend = route;
