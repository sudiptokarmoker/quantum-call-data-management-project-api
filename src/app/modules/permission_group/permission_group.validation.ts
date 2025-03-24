import { z } from 'zod';

const permission_groupSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required!',
    }),
    Permission: z.array(z.string().optional()),
  }),
});

export const PermissionGroupValidation = {
  permission_groupSchema,
};
