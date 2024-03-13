import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  getCollaboratingWorkspaces,
  getFolder,
  getPrivateWorkspace,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from "@/lib/supabase/querries";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

type Props = {
  params: { workspaceId: string };
  className?: string;
};

const Sidebar = async ({ params, className }: Props) => {
  const supabase = createServerComponentClient({ cookies });
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  //subscr
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolder(
    params.workspaceId
  );

  if (subscriptionError || foldersError) redirect("/dashboard");

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspace(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);
  return (
    <>
      <aside
        className={twMerge(
          "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between",
          className
        )}
      ></aside>
    </>
  );
};

export default Sidebar;
