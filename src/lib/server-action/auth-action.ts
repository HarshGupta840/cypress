"use server";
import { z } from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { FormSchema } from "../types";
import { cookies } from "next/headers";
import { error } from "console";

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Login failed:", error.message);
    return { success: false, error: error.message };
  }
  return { data };
}

export async function actionSignUpUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);

  if (data?.length) {
    console.log(data);
    return { error: { message: "User already exists", data } };
  }
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
    },
  });
  console.log(response, "here success");
  return response;
}

export async function actionSignOutUser() {
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("not able to signout");
  }
}
