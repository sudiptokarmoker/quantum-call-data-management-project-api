import express from 'express';
import { BlogController } from './blog.controller';

const router = express.Router();

// create blog
router.post('/', BlogController.createBlog);
// get all blogs
router.get('/', BlogController.getAllBlogs);
// get blog by id
router.get('/:id', BlogController.getBlogById);
// update blog
router.patch('/:id', BlogController.updateBlog);
// delete blog
router.delete('/:id', BlogController.deleteBlog);

export const blogRouter = router;
