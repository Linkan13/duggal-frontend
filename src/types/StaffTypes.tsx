// types/Staff.types.ts

// A single Staff record in DB
export interface TStaff {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Payload for creating a new Staff
export interface TPayloadStaff {
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string; // usually first + last
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
}

// Payload for updating an existing Staff
export interface TUpdateStaff {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
}

// Staff list response (useful for APIs with pagination)
export interface TStaffList {
  total: number;
  data: TStaff[];
}
