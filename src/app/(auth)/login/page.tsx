"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormSchema } from "@/lib/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import { useRouter } from "next/navigation";
import { actionLoginUser } from "@/lib/server-action/auth-action";

type Props = {};

const Login = ({}: Props) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    formData
  ) => {
    const data = await actionLoginUser(formData);
    if (data.error) {
      form.reset();
      setSubmitError(data?.error);
    }
    router.replace("/dashboard");
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => {
            if (submitError) setSubmitError("");
          }}
          className="w-full sm:w-[500px] space-y-6 flex flex-col justify-center mx-auto"
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
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
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
          {submitError && <FormMessage>{submitError}</FormMessage>}
          <Button
            type="submit"
            className="w-full p-6"
            size="lg"
            disabled={isLoading}
          >
            {!isLoading ? "Login" : <Loader />}
          </Button>
          <span className="self-container">
            Dont have an account?{" "}
            <Link href="/signup" className="text-primary">
              Sign Up
            </Link>
          </span>
        </form>
      </Form>
    </>
  );
};

export default Login;
