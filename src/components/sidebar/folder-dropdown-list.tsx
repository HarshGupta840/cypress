import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Folders } from "@/lib/supabase/supabase.types";
import { useToast } from "../ui/use-toast";
import { useAppState } from "@/lib/provider/state-provider";

type Props = {
  workspaceFolders: Folders[];
  workspaceId: string;
};

const FolderDropDown = ({ workspaceFolders, workspaceId }: Props) => {
  const { state, dispatch, folderId } = useAppState();
  const { toast } = useToast();
  const [folders, setFolders] = useState(workspaceFolders);
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      // dispatch({type:'SET_FOLDERS'})
    }
  });
  return <></>;
};

export default FolderDropDown;
