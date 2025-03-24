
import express from 'express';
import { BlogCategoryController } from './blogCategory.controller';

const router = express.Router();

// create blog category
router.post('/', BlogCategoryController.createBlogCategory);

// get all blogs category
router.get('/', BlogCategoryController.getAllBlogsCategory);
// get blog category by id
router.get('/:id', BlogCategoryController.getBlogCategoryById);
// update blog category
router.patch('/:id', BlogCategoryController.updateBlogCategory);
// delete blog category
router.delete('/:id', BlogCategoryController.deleteBlogCategory);

export const blogCategoryRouter = router;