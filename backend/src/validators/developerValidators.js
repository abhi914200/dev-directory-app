import { z } from 'zod';

// Common for both create & update (with some differences)
const roleEnum = z.enum(['Frontend', 'Backend', 'Full-Stack','Data Analyst','DevOps']);

const baseDeveloperBody = {
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(2, 'Name must be at least 2 characters'),
  role: roleEnum,
  techStack: z
    .union([
      z.string(), // comma-separated string from frontend
      z.array(z.string())
    ])
    .refine(
      (val) =>
        (typeof val === 'string' && val.trim().length > 0) ||
        (Array.isArray(val) && val.length > 0),
      { message: 'Tech stack is required' }
    ),
  experience: z
    .number({
      invalid_type_error: 'Experience must be a number'
    })
    .nonnegative('Experience must be >= 0'),
  description: z.string().optional(),
  joiningDate: z.string().datetime().optional().or(z.string().optional()),
  photoUrl: z.string().url('Invalid photo URL').optional()
};

export const createDeveloperSchema = z.object({
  body: z.object({
    ...baseDeveloperBody
  })
});

// For update, all fields optional (but must be valid if present)
export const updateDeveloperSchema = z.object({
  body: z.object({
    name: baseDeveloperBody.name.optional(),
    role: baseDeveloperBody.role.optional(),
    techStack: baseDeveloperBody.techStack.optional(),
    experience: baseDeveloperBody.experience.optional(),
    description: baseDeveloperBody.description,
    joiningDate: baseDeveloperBody.joiningDate,
    photoUrl: baseDeveloperBody.photoUrl
  })
});

// For list query: search/filter/sort/pagination
export const listDeveloperQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    role: roleEnum.optional(),
    sortBy: z.enum(['experience', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z
      .string()
      .optional()
      .refine((val) => !val || !Number.isNaN(Number(val)), {
        message: 'page must be a number'
      }),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || !Number.isNaN(Number(val)), {
        message: 'limit must be a number'
      })
  })
});
