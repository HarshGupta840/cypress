import React from "react";
import styles from "./styles.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import clsx from "clsx";
import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
  header: string;
  content: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
};

const CustomDialogTrigger = ({
  header,
  content,
  children,
  description,
  className,
}: Props) => {
  return (
    <>
      <Dialog>
        <DialogTrigger className={clsx("", className)}>
          {children}
        </DialogTrigger>
        <DialogContent
          className="h-screen
        block
        sm:h-[440px]
        overflow-auto
        w-full
      "
        >
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <DialogHeader>{content}</DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomDialogTrigger;
