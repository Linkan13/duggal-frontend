import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export const Staff_KEY = "Staff";

const toggleLoader = (show: boolean) =>
  useGlobalLoader.getState().setShowLoader(show);

export type TStaff = {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
  status?: string;
};

// ===== Create Staff =====
export const createStaffRequest = async (payload: TStaff) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/staff/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Staff =====
export const listStaffRequest = async (params: {
  skip: number; size: number; search?: string; sort?: string; status?: string
}) => {
  try {
    const response = await backendClient.get("/staff/list", { params });
    return response.data;
  } catch (err) {
    console.error("listStaffRequest error:", err);
    throw err;
  }
};

export const staffSignupRequest = async (ids: string[]) => {
  try {
    const response = await backendClient.post("/staff/signup", { ids });
    return response.data;
  } catch (err) {
    console.error("staffSignupRequest error:", err);
    throw err;
  }
};

// ===== Get Staff by ID =====
export const getStaffRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/staff/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Staff =====
export const updateStaffRequest = async (id: string, payload: TStaff) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/staff/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Staff (Multiple) =====
export const deleteStaffRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/staff/delete", {
      data: { ids },
    });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
