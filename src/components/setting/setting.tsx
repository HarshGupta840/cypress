import React from "react";
import styles from "./styles.module.css";
import CustomDialogTrigger from "../global/custom-dialogue-trigger";
import Settingforms from "./Setting-forms";

type Props = {
  children: React.ReactNode;
};

const Settings = ({ children }: Props) => {
  return (
    <>
      <CustomDialogTrigger header="Settings" content={<Settingforms />}>
        {children}
      </CustomDialogTrigger>
    </>
  );
};

export default Settings;
