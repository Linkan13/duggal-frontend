import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export type TRegister = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export const REGISTER_KEY = "register";

export const registerRequest = async (payload: TRegister) => {
  useGlobalLoader.getState().setShowLoader(true);

  try {
    const response = await backendClient.post("/auth/signup", payload);
    return response.data; // return only the data
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  } finally {
    useGlobalLoader.getState().setShowLoader(false);
  }
};

export const registerAdminRequest = async (payload: TRegister) => {
  useGlobalLoader.getState().setShowLoader(true);

  try {
    const response = await backendClient.post("/auth/signup", payload);
    return response.data; // return only the data
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  } finally {
    useGlobalLoader.getState().setShowLoader(false);
  }
};
