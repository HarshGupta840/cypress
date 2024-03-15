"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Workspace } from "@/lib/supabase/supabase.types";
import SelectWorkspace from "./selected-workspace";
import CustomDialogTrigger from "../global/custom-dialogue-trigger";
import WorkspaceCreator from "../global/wokspace-creator";

type Props = {
  privateWorkspace: Workspace[] | [];
  sharedWorkspace: Workspace[] | [];
  collaboratingWokspace: Workspace[] | [];
  defaultValue: Workspace | undefined;
};

const WorkspaceDropdown = ({
  privateWorkspace,
  sharedWorkspace,
  collaboratingWokspace,
  defaultValue,
}: Props) => {
  const [isopen, setisOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  useEffect(() => {}, [
    privateWorkspace,
    sharedWorkspace,
    collaboratingWokspace,
  ]);
  const handleSelect = (option: Workspace) => {
    setSelectedOption(option);
    setisOpen(false);
  };

  return (
    <>
      <div className="relative inline-block text-left w-full">
        <div>
          <span onClick={() => setisOpen(!isopen)}>
            {selectedOption ? (
              <SelectWorkspace workspace={selectedOption} />
            ) : (
              "Select a workspace"
            )}
          </span>
        </div>
        {isopen && (
          <div
            className="absolute origin-top-right 
            w-full
            rounded-md
            shadow-md
            z-50
            h-[220px]
            bg-black/10
            backdrop-blur-lg
            group
            overflow-y-auto
            overflow-x-hidden
            border-[1px]
            border-muted"
          >
            <div className="flex flex-col">
              <div className="p-2">
                {privateWorkspace.length && (
                  <>
                    <p className="text-muted-foreground">Private</p>
                    <hr />
                    {privateWorkspace.map((option) => (
                      <SelectWorkspace
                        key={option.id}
                        workspace={option}
                        onclick={handleSelect}
                      />
                    ))}
                  </>
                )}
                {!!sharedWorkspace.length && (
                  <>
                    <p className="text-muted-foreground">Shared</p>
                    <hr />
                    {sharedWorkspace.map((option) => (
                      <SelectWorkspace
                        key={option.id}
                        workspace={option}
                        onclick={handleSelect}
                      />
                    ))}
                  </>
                )}
                {!!collaboratingWokspace.length && (
                  <>
                    <p className="text-muted-foreground">Collaborating</p>
                    <hr />
                    {collaboratingWokspace.map((option) => (
                      <SelectWorkspace
                        key={option.id}
                        workspace={option}
                        onclick={handleSelect}
                      />
                    ))}
                  </>
                )}
              </div>
              <CustomDialogTrigger
                header="Create A Workspace"
                content={<WorkspaceCreator />}
                description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
              >
                {" "}
                <div
                  className="flex
            transition-all
            hover:bg-muted
            justify-center
            items-center
            gap-2
            p-2
            w-full"
                >
                  <article
                    className="text-slate-500
              rounded-full
               bg-slate-800 
               w-4 
               h-4 
               flex 
               items-center 
               justify-center"
                  >
                    +
                  </article>
                  Create workspace
                </div>
              </CustomDialogTrigger>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkspaceDropdown;
