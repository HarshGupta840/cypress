"use server";
import {
  collaborators,
  files,
  folders,
  users,
  workspaces,
} from "./../../../mirgation/schema";
import { and, eq, ilike, notExists } from "drizzle-orm";
import db from "./db";
import {
  Files,
  Folders,
  Subscription,
  Users,
  Workspace,
} from "./supabase.types";
import { collaborator } from "./schema";
import { validate } from "uuid";
import { error } from "console";
import { revalidatePath } from "next/cache";

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

export const getFolder = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
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
      .where(eq(folders.workspaceId, workspaceId));
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};
export const createFolder = async (folder: Folders) => {
  try {
    const results = await db.insert(folders).values(folder);
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "Error" };
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

export const addCollaborators = async (users: Users[], workspaceId: string) => {
  const response = users.forEach(async (user) => {
    const userExist = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(eq(u.userId, user.id), eq(u.workspaceId, workspaceId))),
    });
    if (!userExist) {
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
    }
  });
};
export const removeCollaborators = async (
  users: Users[],
  workspaceId: string
) => {
  const response = users.forEach(async (user) => {
    const userExist = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(eq(u.userId, user.id), eq(u.workspaceId, workspaceId))),
    });
    if (userExist) {
      await db
        .delete(collaborators)
        .where(
          and(
            eq(collaborator.workspaceId, workspaceId),
            eq(collaborators.userId, user.id)
          )
        );
    }
  });
};
export const getUsersFromSearch = async (email: string) => {
  if (!email) return [];
  const accounts = db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));
  return accounts;
};
//commets
export const getFiles = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as Files[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const updateFolder = async (
  folder: Partial<Folders>,
  folderID: string
) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderID));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
export const getFolderDetails = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) {
    data: [];
    error: "Error";
  }

  try {
    const response = (await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1)) as Folders[];

    return { data: response, error: null };
  } catch (error) {
    return { data: [], error: "Error" };
  }
};
export const updateFile = async (file: Partial<Files>, fileId: string) => {
  try {
    const response = await db
      .update(files)
      .set(file)
      .where(eq(files.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
export const updateWorkspace = async (
  workspace: Partial<Workspace>,
  workspaceId: string
) => {
  if (!workspaceId) return;
  try {
    await db
      .update(workspaces)
      .set(workspace)
      .where(eq(workspaces.id, workspaceId));
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "Error" };
  }
};
export const createFile = async (file: Files) => {
  try {
    await db.insert(files).values(file);
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "Error" };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};
export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid)
    return {
      data: [],
      error: "Error",
    };

  try {
    const response = (await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1)) as Workspace[];
    return { data: response, error: null };
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" };
  }
};
export const getFileDetails = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) {
    data: [];
    error: "Error";
  }
  try {
    const response = (await db
      .select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1)) as Files[];
    return { data: response, error: null };
  } catch (error) {
    console.log("🔴Error", error);
    return { data: [], error: "Error" };
  }
};
export const deleteFile = async (fileId: string) => {
  if (!fileId) return;
  await db.delete(files).where(eq(files.id, fileId));
};

export const deleteFolder = async (folderId: string) => {
  if (!folderId) return;
  await db.delete(files).where(eq(files.id, folderId));
};
