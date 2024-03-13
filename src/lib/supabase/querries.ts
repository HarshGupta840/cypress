"use server";
import { folders, users, workspaces } from "./../../../mirgation/schema";
import { and, eq, notExists } from "drizzle-orm";
import db from "./db";
import { Folders, Subscription, Workspace } from "./supabase.types";
import { collaborator } from "./schema";
import { validate } from "uuid";
import { error } from "console";

export const createWorkspace = async (workspace: Workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};

export const getPrivateWorkspace = async (userId: string) => {
  if (!userId) return [];
  try {
    const privateWorkspace = (await db
      .select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl,
      })
      .from(workspaces)
      .where(
        and(
          notExists(
            db
              .select()
              .from(collaborator)
              .where(eq(workspaces.id, collaborator.workspaceId))
          ),
          eq(workspaces.workspaceOwner, userId)
        )
      )) as Workspace[];
    return privateWorkspace;
  } catch (error) {
    return [];
  }
};

export const getFolder = async (userId: string) => {
  const isValid = validate(userId);
  if (!isValid)
    return {
      data: null,
      error: "Error",
    };

  try {
    const result: Folders[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, userId));
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};
export const getCollaboratingWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const collaboratedWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborator, eq(users.id, collaborator.userId))
    .innerJoin(workspaces, eq(collaborator.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as Workspace[];
  return collaboratedWorkspaces;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const sharedWorkspace = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborator, eq(collaborator.workspaceId, workspaces.id))
    .where(eq(workspaces.workspaceOwner, userId))) as Workspace[];
  return sharedWorkspace;
};
