import { Router } from 'express';
import { districtAndDivisionController } from './districtAndDivition.controller';

const router = Router();

// get all district

router.get('/district', districtAndDivisionController.getAllDistrict);

// get all division

router.get('/division', districtAndDivisionController.getAllDivision);

export const districtAndDivisionRouter = router;
