import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export const BATCH_KEY = "Batch";

const toggleLoader = (show: boolean) => useGlobalLoader.getState().setShowLoader(show);

export type TBatch = {
  id?: string;
  batchName: string;
  startTime?: string;
  endTime?: string;
  maxStudents?: string;
  rooms?: string[]; 
};

// ===== Create Batch =====
export const createBatchRequest = async (payload: TBatch) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/batch/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Batches =====
export const listBatchRequest = async (params: { skip: number; size: number; search?: string; sort?: string; status?: string }) => {
  try {
    const response = await backendClient.get("/batch/list", { params });
    return response.data;
  } catch (err) {
    console.error("listBatchRequest error:", err);
    throw err;
  }
};

// ===== Get Batch by ID =====
export const getBatchRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/batch/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Batch =====
export const updateBatchRequest = async (id: string, payload: TBatch) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/batch/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Batches (Multiple) =====
export const deleteBatchRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/batch/delete", { data: { ids } });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
