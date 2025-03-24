import express from 'express';
import { OutletController } from './outlet.controller';

const router = express.Router();

// create Outlet
router.post('/', OutletController.createOutlet);
// get all Outlet
router.get('/', OutletController.getAllOutlet);
// get Outlet by id
router.get('/:id', OutletController.getOutletById);
// update Outlet
router.patch('/:id', OutletController.updateOutlet);
// delete Outlet
router.delete('/:id', OutletController.deleteOutlet);

export const outletRouter = router;
