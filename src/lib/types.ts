import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email("Invalid Email").describe("Email"),
  password: z.string().min(1, "password is required").describe("Password"),
});

export const createWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe("workspace name")
    .min(1, "Workspace name must be min of 1 character"),
  logo: z.any(),
});
export const UploadBannerFormSchema = z.object({
  banner: z.string().describe("Banner Image"),
});
