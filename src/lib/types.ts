import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email("Invalid Email").describe("Email"),
  password: z.string().min(1, "password is required").describe("Password"),
});
