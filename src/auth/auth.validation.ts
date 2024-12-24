import { ZodType, z } from 'zod';

export class AuthValidation {
  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
}

export class ChangePasswordValidation {
  static readonly CHANGE: ZodType = z.object({
    oldPassword: z.string().min(1).max(100),
    newPassword: z.string().min(1).max(100),
    confirmPassword: z.string().min(1).max(100),
  });
}
