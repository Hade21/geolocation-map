import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly CREATE: ZodType = z.object({
    username: z.string().min(1).max(50),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().min(1).max(100).email(),
    password: z.string().min(1).max(100),
    role: z.string().min(1).max(50).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1).max(100),
    username: z.string().min(1).max(50).optional(),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    password: z.string().min(1).max(100).optional(),
    role: z.string().min(1).max(50).optional(),
  });
}
