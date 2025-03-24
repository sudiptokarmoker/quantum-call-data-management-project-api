import { z } from 'zod';

const CameraBuilderRelationalProductSchema = z.object({
  body: z.object({
    parent_product_id: z.string().nonempty('Parent Product Id is required'),
    relative_product_id: z
      .array(
        z.string({
          message: 'Relative Product Id must be a string',
        }),
      )
      .nonempty('Relative Product Id is required'),
  }),
});

export default CameraBuilderRelationalProductSchema;
