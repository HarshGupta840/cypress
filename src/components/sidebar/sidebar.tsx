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
import WorkspaceDropdown from "./workspace-dropdown";
import PlanUsage from "./plan-usage";
import NativeNavigation from "./native-navigation";
import { ScrollArea } from "../ui/scroll-area";
import FolderDropDown from "./folder-dropdown-list";
import UserCard from "./usercard";

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
          "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-3 md:gap-6 !justify-between",
          className
        )}
      >
        {" "}
        <div className="">
          <WorkspaceDropdown
            collaboratingWokspace={collaboratingWorkspaces}
            sharedWorkspace={sharedWorkspaces}
            privateWorkspace={privateWorkspaces}
            defaultValue={[
              ...privateWorkspaces,
              ...sharedWorkspaces,
              ...collaboratingWorkspaces,
            ].find((workspace) => workspace.id === params.workspaceId)}
          />
          <PlanUsage
            foldersLength={workspaceFolderData?.length || 0}
            subscription={subscriptionData}
          />
          <NativeNavigation myWorkspaceId={params.workspaceId} />
          <ScrollArea
            className="overflow-scroll relative
          h-[450px]"
          >
            <div
              className="pointer-events-none
          w-full
          absolute
          bottom-0
          h-20
          bg-gradient-to-t
          from-background
          to-transparent
          z-40"
            />
            <FolderDropDown
              workspaceFolders={workspaceFolderData || []}
              workspaceId={params.workspaceId}
            />
          </ScrollArea>
        </div>
        <UserCard subscription={subscriptionData} />
      </aside>
    </>
  );
};

export default Sidebar;
