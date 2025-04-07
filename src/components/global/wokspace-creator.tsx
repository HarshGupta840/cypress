import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Plus, Share } from "lucide-react";
import { Button } from "../ui/button";
import CollaboratorSearch from "./collaborator-search";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { v4 } from "uuid";
import { Users, Workspace } from "@/lib/supabase/supabase.types";
import { addCollaborators, createWorkspace } from "@/lib/supabase/querries";
type Props = {};

const WorkspaceCreator = ({}: Props) => {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [collaborator, setCollaborator] = useState<Users[]>([]);
  const addCollaborator = (user: Users) => {
    setCollaborator([...collaborator, user]);
  };
  const removeCollaborator = (user: Users) => {
    setCollaborator(collaborator.filter((c) => c.id !== user.id));
  };
  const createItem = async () => {
    setIsLoading(true);
    const uuid = v4();
    if (user?.id) {
      const newWorkspace: Workspace = {
        data: "",
        createdAt: new Date().toISOString(),
        iconId: "💼",
        id: uuid,
        inTrash: "",
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: "",
      };

      if (permissions === "private") {
        await createWorkspace(newWorkspace);
        toast({
          title: "Success",
          description: "Created the private workspace",
        });
        router.refresh();
      }
      if (permissions === "shared") {
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborator, uuid);
        toast({
          title: "Success",
          description: "Created the shared workspace",
        });
        router.refresh();
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col mt-3 gap-2">
          <Label htmlFor="name" className="text-sm text-muted-foreground">
            Name
          </Label>
          <div
            className="flex 
        justify-center 
        items-center 
        gap-2
        "
          >
            <Input
              name="name"
              value={title}
              placeholder="Workspace Name"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <Label
        htmlFor="permissions"
        className="text-sm
          text-muted-foreground"
      >
        Permission
      </Label>
      <Select
        onValueChange={(val) => setPermissions(val)}
        defaultValue={permissions}
      >
        <SelectTrigger className="w-full h-26 -mt-3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup></SelectGroup>{" "}
          <SelectItem value="private">
            <div
              className="p-2
                  flex
                  gap-4
                  justify-center
                  items-center
                "
            >
              <Lock />
              <article className="text-left flex flex-col">
                <span>Private</span>
                <p>
                  Your workspace is private to you. You can choose to share it
                  later.
                </p>
              </article>
            </div>
          </SelectItem>
          <SelectItem value="shared">
            <div className="p-2 flex gap-4 justify-center items-center">
              <Share />
              <article className="text-left flex flex-col">
                <span>Shared</span>
                <span>You can invite collaborators.</span>
              </article>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {permissions === "shared" && (
        <div>
          <CollaboratorSearch
            existingCollaborators={collaborator}
            getCollaborator={(user) => addCollaborator(user)}
          >
            <Button type="button" className="text-sm mt-4">
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              Collaborators {collaborator.length || ""}
            </span>
            <ScrollArea
              className="
            h-[120px]
            overflow-y-scroll
            w-full
            rounded-md
            border
            border-muted-foreground/20"
            >
              {collaborator.length ? (
                collaborator.map((c, i) => (
                  <div
                    className="p-4 flex justify-center items-center"
                    key={c.id}
                  >
                    <div className="gap-4 flex justify-center items-center">
                      <Avatar>
                        <AvatarImage src="/avatars/7.png" />
                        <AvatarFallback>PJ</AvatarFallback>
                      </Avatar>
                      <div
                        className="text-sm 
                          gap-2
                          text-muted-foreground
                          overflow-hidden
                          overflow-ellipsis
                          sm:w-[300px]
                          w-[140px]
                        "
                      >
                        {c.email}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => removeCollaborator(c)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                  <span className="text-muted-foreground text-sm">
                    You have no collaborators
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
      <Button
        type="button"
        variant={"secondary"}
        className="mt-8"
        disabled={
          !title ||
          (permissions === "shared" && collaborator.length === 0) ||
          isLoading
        }
        onClick={createItem}
      >
        Create
      </Button>
    </>
  );
};

export default WorkspaceCreator;
