import { z } from 'zod';

const BlogCategorySchema = z.object({
  name: z.string().nonempty({
    message: 'Name is required',
  }),
  is_active: z.boolean().optional(),
});

export default BlogCategorySchema;
