import { z } from 'zod';

const BrandSchema = z.object({
  body: z.object({
    name: z.string().nonempty({
      message: 'Name is required',
    }),
    description: z.string().nonempty({
      message: 'Description is required',
    }),
    is_active: z.boolean().optional(),
    image: z.string().optional(),
  }),
});

export default BrandSchema;
