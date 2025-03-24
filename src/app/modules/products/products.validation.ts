import { z } from 'zod';

export const productValidation = z.object({
  body: z.object({
    name: z.string().nonempty({
      message: 'Name is required!',
    }),
    specification: z.string().nonempty({
      message: 'Specification is required!',
    }),
    key_features: z.string().nonempty({
      message: 'Key features is required!',
    }),
    description: z.string().optional(),
    images: z.array(z.string()).nonempty({
      message: 'Images is required!',
    }),
    thumbnailId: z.string().nonempty({
      message: 'Thumbnail is required!',
    }),
    dynamic_banner_id: z.string().optional(),
    video_link: z.string().optional(),

    selling_price: z.number({
      required_error: 'Selling price is required!',
      invalid_type_error: 'Selling price must be a number!',
    }),
    regular_price: z.number({
      required_error: 'Regular price is required!',
      invalid_type_error: 'Regular price must be a number!',
    }),
    special_price: z.number().optional(),
    stock: z.number({
      required_error: 'Stock is required!',
      invalid_type_error: 'Stock must be a number!',
    }),
    slug: z.string().nonempty({
      message: 'Slug is required!',
    }),
    is_active: z.boolean().optional(),
    unit: z.string({
      required_error: 'Unit is required!',
      invalid_type_error: 'Unit must be a string!',
    }),
    weight: z.number().optional(),
    brandId: z.string().optional(),
    CanonicalUrl: z.string().optional(),
    warranty: z.number().optional(),
    warranty_time: z.enum(['day', 'month', 'year']).optional(),
    product_disclaimer: z.string().optional(),
    watt: z.number({
      required_error: 'Watt is required!',
      invalid_type_error: 'Watt must be a number!',
    }),
  }),
});
