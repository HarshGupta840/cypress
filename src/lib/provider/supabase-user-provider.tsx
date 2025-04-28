"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthUser } from "@supabase/supabase-js";
import { Subscription, Users } from "../supabase/supabase.types";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getUserSubscriptionStatus } from "../supabase/querries";

type Props = {
  children: React.ReactNode;
};

type SupabaseContextProvider = {
  user: AuthUser | null;
  subscription: Subscription | null;
  // active: Users | null;
};

const SupabaseUserContext = createContext<SupabaseContextProvider>({
  user: null,
  subscription: null,
  // active: null,
});

export const SupabaseUserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  // const [active, setActive] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const getAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data, error } = await getUserSubscriptionStatus(user?.id);
      if (data) setSubscription(data);
      if (error) {
        toast({
          title: "Unexpected Error",
          description: "Oppse! An unexpected error happened. Try again later.",
        });
      }
    }
  };
  useEffect(() => {
    getAuth();
  }, [supabase, toast]);
  return (
    <SupabaseUserContext.Provider value={{ user, subscription }}>
      {children}
    </SupabaseUserContext.Provider>
  );
};

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};
