import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly CREATE: ZodType = z.object({
    username: z.string().min(1).max(50),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    role: z.string().min(1).max(50).optional(),
  });
}
