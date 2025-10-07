import Swal, { SweetAlertOptions } from "sweetalert2";

export const MESSAGE_TYPE = {
  ERROR: "error",
  SUCCESS: "success",
} as const;

export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE]; 
// "error" | "success"

export const showMessage = (msg = "", type: MessageType = MESSAGE_TYPE.SUCCESS) => {
  const toast = Swal.mixin({
    toast: true,
    position: "top", // you can also use "top-end" for top-right
    showConfirmButton: false,
    timer: 3000, // shorter duration for normal messages
    customClass: { container: "toast" },
    didOpen: (el) => {
      el.style.zIndex = "9999";       // ensure above navbar
    },
  });

  toast.fire({
    icon: type,
    title: msg,
    padding: "10px 20px",
  });
};

export const showDeleteConfirmation = (options: SweetAlertOptions) => {
  return Swal.fire({
    title: "Warning!",
    showCancelButton: true,
    confirmButtonText: "Submit",
    ...options,
  });
};
