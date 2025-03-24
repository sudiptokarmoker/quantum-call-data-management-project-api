import { z } from 'zod';

const BlogSchema = z.object({
  title: z.string().nonempty({
    message: 'Title is required',
  }),
  description: z.string().nonempty({
    message: 'Description is required',
  }),
  image: z.string().optional(),
  is_active: z.boolean().optional(),
  blogCategoryId: z.string().nonempty({
    message: 'Category is required',
  }),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export default BlogSchema;
