import { Router } from 'express';
import { PcBuilderSaveController } from './pc_builder_save.controller';

const router = Router();

// create pc_builder_save
router.post('/', PcBuilderSaveController.createPcBuilderSave);
// get single pc_builder_save by id and user id
router.get('/:id', PcBuilderSaveController.getPcBuilderSaveById);
// get all pc_builder_save by user id
router.get('/:userId', PcBuilderSaveController.getPcBuilderSaveByUserId);
// update pc_builder_save
router.patch('/:id', PcBuilderSaveController.updatePcBuilderSave);
// delete pc_builder_save
router.delete('/:id', PcBuilderSaveController.deletePcBuilderSave);

export const PcBuilderSaveRoute = router;
