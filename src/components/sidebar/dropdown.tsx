"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Emojipicker from "../global/emoji-picker";
import clsx from "clsx";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/provider/state-provider";
import { createFile, updateFile, updateFolder } from "@/lib/supabase/querries";
import TooltipComponent from "../global/tooltip-component";
import { PlusIcon, Trash } from "lucide-react";
import { v4 } from "uuid";
import { Files } from "@/lib/supabase/supabase.types";

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
      await updateFolder({ title }, fId[0]);
      toast({
        title: "Success",
        description: "Folder title changed.",
      });
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
      router.push(
        `/dashboard/${workspaceId}/${accordianId.split("folder")[0]}`
      );
    }
    if (list === "file") {
      router.push(
        `/dashboard/${workspaceId}/${accordianId.split("folder")[0]}/${
          accordianId.split("folder")[1]
        }`
      );
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
      console.log("updating the emojo");
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not update the emoji for this folder",
        });
      } else {
        console.log("updated");
        toast({
          title: "Success",
          description: "Update emoji for the folder",
        });
      }
    }
  };
  //list styles
  const isFolder = listType === "folder";
  const groupIdentifies = clsx(
    "dark:text-white whitespace-nowrap flex justify-between items-center w-full relative",
    {
      "group/folder": isFolder,
      "group/file": !isFolder,
    }
  );
  const listStyles = useMemo(
    () =>
      clsx("relative", {
        "border-none text-md": isFolder,
        "border-none ml-6 text-[16px] py-1": !isFolder,
      }),
    [isFolder]
  );
  const hoverStyles = useMemo(
    () =>
      clsx(
        "h-full hidden rounded-sm absolute right-0 items-center justify-center",
        {
          "group-hover/file:block": listType === "file",
          "group-hover/folder:block": listType === "folder",
        }
      ),
    [isFolder]
  );

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
  //to add the new file
  const addNewFile = async () => {
    if (!workspaceId) return;
    const newFile: Files = {
      folderId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: "Untitled",
      iconId: "📄",
      id: v4(),
      workspaceId,
      bannerUrl: "",
    };
    dispatch({
      type: "ADD_FILE",
      payload: { files: newFile, folderId: id, workspaceId },
    });
    const { data, error } = await createFile(newFile);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create a file",
      });
    } else {
      toast({
        title: "Success",
        description: "File created.",
      });
    }
  };
  //move to the trash
  const moveToTrash = async () => {
    if (!user?.email || !workspaceId) return;
    const pathId = id.split("folder");
    if (listType === "folder") {
      console.log(`delete the id is a ${id}`);
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { inTrash: `Deleted by ${user.email}` },
          folderId: pathId[0],
          workspaceId,
        },
      });
      const { data, error } = await updateFolder(
        { inTrash: `Deleted By the ${user.email}` },
        pathId[0]
      );
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not able to move to Trash",
        });
      } else {
        toast({
          title: "Success",
          description: "Moved To Trash.",
        });
      }
    }
    if (listType === "file") {
      dispatch({
        type: "UPDATE_FILES",
        payload: {
          files: { inTrash: `Deleted by ${user.email}` },
          folderId: pathId[0],
          workspaceId,
          fileId: pathId[1],
        },
      });
      const { data, error } = await updateFile(
        { inTrash: `Deleted By the ${user.email}` },
        pathId[1]
      );
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not able to move to Trash",
        });
      } else {
        toast({
          title: "Success",
          description: "Moved To Trash.",
        });
      }
    }
  };

  return (
    <>
      <AccordionItem
        value={id}
        className={listStyles}
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
          <div className={groupIdentifies}>
            <div
              className="flex
          gap-4
          items-center
          justify-center
          overflow-hidden"
            >
              <div className="relative">
                {/* getting the hydration error while using the emojipicker need to resolve that error */}
                <Emojipicker getValue={onChangeEmoji}>{iconId}</Emojipicker>
              </div>
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
                onBlur={handleBlur}
                onChange={
                  listType === "folder" ? folderTitleChange : fileTitleChange
                }
              />
            </div>
            <div className={hoverStyles}>
              <TooltipComponent message="Delete Folder">
                <Trash
                  onClick={moveToTrash}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
              {listType === "folder" && !isEditing && (
                <TooltipComponent message="Add File">
                  <PlusIcon
                    onClick={addNewFile}
                    size={15}
                    className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                  />
                </TooltipComponent>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {state.workspace
            .find((workspace) => workspace.id === workspaceId)
            ?.folders.find((folder) => folder.id === id)
            ?.files.filter((file) => !file.inTrash)
            .map((file) => {
              const customFileId = `${id}folder${file.id}`;
              return (
                <Dropdown
                  key={file.id}
                  title={file.title}
                  listType="file"
                  id={customFileId}
                  iconId={file.iconId}
                />
              );
            })}
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default Dropdown;
