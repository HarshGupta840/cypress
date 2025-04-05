import React from "react";
import styles from "./styles.module.css";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import HomeIcon from "../icons/homeicon";
import SettingsIcon from "../icons/settingicons";
import TrashIcon from "../icons/trashicon";
import Settings from "../setting/setting";

type Props = {
  myWorkspaceId: string;
  className?: string;
};

const NativeNavigation = ({ myWorkspaceId, className }: Props) => {
  return (
    <>
      <nav className={twMerge("my-2", className)}>
        <ul className="flex flex-col gap-4">
          <li className="">
            <Link
              className="group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
          "
              href={`/dashboard/${myWorkspaceId}`}
            >
              <HomeIcon />
              <span>My Workspace</span>
            </Link>
          </li>
          <Settings>
            <li
              className="group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
            cursor-pointer
          "
            >
              <SettingsIcon />
              <span>Settings</span>
            </li>
          </Settings>
          <li
            className="group/native
            flex
            text-Neutrals/neutrals-7
            transition-all
            gap-2
          "
          >
            <TrashIcon />
            <span>Trash</span>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NativeNavigation;
