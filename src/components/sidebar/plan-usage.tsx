"use client";
import React, { useEffect, useState } from "react";
import { Subscription } from "@/lib/supabase/supabase.types";
import { useAppState } from "@/lib/provider/state-provider";
import { MAX_FOLDERS_FREE_PLAN } from "@/lib/constant";
import { Progress } from "../ui/progress";
import DiamondIcon from "../icons/diamond";

type Props = {
  foldersLength: number;
  subscription: Subscription | null;
};

const PlanUsage = ({ foldersLength, subscription }: Props) => {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  );
  useEffect(() => {
    const stateFolderLenght = state.workspace.find((w) => w.id === workspaceId)
      ?.folders.length;
    if (stateFolderLenght === undefined) return;
    setUsagePercentage((stateFolderLenght / MAX_FOLDERS_FREE_PLAN) * 100);
  }, [state, workspaceId]);

  return (
    <>
      <article className="mb-4">
        {subscription?.status !== "active" && (
          <div
            className="flex 
          gap-2
          text-muted-foreground
          mb-2
          items-center
        "
          >
            <div className="h-4 w-4">
              <DiamondIcon />
            </div>
            <div
              className="flex 
        justify-between 
        w-full 
        items-center
        "
            >
              <div>Free Plan</div>
              <small>{usagePercentage.toFixed(0)}% / 100%</small>
            </div>
          </div>
        )}
        {subscription?.status !== "active" && (
          <Progress value={usagePercentage} className="h-1" />
        )}
      </article>
    </>
  );
};

export default PlanUsage;
