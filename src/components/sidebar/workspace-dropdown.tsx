import React, { useState } from "react";
import styles from "./styles.module.css";
import { Workspace } from "@/lib/supabase/supabase.types";

type Props = {
  privateWorkspace: Workspace[] | [];
  sharedWorkspace: Workspace[] | [];
  collaboratingWokspace: Workspace[] | [];
  defaultValue: Workspace[] | undefined;
};

const WorkspaceDropdown = ({
  privateWorkspace,
  sharedWorkspace,
  collaboratingWokspace,
  defaultValue,
}: Props) => {
  const [open, isOpen] = useState(false);
  const [selectedOption, setSelectedOption];
  return <></>;
};

export default WorkspaceDropdown;
