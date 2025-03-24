import { Router } from 'express';

import { galleryController } from './gallery.controller';

const route = Router();

// create image gallery
route.post('/single', galleryController.createSigImage);

// create multiple images gallery
route.post('/multiple', galleryController.createMulImages);

// get all images
route.get('/', galleryController.getAllImages);
// delete many images
route.delete('/delete-many', galleryController.deleteManyImages);
// download image
route.get('/:id/download', galleryController.downloadImage);
// delete image
route.delete('/:id', galleryController.deleteImage);

export const galleryRoute = route;
