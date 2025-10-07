import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";
import { TOffer } from "@/types";

export const OFFER_KEY = "offer";

const toggleLoader = (show: boolean) => useGlobalLoader.getState().setShowLoader(show);

// ===== Create Offer =====
export const createOfferRequest = async (payload: TOffer) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/offer/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Offers =====
export const listOfferRequest = async (params: { skip: number; size: number; search?: string; sort?: string; status?: string }) => {
  // toggleLoader(true); // temporarily comment out
  try {
    const response = await backendClient.get("/offer/list", { params });
    return response.data;
  } catch (err) {
    console.error("listOfferRequest error:", err);
    throw err;
  }
};

// ===== Get Offer by ID =====
export const getOfferRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/offer/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Offer =====
export const updateOfferRequest = async (id: string, payload: TOffer) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/offer/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Offers (Multiple) =====
export const deleteOfferRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/offer/delete", { data: { ids } });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
