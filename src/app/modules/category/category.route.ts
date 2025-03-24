import express from 'express';
import { CategoryController } from './category.controller';

const router = express.Router();

// create category
router.post('/', CategoryController.createCategory);

// get all categories
router.get('/', CategoryController.getAllCategories);

// getAllCategoriesForMenu

router.get('/menu', CategoryController.getAllCategoriesForMenu);

// get category witch is active is_featured
router.get('/featured', CategoryController.getFeaturedCategories);

// get all categories without children
router.get(
  '/without-children',
  CategoryController.getAllCategoryWithoutChildren,
);

// get category by id
router.get('/:id', CategoryController.getCategoryById);
// update category
router.patch('/:id', CategoryController.updateCategory);
// delete category
router.delete('/:id', CategoryController.deleteCategory);

export const categoryRouter = router;
