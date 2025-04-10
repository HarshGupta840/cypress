import Editor from "@/components/quill-editor/quill-editor";
import { getFileDetails, getFolderDetails } from "@/lib/supabase/querries";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { fileId: string };
};

const File = async ({ params }: Props) => {
  const { error, data } = await getFileDetails(params.fileId);
  if (error || !data.length) {
    // redirect("/dashboard");
  }
  return (
    <>
      <div className="relative">
        <Editor
          fileId={params.fileId}
          dirType="file"
          dirDetails={data[0] || {}}
        />
      </div>
    </>
  );
};

export default File;
