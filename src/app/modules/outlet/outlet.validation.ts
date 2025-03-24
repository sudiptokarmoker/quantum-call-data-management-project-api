import { z } from 'zod';

const OutletSchema = z.object({
  name: z.string().nonempty('Name is required'),
  address: z.string().nonempty('Address is required'),
  email: z.string().email('Invalid email').nonempty('Email is required'),
  phone: z.string().nonempty('Phone is required'),

  is_active: z.boolean().optional(),
});

export default OutletSchema;
