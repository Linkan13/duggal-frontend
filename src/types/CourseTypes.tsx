import { TOffer } from "@/types"; 

export type TCourse = {
  id?: string;
  courseName: string;
  courseCode?: string;
  description?: string;
  offers?: TOffer[];
};

export type TCourseList = TCourse & { id: string };