import React from "react";
import styles from "./styles.module.css";
import CustomDialogTrigger from "../global/custom-dialogue-trigger";
import TrashRestore from "./trash-restore";

type Props = {
  children: React.ReactNode;
};

const Trash = ({ children }: Props) => {
  return (
    <>
      <CustomDialogTrigger header="Trash" content={<TrashRestore />}>
        {children}
      </CustomDialogTrigger>
    </>
  );
};

export default Trash;
