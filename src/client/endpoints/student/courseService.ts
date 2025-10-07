import { backendClient } from "@/client/backendClient";
import { useGlobalLoader } from "@/hooks";

export const Course_KEY = "Course";

const toggleLoader = (show: boolean) => useGlobalLoader.getState().setShowLoader(show);

export type TCourse = {
  id?: string;
  courseName: string;
  courseCode?: string;
  description?: string;
  offers?: string[];
};

// ===== Create Course =====
export const createCourseRequest = async (payload: TCourse) => {
  toggleLoader(true);
  try {
    const response = await backendClient.post("/course/create", payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== List Courses =====
export const listCourseRequest = async (params: { skip: number; size: number; search?: string; sort?: string; status?: string }) => {
  try {
    const response = await backendClient.get("/course/list", { params });
    return response.data;
  } catch (err) {
    console.error("listCourseRequest error:", err);
    throw err;
  }
};

// ===== Get Course by ID =====
export const getCourseRequest = async (id: string) => {
  toggleLoader(true);
  try {
    const response = await backendClient.get(`/course/get/${id}`);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Update Course =====
export const updateCourseRequest = async (id: string, payload: TCourse) => {
  toggleLoader(true);
  try {
    const response = await backendClient.put(`/course/update/${id}`, payload);
    return response.data;
  } finally {
    toggleLoader(false);
  }
};

// ===== Delete Courses (Multiple) =====
export const deleteCourseRequest = async (ids: string[]) => {
  toggleLoader(true);
  try {
    const response = await backendClient.delete("/course/delete", { data: { ids } });
    return response.data;
  } finally {
    toggleLoader(false);
  }
};
