import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";
import { Installment } from "@/types";

const toggleLoader = (show: boolean) => useGlobalLoader.getState().setShowLoader(show);

export type TStudent = {
  id?: string; firstName: string;
  middleName?: string | null;
  lastName: string;
  fullName?: string | null; // optional if you generate it in backend

  profilePicture?: File | null;
  dob?: Date | null;
  gender?: string | null;

  phone: string;
  email: string;
  address?: string | null;
  nationality?: string | null;

  mobileOther?: string | null;
  emailOther?: string | null;

  guardianName?: string | null;
  guardianPhone?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;

  idProofType?: string | null;
  idProofNumber?: string | null;
  frontIdText?: string | null;
  backIdText?: string | null;
  frontIdFile?: File | null;
  backIdFile?: File | null;
  otherDocuments?: File[] | null;

  courses: {
    course: string | null;
    offer: string | null;
    batch: string | null;
    room: string | null;
    startDate: Date | null;
    endDate: Date | null;
  }[];
  payment?: {
    totalFees: number;
    installments: Installment[];
  };

  startDate?: Date | null;
  endDate?: Date | null;

};

// ===== Create Student =====
export const createStudentRequest = async (payload: FormData) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/student/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Students =====
export const listStudentRequest = async (params: { skip: number; size: number; search?: string; sort?: string; status?: string }) => {
  try {
    const response = await backendClient.get("/student/list", { params });
    return response.data;
  } catch (err) {
    console.error("listStudentRequest error:", err);
    throw err;
  }
};

// ===== Get Student by ID =====
export const getStudentByIdRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/student/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

export const getStudentDetailsByIdRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/student/get-all/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Student =====
export const updateStudentRequest = async (id: string, payload: TStudent) => {
  toggleLoader(true);
  try {
    const formData = new FormData();

    // Add primitive fields
    Object.keys(payload).forEach((key) => {
      const value = payload[key as keyof TStudent];
      if (
        value !== undefined &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof File)
      ) {
        formData.append(key, String(value));
      }
    });

    // Add files
    if (payload.profilePicture) formData.append("profilePicture", payload.profilePicture);
    if (payload.frontIdFile) formData.append("frontIdFile", payload.frontIdFile);
    if (payload.backIdFile) formData.append("backIdFile", payload.backIdFile);
    if (payload.otherDocuments) {
      payload.otherDocuments.forEach((file) => formData.append("otherDocuments", file));
    }

    // Add courses & payment as JSON string
    formData.append("courses", JSON.stringify(payload.courses ?? []));
    if (payload.payment) {
      formData.append("payment", JSON.stringify(payload.payment));
    }

    const response = await backendClient.put(`/student/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Students (Multiple) =====
export const deleteStudentRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/student/delete", { data: { ids } });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
