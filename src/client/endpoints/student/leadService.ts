import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export const Lead_KEY = "Lead";

const toggleLoader = (show: boolean) => useGlobalLoader.getState().setShowLoader(show);

export type TLead = {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  interestedCourseId?: null;
  notes?: string;
  status?: "new" | "in_progress" | "converted" | "lost";
};

// ===== Create Lead =====
export const createLeadRequest = async (payload: TLead) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/lead/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

export const convertLeadToStudentRequest = async (leadIds: string[]) => {
  return await fetch("/api/leads/convert-to-student", {
    method: "POST",
    body: JSON.stringify({ ids: leadIds }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
};

// ===== List Leads =====
export const listLeadRequest = async (params: { skip: number; size: number; search?: string; sort?: string; status?: string }) => {
  try {
    const response = await backendClient.get("/lead/list", { params });
    return response.data;
  } catch (err) {
    console.error("listLeadRequest error:", err);
    throw err;
  }
};

// ===== Get Lead by ID =====
export const getLeadRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/lead/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Lead =====
export const updateLeadRequest = async (id: string, payload: TLead) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/lead/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Leads (Multiple) =====
export const deleteLeadRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/lead/delete", { data: { ids } });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
