import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export type TLogin = {
  email: string;
  password: string;
};

export const LOGIN_KEY = "login";

export const loginRequest = async (payload: TLogin) => {
  useGlobalLoader.getState().setShowLoader(true);
  try {
    const response = await backendClient.post("/auth/login", payload);
    return response.data; // only return the data if needed
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  } finally {
    useGlobalLoader.getState().setShowLoader(false);
  }
};
