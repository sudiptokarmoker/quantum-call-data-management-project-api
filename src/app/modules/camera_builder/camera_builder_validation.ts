import { z } from 'zod';

const CameraBuilderValidation = z.object({
  categoryId: z.string().nonempty('Category is required'),
  is_required: z.boolean().default(false),
  logoId: z.number().positive({
    message: 'Logo is required',
  }),
  isMultiple: z.boolean().default(false),
  sort_order: z.number().positive({
    message: 'Sort order is required',
  }),
  componentType: z.enum(['CORE_COMPONENTS', 'PERIPHERALS_AND_OTHERS']),
});

export default CameraBuilderValidation;
