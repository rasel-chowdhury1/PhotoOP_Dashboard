import z from "zod";

export const documentContentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
