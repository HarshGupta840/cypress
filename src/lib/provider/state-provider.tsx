"use client";

import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Files, Folders, Workspace } from "../supabase/supabase.types";
import { usePathname } from "next/navigation";
import { getFiles } from "../supabase/querries";

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
  | { type: "SET_WORKSPACE"; payload: { workspaces: appWorkspaceType[] | [] } }
  | {
      type: "SET_FOLDERS";
      payload: { workspaceId: string; folders: [] | appFoldersType[] };
    }
  | {
      type: "ADD_FOLDER";
      payload: { workspaceId: string; folder: appFoldersType };
    }
  | {
      type: "UPDATE_FOLDER";
      payload: {
        workspaceId: string;
        folderId: string;
        folder: Partial<appFoldersType>;
      };
    }
  | {
      type: "SET_FILES";
      payload: { workspaceId: string; files: Files[]; folderId: string };
    }
  | {
      type: "UPDATE_FILES";
      payload: {
        workspaceId: string;
        files: Partial<Files>;
        folderId: string;
        fileId: string;
      };
    }
  | {
      type: "ADD_FILE";
      payload: { workspaceId: string; files: Files; folderId: string };
    }
  | {
      type: "DELETE_WORKSPACE";
      payload: string;
    }
  | {
      type: "DELETE_FILE";
      payload: { workspaceId: string; folderId: string; fileId: string };
    }
  | {
      type: "DELETE_FOLDER";
      payload: { workspaceId: string; folderId: string };
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
    case "SET_WORKSPACE":
      return {
        ...state,
        workspace: action.payload.workspaces,
      };
    case "UPDATE_WORKSPACE":
      console.log("workspace isupdated");
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              ...action.payload.workspace,
            };
          }
          console.log("folder is updated from the state providor");
          return workspace;
        }),
      };
    case "SET_FILES":
      console.log("files are setting as ", action.payload);
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: action.payload.files,
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "ADD_FILE":
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: [...folder.files, action.payload.files].sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    ),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "UPDATE_FOLDER":
      console.log("folder is updted");
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return { ...folder, ...action.payload.folder };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "UPDATE_FILES":
      console.log("file is updaed");
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.map((file) => {
                      if (file.id === action.payload.fileId) {
                        return {
                          ...file,
                          ...action.payload.files,
                        };
                      }
                      return file;
                    }),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "DELETE_WORKSPACE":
      return {
        ...state,
        workspace: state.workspace.filter(
          (workspace) => workspace.id !== action.payload
        ),
      };
    case "DELETE_FILE":
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.filter(
                (folder) => folder.id !== action.payload.folderId
              ),
            };
          }
          return workspace;
        }),
      };
    case "DELETE_FILE":
      return {
        ...state,
        workspace: state.workspace.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folder: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.filter(
                      (file) => file.id !== action.payload.fileId
                    ),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
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
      workspaceId: string | undefined;
      folderId: string | undefined;
      fileId: string | undefined;
      dispatch: Dispatch<Action>;
    }
  | undefined
>(undefined);

const AppStateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const pathname = usePathname();
  const workspaceId = useMemo(() => {
    const urlSegment = pathname.split("/").filter(Boolean);
    if (urlSegment) {
      if (urlSegment.length > 1) {
        return urlSegment[1];
      }
    }
  }, [pathname]);
  const folderId = useMemo(() => {
    const urlSegment = pathname.split("/").filter(Boolean);
    if (urlSegment) {
      if (urlSegment.length > 2) {
        return urlSegment[2];
      }
    }
  }, [pathname]);
  const fileId = useMemo(() => {
    const urlSegment = pathname.split("/").filter(Boolean);
    if (urlSegment) {
      if (urlSegment.length > 3) {
        return urlSegment[3];
      }
    }
  }, [pathname]);
  useEffect(() => {
    if (!folderId || !workspaceId) return;
    console.log("useeffect for the set file is caled");
    const fetchFile = async () => {
      const { error: filesError, data } = await getFiles(folderId);
      if (filesError) {
        console.log(filesError);
      }
      if (!data) return;
      dispatch({
        type: "SET_FILES",
        payload: { workspaceId, files: data, folderId },
      });
    };
    fetchFile();
  }, [folderId, workspaceId]);
  useEffect(() => {
    console.log("App State Changed", state);
  }, [state]);
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
