// utils/showToast.ts
import { toast, ToastOptions, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 6000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const showToast = (
  message: string,
  type: TypeOptions = "default",
  options?: ToastOptions
) => {
  toast(message, { ...defaultOptions, type, ...options });
};
