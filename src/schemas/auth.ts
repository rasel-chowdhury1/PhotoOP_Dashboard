import z from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
});
export const profileSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
});
