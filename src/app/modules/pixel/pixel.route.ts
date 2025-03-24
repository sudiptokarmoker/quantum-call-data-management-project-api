import { Router } from 'express';
import { pixelController } from './pixel.controller';

const router = Router();

// create pixel
router.post('/', pixelController.createPixel);
// get all pixels
router.get('/', pixelController.getAllPixels);
// update pixel
router.patch('/:id', pixelController.updatePixel);
// delete pixel
router.delete('/:id', pixelController.deletePixel);

export const pixelRouter = router;
