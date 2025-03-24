import { Router } from 'express';
import { offersController } from './offers.controller';

const router = Router();

// create offers
router.post('/', offersController.createOffer);

// get all offers

router.get('/', offersController.getAllOffers);

// get single offer

router.get('/:id', offersController.getSingleOffer);

// update offer

router.patch('/:id', offersController.updateOffer);

// delete offer

router.delete('/:id', offersController.deleteOffer);

export const offersRoute = router;
