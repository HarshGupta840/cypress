import Editor from "@/components/quill-editor/quill-editor";
import { getFileDetails, getFolderDetails } from "@/lib/supabase/querries";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { folderId: string };
};

const Folder = async ({ params }: Props) => {
  const { error, data } = await getFolderDetails(params.folderId);
  if (error || !data.length) {
    // redirect("/dashboard");
  }
  return (
    <>
      <div className="relative">
        <Editor
          fileId={params.folderId}
          dirType="folder"
          dirDetails={data[0] || {}}
        />
      </div>
    </>
  );
};

export default Folder;
