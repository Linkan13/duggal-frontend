
// Lead status options
export type TLeadStatus = "new" | "in_progress" | "converted" | "lost";

// A single Lead record stored in DB
export type TLead = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
  status: TLeadStatus;

  interestedCourseId?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

// Payload for creating/updating a lead
export type TPayloadLead = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  interestedCourseId?: string;
  notes?: string;
  status?: TLeadStatus; // optional for creation
};

// Lead list response (useful for pagination APIs)
export type TLeadList = {
  total: number;
  data: TLead[];
};

// Optionally: extend pagination & filtering in future
export type TLeadQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TLeadStatus;
};
