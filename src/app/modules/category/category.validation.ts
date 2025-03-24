import { z } from 'zod';

const CategorySchema = z.object({
  body: z.object({
    name: z.string().nonempty({
      message: 'Name is required',
    }),
    description: z.string().nonempty({
      message: 'Description is required',
    }),
    is_active: z.boolean().optional(),
    image: z.string().optional(),
    slug: z.string().nonempty({
      message: 'Slug is required',
    }),
    CanonicalUrl: z
      .string()
      .max(128, {
        message: 'Canonical URL must be at most 128 characters long',
      })
      .optional(),
    categorySeoDescription: z.string().optional(),
    meta_title: z.string().optional(),
    category_meta_description_in_head: z.string().optional() 
  }),
});

export default CategorySchema;
