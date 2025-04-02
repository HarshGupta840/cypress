"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createWorkspaceFormSchema } from "@/lib/types";
import { Subscription, Users, Workspace } from "@/lib/supabase/supabase.types";
import { Button } from "../ui/button";
import Loader from "../global/Loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { v4 } from "uuid";
import { createWorkspace } from "@/lib/supabase/querries";
import Emojipicker from "../global/emoji-picker";
import { AuthUser } from "@supabase/supabase-js";
import { useAppState } from "@/lib/provider/state-provider";
type Props = {
  user: AuthUser;
  subscription: Subscription | null;
};

const Dashboardsetup = ({ user, subscription }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const { dispatch } = useAppState();
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const supabase = createClientComponentClient();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof createWorkspaceFormSchema>>({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof createWorkspaceFormSchema>
  > = async (value) => {
    console.log(value);
    const file = value.logo?.[0];
    let filePath = null;
    const workspaceUUID = v4();
    console.log(file);
    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`workspaceLogo.${workspaceUUID}`, file, {
            upsert: true,
            cacheControl: "3600",
          });
        if (error) throw new Error("");
        filePath = data.path;
        console.log(filePath);
      } catch (error) {
        console.log("Error", error);
        toast({
          variant: "destructive",
          title: "Error! Could not upload your workspace logo",
        });
      }
      try {
        const newWorkspace: Workspace = {
          data: "",
          bannerUrl: "",
          logo: filePath || null,
          id: workspaceUUID,
          inTrash: "",
          createdAt: new Date().toString(),
          title: value.workspaceName,
          workspaceOwner: user.id,
          iconId: selectedEmoji,
        };
        const { data, error: createError } = await createWorkspace(
          newWorkspace
        );
        if (createError) {
          throw new Error();
        }
        dispatch({
          type: "ADD_WORKSPACE",
          payload: { ...newWorkspace, folders: [] },
        });
        toast({
          title: "Workspace Created",
          description: `${newWorkspace.title} has been created successfully.`,
        });
        router.replace(`/dashboard/${newWorkspace?.id}`);
      } catch (error) {
        console.log(error, "Error");
        toast({
          variant: "destructive",
          title: "Could not create your workspace",
          description:
            "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
        });
      } finally {
        reset();
      }
    }
  };
  return (
    <>
      <Card className="w-[800px] sm:h-auto h-full">
        <CardHeader>
          <CardTitle>Create A Workspace</CardTitle>
          <CardDescription>
            Lets create a private workspace to get you started.You can add
            collaborators later from the workspace settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="text-5xl">
                  <Emojipicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                    {selectedEmoji}
                  </Emojipicker>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="workspacename"
                    className="text-text-sm text-muted-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="workspacename"
                    type="text"
                    disabled={isLoading}
                    placeholder="Workspace Name"
                    {...register("workspaceName", {
                      required: "Workspace name is required",
                    })}
                  />
                  <small className="text-red-600">
                    {errors?.workspaceName?.message?.toString()}
                  </small>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="logo"
                  className="text-sm
                  text-muted-foreground
                "
                >
                  Workspace Logo
                </Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  placeholder="Workspace Name"
                  // disabled={isLoading || subscription?.status !== 'active'}
                  {...register("logo", {
                    required: false,
                  })}
                />
                <small className="text-red-600">
                  {errors?.logo?.message?.toString()}
                </small>
                {subscription?.status !== "active" && (
                  <small
                    className="
                  text-muted-foreground
                  block
              "
                  >
                    To customize your workspace, you need to be on a Pro Plan
                  </small>
                )}
              </div>
              <div className="self-end">
                <Button disabled={isLoading} type="submit">
                  {!isLoading ? "Create Workspace" : <Loader />}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Dashboardsetup;
