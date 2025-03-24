import { Router } from 'express';
import { termsAndConditionsServiceController } from './termsAndConditions.controller';

const router = Router();

// get home seo

router.get('/', termsAndConditionsServiceController.getTermsAndConditions);

// update home seo

router.patch('/:id', termsAndConditionsServiceController.updateTermsAndConditions);

export const termsAndConditionsRoutes = router;
