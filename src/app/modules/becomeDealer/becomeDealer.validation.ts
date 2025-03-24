import { z } from 'zod';

const BecomeDealerSchema = z.object({
  name: z.string().nonempty({
    message: 'Name is required',
  }),
  number: z.string().nonempty({
    message: 'number is required',
  }),
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .nonempty({ message: 'Email is required' }),
  companyName: z.string().nonempty({ message: 'Subject is required' }),
  message: z.string().optional(),
});

export default BecomeDealerSchema;
