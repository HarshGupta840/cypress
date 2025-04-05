"use client";
import React, { useRef, useState } from "react";
import styles from "./styles.module.css";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAppState } from "@/lib/provider/state-provider";
import { Users, Workspace } from "@/lib/supabase/supabase.types";
import { updateWorkspace } from "@/lib/supabase/querries";
import { v4 } from "uuid";
import { Briefcase } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

type Props = {};

const Settingforms = ({}: Props) => {
  const { toast } = useToast();
  const { user, subscription } = useSupabaseUser();
  //   const { open, setOpen } = useSubscriptionModal();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { state, workspaceId, dispatch } = useAppState();
  const [permissions, setPermissions] = useState("private");
  const [collaborators, setCollaborators] = useState<Users[] | []>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace>();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  //wip payment portal

  //add collaborator
  //remove colaborator
  //on change workspace title
  //on change
  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;
    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: { workspace: { title: e.target.value }, workspaceId },
    });
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await updateWorkspace({ title: e.target.value }, workspaceId);
    }, 500);
  };
  const onChangeWorkspaceLogo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!workspaceId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const uuid = v4();
    setUploadingLogo(true);
    const { data, error } = await supabase.storage
      .from("workspace-logos")
      .upload(`workspaceLogo.${uuid}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!error) {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { logo: data.path }, workspaceId },
      });
      await updateWorkspace({ logo: data.path }, workspaceId);
      setUploadingLogo(false);
    }
  };
  //on clicks
  //fetchin gavatar details
  //get workspace details
  //get all the collaborators
  //wip payment portal redirect
  return (
    <>
      <div className="flex gap-4 flex-col">
        <p className="flex items-center gap-2 mt-6">
          <Briefcase size={20} />
          Workspace
        </p>
        <Separator />
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="workspaceName"
            className="text-sm text-muted-foreground"
          >
            Name
          </Label>
          <Input
            name="workspaceName"
            value={workspaceDetails ? workspaceDetails.title : ""}
            placeholder="Workspace Name"
            onChange={workspaceNameChange}
          />
          <Label
            htmlFor="workspaceLogo"
            className="text-sm text-muted-foreground"
          >
            Workspace Logo
          </Label>
          <Input
            name="workspaceLogo"
            type="file"
            accept="image/*"
            placeholder="Workspace Logo"
            onChange={onChangeWorkspaceLogo}
            disabled={uploadingLogo || subscription?.status !== "active"}
          />
        </div>
      </div>
    </>
  );
};

export default Settingforms;
