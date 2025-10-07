import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";
import { TRoom } from "@/types";

export const ROOM_KEY = "Room";

const toggleLoader = (show: boolean) => useGlobalLoader.getState().setShowLoader(show);

// ===== Create Room =====
export const createRoomRequest = async (payload: TRoom) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/room/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Rooms =====
export const listRoomRequest = async (params: { skip: number; size: number; search?: string; sort?: string; status?: string }) => {
  try {
    const response = await backendClient.get("/room/list", { params });
    return response.data;
  } catch (err) {
    console.error("listRoomRequest error:", err);
    throw err;
  }
};

// ===== Get Room by ID =====
export const getRoomRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/room/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Room =====
export const updateRoomRequest = async (id: string, payload: TRoom) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/room/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Rooms (Multiple) =====
export const deleteRoomRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/room/delete", { data: { ids } });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
