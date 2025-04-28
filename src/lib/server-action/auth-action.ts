"use server";
import { z } from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { FormSchema, SignupFormSchema } from "../types";
import { cookies } from "next/headers";
import { error } from "console";
import { v4 } from "uuid";

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  console.log("✅login called");
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(response);
  if (response.data.session) {
    console.log("setting auth");
    const res = await supabase.auth.setSession({
      access_token: response?.data?.session.access_token,
      refresh_token: response?.data?.session.refresh_token,
    });
    if (res) {
      console.log("token updated", res);
    }
  } else {
    console.error("Login failed:", error);
  }
  return response;
}

export async function actionSignUpUser({
  email,
  password,
  fullName,
}: z.infer<typeof SignupFormSchema>) {
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
      data: {
        full_name: fullName,
      },
    },
  });
  console.log(response, "here success");
  return response;
}
