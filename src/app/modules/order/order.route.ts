import { Router } from 'express';

const router = Router();

// create order

import { orderController } from './order.controller';

router.post('/', orderController.createOrder);

// get all orders
router.get('/', orderController.getAllOrders);

// getSingleOrderForAdmin

router.get('/admin/:id', orderController.getSingleOrderForAdmin);

// get single order
router.get('/:id/:userId', orderController.getSingleOrder);

// changeOrderStatus

router.patch('/status/:id', orderController.changeOrderStatus);

// cancel order
router.delete('/cancel/:id', orderController.cancelOrder);

export const orderRoutes = router;
