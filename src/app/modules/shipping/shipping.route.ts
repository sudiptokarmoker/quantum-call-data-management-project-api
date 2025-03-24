import { Router } from 'express';
import { shippingController } from './shipping.controller';

const router = Router();

// create shipping
router.post('/', shippingController.createShipping);

// get all shippings
router.get('/', shippingController.getShippings);

// update shipping

router.patch('/:id', shippingController.updateShipping);

// delete shipping

router.delete('/:id', shippingController.deleteShipping);

export const shippingRoutes = router;
