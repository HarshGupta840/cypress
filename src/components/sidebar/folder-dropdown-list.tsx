"use client";
import React, { useEffect, useState } from "react";
import { Folders } from "@/lib/supabase/supabase.types";
import { useToast } from "../ui/use-toast";
import { useAppState } from "@/lib/provider/state-provider";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { v4 } from "uuid";
import { createFolder } from "@/lib/supabase/querries";
import { PlusIcon } from "lucide-react";
import TooltipComponent from "../global/tooltip-component";
import { Accordion } from "../ui/accordion";
import Dropdown from "./dropdown";

type Props = {
  workspaceFolders: Folders[];
  workspaceId: string;
};

const FolderDropDown = ({ workspaceFolders, workspaceId }: Props) => {
  const { subscription } = useSupabaseUser();
  const { state, dispatch, folderId } = useAppState();
  const { toast } = useToast();
  const [folders, setFolders] = useState(workspaceFolders);
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder: Folders) => ({
            ...folder,
            files:
              state.workspace
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceId, workspaceFolders]);
  useEffect(() => {
    setFolders(
      state.workspace.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [state]);

  //   add folder
  const addFolderHandler = async () => {
    if (folders.length >= 3 && !subscription) {
      //   setOpen(true);
      return;
    }
    const newFolder: Folders = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: "Untitled",
      iconId: "📄",
      inTrash: null,
      workspaceId,
      bannerUrl: "",
    };

    dispatch({
      type: "ADD_FOLDER",
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    });
    const { data, error } = await createFolder(newFolder);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create the folder",
      });
    } else {
      toast({
        title: "Success",
        description: "Created folder successfully.",
      });
    }
  };
  return (
    <>
      <div
        className="flex sticky
        z-20
        top-0
        bg-background
        w-full 
        h-10
        group/title

        justify-between
        items-center
        pr-4
        text-Neutrals/neutrals-8"
      >
        <span
          className="text-Neutrals-8
        font-bold 
        text-xs"
        >
          FOLDERS
        </span>
        <TooltipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={17}
            className="group-hover/title:inline-block
            hidden 
            cursor-pointer
            hover:dark:text-white
          "
          />
        </TooltipComponent>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || ""]}
        className="pb-20"
      >
        {folders
          .filter((folder) => !folder.inTrash)
          .map((folder) => (
            <Dropdown
              key={folder.id}
              title={folder.title}
              listType="folder"
              id={folder.id}
              iconId={folder.iconId}
            />
          ))}
      </Accordion>
    </>
  );
};

export default FolderDropDown;
