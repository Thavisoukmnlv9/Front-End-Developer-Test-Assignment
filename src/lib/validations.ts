import * as z from "zod";

// Todo creation schema
export const createTodoSchema = z.object({
  todo: z
    .string()
    .min(1, "Todo text is required")
    .min(3, "Todo must be at least 3 characters")
    .max(500, "Todo must be less than 500 characters"),
  completed: z.boolean().default(false),
  userId: z
    .number()
    .int("User ID must be a whole number")
    .min(1, "User ID must be at least 1")
    .max(10000, "User ID must be less than 10000"),
});

// Todo update schema
export const updateTodoSchema = z.object({
  todo: z
    .string()
    .min(1, "Todo text is required")
    .min(3, "Todo must be at least 3 characters")
    .max(500, "Todo must be less than 500 characters")
    .optional(),
  completed: z.boolean().optional(),
  userId: z
    .number()
    .int("User ID must be a whole number")
    .min(1, "User ID must be at least 1")
    .max(10000, "User ID must be less than 100100000")
    .optional(),
});

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
