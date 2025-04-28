import { Socket, Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email("Invalid Email").describe("Email"),
  password: z.string().min(1, "password is required").describe("Password"),
});
export const SignupFormSchema = z.object({
  email: z.string().email("Invalid Email").describe("Email"),
  password: z.string().min(1, "password is required").describe("Password"),
  fullName: z.string().min(1, "Full name is required"),
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

//for the socket integration purpose
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
