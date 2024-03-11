"use client";

import React, { useMemo, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/lib/types";
import { actionSignUpUser } from "@/lib/server-action/auth-action";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Loader from "@/components/global/Loader";
import clsx from "clsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
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
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const form = useForm<z.infer<typeof SignupForm>>({
    mode: "onChange",
    resolver: zodResolver(SignupForm),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const isLoading = form.formState.isSubmitting;

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return "";
    return searchParams.get("error_description");
  }, [searchParams]);

  const confirmationAndErrorStyle = useMemo(() => {
    clsx("bg-primary", {
      "bg-red-500/10": codeExchangeError,
      "border-red-500/50": codeExchangeError,
      "text-red-700": codeExchangeError,
    });
  }, [codeExchangeError]);
  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    console.log("calling the onsumbit fuction function");
    const { error } = await actionSignUpUser({ email, password });
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
          <Button type="submit" className="w-full p-6" disabled={isLoading}>
            {!isLoading ? "Create Account" : <Loader />}
          </Button>

          {(confirmation || codeExchangeError) && (
            <>
              <Alert className={`${confirmationAndErrorStyle}`}>
                {!codeExchangeError && <MailCheck className="h-4 w-4" />}
                <AlertTitle>
                  {codeExchangeError ? "Invalid Link" : "Check your email."}
                </AlertTitle>
                <AlertDescription>
                  {codeExchangeError || "An email confirmation has been sent."}
                </AlertDescription>
              </Alert>
            </>
          )}
        </form>
      </Form>
    </>
  );
};

export default Signup;
