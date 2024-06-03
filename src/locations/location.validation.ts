import { ZodType, z } from 'zod';

export class LocationValidation {
  static readonly CREATE: ZodType = z.object({
    long: z.string().min(1).max(100),
    lat: z.string().min(1).max(100),
    alt: z.string().min(1).max(100),
    location: z.string().min(1).max(100),
    dateTime: z.string().min(5),
    unitId: z.string().min(1).max(100),
  });
}
