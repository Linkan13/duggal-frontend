import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { showMessage, MESSAGE_TYPE } from "@/utils";

export type TErrorFromServer = {
  success: boolean;
  message: string;
  data: unknown;
};

export const backendClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Use VITE_ prefix
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Authorization helper
export const setAuthToken = (token?: string) => {
  if (token) {
    backendClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") localStorage.setItem("token", token);
  } else {
    delete backendClient.defaults.headers.common["Authorization"];
    if (typeof window !== "undefined") localStorage.removeItem("token");
  }
};

// Load token from localStorage
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);
}

// Interceptors
const onRequest = (config: InternalAxiosRequestConfig) => config;

const onResponse = (response: AxiosResponse) => response;

const onResponseError = (error: AxiosError<TErrorFromServer>): Promise<never> => {
  const msg = error.response?.data?.message;
  if (msg && error.config?.method !== "get") {
    showMessage(msg, MESSAGE_TYPE.ERROR);
  }
  if (error.response?.status === 401 && typeof window !== "undefined") {
    window.location.href = "/";
  }
  return Promise.reject(error);
};

backendClient.interceptors.request.use(onRequest);
backendClient.interceptors.response.use(onResponse, onResponseError);
