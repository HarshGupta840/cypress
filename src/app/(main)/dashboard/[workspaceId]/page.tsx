import Editor from "@/components/quill-editor/quill-editor";
import { getWorkspaceDetails } from "@/lib/supabase/querries";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { workspaceId: string };
};

const Workspace = async ({ params }: Props) => {
  const { error, data } = await getWorkspaceDetails(params.workspaceId);
  if (error || !data.length) {
    redirect("/dashboard");
  }
  return (
    <>
      <div className="relative">
        <Editor
          fileId={params.workspaceId}
          dirType="workspace"
          dirDetails={data[0] || {}}
        />
      </div>
    </>
  );
};

export default Workspace;
