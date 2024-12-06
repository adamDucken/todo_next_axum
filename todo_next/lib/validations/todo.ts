import { z } from "zod";

export const todoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  completed: z.boolean().default(false),
});

export type Todo = z.infer<typeof todoSchema>;

