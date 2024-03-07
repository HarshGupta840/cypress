"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/lib/types";
import { actionSignupUser } from "@/lib/server-action/auth-action";
import Link from "next/link";
import { Input } from "@/components/ui/input";
type Props = {};

const SignupForm = z
  .object({
    email: z.string().describe("Email").email({ message: "Invalid Email" }),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be minimum 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must be minimum 6 characters"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    "Passwords do not match"
  );

const Signup = ({}: Props) => {
  const router = useRouter();

  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const form = useForm<z.infer<typeof SignupForm>>({
    mode: "onChange",
    resolver: zodResolver(SignupForm),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error } = await actionSignupUser({ email, password });
    if (error) {
      setSubmitError(error.message);
      form.reset();
      return;
    }
    setConfirmation(true);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => {
            if (submitError) setSubmitError("");
          }}
          className="w-full sm:w-[500px] flex flex-col justify-center gap-y-6"
        >
          <Link
            href="/"
            className="
          w-full
          flex
          justify-left
          items-center"
          >
            {/* <Image
            src={Logo}
            alt="cypress Logo"
            width={50}
            height={50}
          /> */}
            <span
              className="font-semibold
          dark:text-white text-4xl first-letter:ml-2"
            >
              cypress.
            </span>
          </Link>

          <FormDescription
            className="
        text-foreground/60"
          >
            An all-In-One Collaboration and Productivity Platform
          </FormDescription>
          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            disabled={isLoading}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isLoading}
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default Signup;
