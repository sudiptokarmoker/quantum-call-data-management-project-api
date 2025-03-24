import { z } from 'zod';

const AttributeValueSchema = z.object({
  body: z.object({
    attributeId: z.string().nonempty({
      message: 'Attribute Id is required',
    }),
    value: z.string().nonempty({
      message: 'Value is required',
    }),
  }),
});

const AttributeSchema = z.object({
  body: z.object({
    name: z.string().nonempty({
      message: 'Name is required',
    }),
    is_active: z.boolean().optional(),
    AttributeValue: z.array(AttributeValueSchema),
  }),
});

export const AttributesValidation = {
  AttributeSchema,
  AttributeValueSchema,
};
