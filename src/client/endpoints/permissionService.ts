import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export const Permission_KEY = "Permission";

const toggleLoader = (show: boolean) =>
  useGlobalLoader.getState().setShowLoader(show);

export type TPermissionPayload = {
  id?: number;
  name: string; // module name
  description?: string;
  active: boolean;
  updatedBy?: string;
  actions?: string; // JSON string for actions
};

// ===== Create Permission =====
export const createPermissionRequest = async (payload: TPermissionPayload) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/permissions/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Permissions =====
export const listPermissionRequest = async (params: {
  skip: number;
  size: number;
  search?: string;
  active?: boolean;
}) => {
  try {
    const response = await backendClient.get("/permissions/list", { params });
    const permissions =
      response.data?.data?.data?.map(
        (item: { id: number; name: string }) => item.name
      ) ?? [];

    return permissions;
  } catch (err) {
    console.error("listPermissionRequest error:", err);
    throw err;
  }
};

// ===== Get Permission by ID =====
export const getPermissionByIdRequest = async (id: number) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/permissions/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Permission =====
export const updatePermissionRequest = async (id: number, payload: TPermissionPayload) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/permissions/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Permissions (Multiple) =====
export const deletePermissionRequest = async (ids: number[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/permissions/delete", {
      data: { ids },
    });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
