"use client";

import { Dispatch, createContext, useContext, useReducer } from "react";
import { Files, Folders, Workspace } from "../supabase/supabase.types";
import { usePathname } from "next/navigation";

export type appFoldersType = Folders & { files: Files[] | [] };
export type appWorkspaceType = Workspace & { folders: appFoldersType[] | [] };

interface AppState {
  workspace: appWorkspaceType[] | [];
}

type Action =
  | { type: "ADD_WORKSPACE"; payload: appWorkspaceType }
  | {
      type: "UPDATE_WORKSPACE";
      payload: { workspace: Partial<appWorkspaceType>; workspaceId: string };
    }
  | { type: "SET_WORKSPACE"; payload: appWorkspaceType[] | [] }
  | {
      type: "SET_FOLDERS";
      payload: { workspaceId: string; folders: [] | appFoldersType[] };
    }
  | {
      type: "ADD_FOLDER";
      payload: { workspaceId: string; folder: appFoldersType };
    };

const initialState: AppState = { workspace: [] };

const appReducer = (
  state: AppState = initialState,
  action: Action
): AppState => {
  switch (action.type) {
    case "ADD_WORKSPACE":
      return {
        ...state,
        workspace: [...state.workspace, action.payload],
      };
    case "SET_FOLDERS":
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              // folders:action.payload?.folders
              folders: action.payload.folders.sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              ),
            };
          }
          return workspace;
        }),
      };
    case "ADD_FOLDER":
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          return {
            ...workspace,
            folders: [...workspace.folders, action.payload.folder].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ),
          };
        }),
      };

    default:
      return initialState;
  }
};

type Props = {
  children: React.ReactNode;
};

const AppStateContext = createContext<
  | {
      state: AppState;
      workspaceId: string;
      folderId: string;
      fileId: string;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

const AppStateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const pathname = usePathname();
  const folderId = "";
  const fileId = "";
  const workspaceId = "";
  return (
    <AppStateContext.Provider
      value={{ state, dispatch, fileId, folderId, workspaceId }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
