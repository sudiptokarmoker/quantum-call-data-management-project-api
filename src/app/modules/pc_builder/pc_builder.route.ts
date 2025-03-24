import { Router } from 'express';
import { PcBuilderController } from './pc_builder.controller';

const router = Router();

// create pc_builder
router.post('/', PcBuilderController.createPcBuilder);

// get all PcBuilder

router.get('/', PcBuilderController.getAllPcBuilder);

// get PcBuilder by admin

router.get('/admin', PcBuilderController.getAllPcBuilderAdmin);

// get PcBuilder by id

router.get('/:id', PcBuilderController.getPcBuilderById);

// update pc_builder

router.patch('/:id', PcBuilderController.updatePcBuilder);

// delete pc_builder

router.delete('/:id', PcBuilderController.deletePcBuilder);

export const PcBuilderRoutes = router;
