import express from 'express';
import { BrandController } from './brand.controller';
const router = express.Router();

// create brand
router.post('/', BrandController.createBrand);
// get all brands
router.get('/', BrandController.getAllBrands);
// get brand by id
router.get('/:id', BrandController.getBrandById);
// update brand
router.patch('/:id', BrandController.updateBrand);
// delete brand
router.delete('/:id', BrandController.deleteBrand);

export const BrandRoute = router;
