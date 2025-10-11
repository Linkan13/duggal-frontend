import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export const Role_KEY = "Role";

const toggleLoader = (show: boolean) =>
  useGlobalLoader.getState().setShowLoader(show);

export type TRole = {
  id?: string;
  name: string;
  role_permissions: string; // stored as JSON string
  description?: string;
  active: boolean;
  updatedBy?: string;
};

// ===== Create Role =====
export const createRoleRequest = async (payload: TRole) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/roles/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Roles =====
export const listRoleRequest = async (params: {
  skip: number;
  size: number;
  search?: string;
  sort?: string;
  active?: boolean;
}) => {
  try {
    const response = await backendClient.get("/roles/list", { params });
    return response.data;
  } catch (err) {
    console.error("listRoleRequest error:", err);
    throw err;
  }
};

// ===== Get Role by ID =====
export const getRoleByIdRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/roles/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Role =====
export const updateRoleRequest = async (id: string, payload: TRole) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/roles/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Roles (Multiple) =====
export const deleteRoleRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/roles/delete", {
      data: { ids },
    });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
