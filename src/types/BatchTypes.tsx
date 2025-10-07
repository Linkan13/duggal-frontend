import { TRoom } from "@/types"; 

export interface BatchData {
  batchName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  modeOfLearning: string;
  instructor: string;
  maxStudents: string;
  room: string;
}

export type TBatch = {
  id?: string;
  batchName: string;
  startTime?: string;
  endTime?: string;
  maxStudents?: string;
  rooms?: TRoom[];
};

export type TBatchList = TBatch & { id: string };
