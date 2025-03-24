import { Router } from 'express';
import { searchVolumeController } from './searchVolume.controller';

const router = Router();

router.post('/', searchVolumeController.createSearchVolume);

router.get('/', searchVolumeController.getAllSearchVolume);

export const searchVolumeRoute = router;
