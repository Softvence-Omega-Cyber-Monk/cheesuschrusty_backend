import { z } from "zod";

const create_user = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .enum(["user", "superAdmin", "contentManager", "supportManager"])
    .optional(),
  userType: z.enum(["regular", "pro"]).optional(),
});

export const user_validations = {
  create_user,
};
