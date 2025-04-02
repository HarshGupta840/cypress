import React, { useMemo, useState } from "react";
import { AccordionItem, AccordionTrigger } from "../ui/accordion";
import Emojipicker from "../global/emoji-picker";
import clsx from "clsx";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/provider/state-provider";
import { updateFile, updateFolder } from "@/lib/supabase/querries";

type Props = {
  title: string;
  id: string;
  iconId: string;
  disabled?: boolean;
  children?: React.ReactNode;
  listType: "folder" | "file";
};

const Dropdown = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === "folder") {
      const stateTitle = state.workspace
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  const fileTitle: string | undefined = useMemo(() => {
    const fileAndFolderId = id.split("folder");
    const stateTitle = state.workspace
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.find((folder) => folder.id === fileAndFolderId[0])
      ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
    if (title === stateTitle || !stateTitle) return title;
    return stateTitle;
  }, [state, listType, workspaceId, id, title]);

  //double click handler
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  //blur
  const handleBlur = async () => {
    if (!isEditing) return;
    setIsEditing(false);
    const fId = id.split("folder");
    if (fId?.length === 1) {
      if (!folderTitle) return;
      toast({
        title: "Success",
        description: "Folder title changed.",
      });
      await updateFolder({ title }, fId[0]);
    }
    if (fId.length === 2 && fId[1]) {
      if (!fileTitle) return;
      const { data, error } = await updateFile({ title: fileTitle }, fId[1]);
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not update the title for this file",
        });
      } else
        toast({
          title: "Success",
          description: "File title changed.",
        });
    }
  };
  // Navigate the user to the different pages
  const navigatePage = async (accordianId: string, list: string) => {
    if (list === "folder") {
      router.push(`/dashboard/${workspaceId}/${accordianId}`);
    }
    if (list === "file") {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordianId}`);
    }
  };

  //on change
  //on changing the emojie
  const onChangeEmoji = async (selectEmoji: string) => {
    if (!workspaceId) return;
    if (listType === "folder") {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: { workspaceId, folderId: id, folder: { iconId: selectEmoji } },
      });
      const { data, error } = await updateFolder({ iconId: selectEmoji }, id);
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not update the emoji for this folder",
        });
      } else {
        toast({
          title: "Success",
          description: "Update emoji for the folder",
        });
      }
    }
  };
  //list styles
  const isFolder = listType === "folder";
  const groupIdentifiers = useMemo(() => {
    clsx(
      "dark:text-white whitespace-nowrap flex justify-between items-center w-full relative",
      {
        "group/folder": isFolder,
        "group/file": !isFolder,
      }
    );
  }, [isFolder]);
  const listStyles = useMemo(() => {
    clsx("relative", {
      "border-none text-md": isFolder,
      "border-none text-[16px] py-1 ml-6": !isFolder,
    });
  }, [isFolder]);

  // folder titile change
  const folderTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fid = id.split("folder");
    if (fid.length === 1) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { title: e.target.value },
          folderId: fid[0],
          workspaceId,
        },
      });
    }
  };
  const fileTitleChange = (e: any) => {
    if (!workspaceId || !folderId) return;
    const fid = id.split("folder");
    if (fid.length === 2 && fid[1]) {
      dispatch({
        type: "UPDATE_FILES",
        payload: {
          files: { title: e.target.value },
          folderId,
          workspaceId,
          fileId: fid[1],
        },
      });
    }
  };

  return (
    <>
      <AccordionItem
        value={id}
        className={listStyles!}
        onClick={(e) => {
          e.stopPropagation();
          navigatePage(id, listType);
        }}
      >
        <AccordionTrigger
          id={listType}
          className="hover:no-underline 
        p-2
        dark:text-muted-foreground 
        text-sm"
          disabled={listType === "file"}
        >
          <div className={groupIdentifiers!}>
            <div
              className="flex 
          gap-4 
          items-center 
          justify-center 
          overflow-hidden"
            >
              <div className="relative">
                <Emojipicker getValue={onChangeEmoji}>{iconId}</Emojipicker>
                <input
                  type="text"
                  value={listType === "folder" ? folderTitle : fileTitle}
                  className={clsx(
                    "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                    {
                      "bg-muted cursor-text": isEditing,
                      "bg-transparent cursor-pointer": !isEditing,
                    }
                  )}
                  readOnly={!isEditing}
                  onDoubleClick={handleDoubleClick}
                  //   onBlur={handleBlur}
                  onChange={
                    listType === "folder" ? folderTitleChange : fileTitleChange
                  }
                />
              </div>
            </div>
          </div>
        </AccordionTrigger>
      </AccordionItem>
    </>
  );
};

export default Dropdown;
