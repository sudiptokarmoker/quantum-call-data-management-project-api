// create products
import { Router } from 'express';
import { productsController } from './products.controller';

const router = Router();

// create products

router.post('/', productsController.createProducts);

//upateProductSlugIfAny
router.patch('/update-slug', productsController.upateProductSlugIfAny);

// copy product by id

router.post('/copy/:id', productsController.copyProductById);

// get all products

router.get('/', productsController.getAllProducts);
// get product by id or slug

// getActiveFeaturedProducts

router.get('/featured', productsController.getActiveFeaturedProducts);

// bulk update product price and stock

router.patch('/bulk', productsController.bulkUpdateProductPriceAndStock);

router.get('/:id', productsController.getProductByIdOrSlug);

// update product

router.patch('/:id', productsController.updateProduct);

// delete product

router.delete('/:id', productsController.deleteProduct);

export const productsRoute = router;
