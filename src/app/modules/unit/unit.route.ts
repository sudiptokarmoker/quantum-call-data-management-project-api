import { Router } from 'express';
import { UnitController } from './unit.controller';

const router = Router();

// create unit
router.post('/', UnitController.createUnit);

// get all unit

router.get('/', UnitController.getAllUnit);

// update unit

router.patch('/:id', UnitController.updateUnit);

// delete unit

router.delete('/:id', UnitController.deleteUnit);

export const UnitRoute = router;
