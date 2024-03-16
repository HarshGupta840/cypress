"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useSupabaseUser } from "@/lib/provider/supabase-user-provider";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Users } from "@/lib/supabase/supabase.types";
import { getUsersFromSearch } from "@/lib/supabase/querries";

type Props = {
  existingCollaborators: Users[] | [];
  getCollaborator: (collaborator: Users) => void;
  children: React.ReactNode;
};

const CollaboratorSearch = ({
  existingCollaborators,
  getCollaborator,
  children,
}: Props) => {
  const { user } = useSupabaseUser();
  const [searchResults, setSearchResults] = useState<Users[] | []>([]);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await getUsersFromSearch(e.target.value);
      setSearchResults(res);
    }, 450);
  };
  const addCollaborator = (user: Users) => {
    getCollaborator(user);
  };
  return (
    <>
      <Sheet>
        <SheetTrigger className="w-full">{children}</SheetTrigger>{" "}
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Search Collaborator</SheetTitle>
            <SheetDescription>
              <p className="text-sm text-muted-foreground">
                You can also remove collaborators after adding them from the
                settings tab.
              </p>
            </SheetDescription>
            <div
              className="flex justify-center
          items-center
          gap-2
          mt-2
        "
            >
              <Search />
              <Input
                name="name"
                className="dark:bg-background"
                placeholder="Email"
                onChange={onChangeHandler}
              />
            </div>
          </SheetHeader>
          <ScrollArea
            className="mt-6
        overflow-y-auto
        w-full
        rounded-md
      "
          >
            {searchResults
              .filter(
                (result) =>
                  !existingCollaborators.some(
                    (existing) => existing.id === result?.id
                  )
              )
              .filter((result) => result.id != user?.id)
              .map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4"
                >
                  <div className="flex gap-4 items-center">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/avatars/7.png" />
                      <AvatarFallback>CP</AvatarFallback>
                    </Avatar>
                    <div
                      className="text-sm 
                  gap-2 
                  overflow-hidden 
                  overflow-ellipsis 
                  w-[180px] 
                  text-muted-foreground
                  "
                    >
                      {user.email}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => addCollaborator(user)}
                  >
                    Add
                  </Button>
                </div>
              ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CollaboratorSearch;
