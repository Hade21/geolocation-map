import { ZodType, z } from 'zod';

export class UnitsValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    type: z.string().min(1).max(100),
    egi: z.string().min(1).max(100),
    createdBY: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(100).optional(),
    type: z.string().min(1).max(100).optional(),
    egi: z.string().min(1).max(100).optional(),
  });
}
