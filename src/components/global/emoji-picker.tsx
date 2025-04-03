"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import dynamic from "next/dynamic";

type Props = {
  children: React.ReactNode;
  getValue: (emoji: string) => void;
};

const Emojipicker = ({ children, getValue }: Props) => {
  const route = useRouter();
  const Picker = dynamic(() => import("emoji-picker-react"));
  const onClick = (selectedEmoji: any) => {
    if (getValue) getValue(selectedEmoji.emoji);
  };
  return (
    <>
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
          <PopoverContent
            className="p-0
          border-none
        "
          >
            <Picker onEmojiClick={onClick} />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default Emojipicker;
