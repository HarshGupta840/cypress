"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Workspace } from "@/lib/supabase/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { date } from "drizzle-orm/mysql-core";
import Link from "next/link";
import Image from "next/image";

type Props = {
  workspace: Workspace;
  onclick?: (option: Workspace) => void;
};

const SelectWorkspace = ({ workspace, onclick }: Props) => {
  const supabase = createClientComponentClient();
  const [workSpaceLogo, setWorkSpaceLogo] = useState("/cypresslogo.svg");
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage.from("cypress").getPublicUrl(workspace.logo)
        ?.data.publicUrl;
      setWorkSpaceLogo(path);
    }
  }, [workspace]);
  return (
    <>
      <Link
        href={`/dashboard/${workspace.id}`}
        onClick={() => {
          if (onclick) onclick(workspace);
        }}
        className="flex
      rounded-md
      hover:bg-muted
      transition-all
      flex-row
      p-2
      gap-4
      justify-center
      cursor-pointer
      items-center
      my-2"
      >
        <Image
          src={workSpaceLogo}
          alt="workspace logo"
          width={26}
          height={26}
          objectFit="cover"
        />{" "}
        <div className="flex flex-col">
          <p
            className="text-lg
        w-[170px]
        overflow-hidden
        overflow-ellipsis
        whitespace-nowrap"
          >
            {workspace.title}
          </p>
        </div>
      </Link>
    </>
  );
};

export default SelectWorkspace;
