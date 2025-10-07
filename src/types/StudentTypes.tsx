export type Installment = {
  id: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paymentDate?: string;
  paymentMethod?: "cash" | "online";
  comment?: string;
};

export interface TStudentEnrollment {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  fullName?: string | null;
  profilePicture?: string | null;
  dob?: string | null;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  nationality?: string | null;

  guardianName?: string | null;
  guardianPhone?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;

  idProofType?: string | null;
  idProofNumber?: string | null;
  frontIdFile?: string | null;
  backIdFile?: string | null;

  joinedDate: string;

  courses: {
    course: {
      id: string;
      courseName: string;
      courseCode: string;
      description?: string;
    } | null;
    offer: {
      id: string;
      offerName: string;
      courseDays: number;
      amount: string;
      discount: string;
      additionalInfo?: string;
      featured: number;
    } | null;
    batch: {
      id: string;
      batchName: string;
      startTime: string;
      endTime: string;
      maxStudents: number;
    } | null;
    room: {
      id: string;
      roomName: string;
      roomCode: string;
      capacity: number;
      location: string;
      description?: string;
    } | null;
    startDate?: string | null;
    endDate?: string | null;
  }[];

  payment: {
    id: string;
    studentId: string;
    totalAmount: string;
    totalFees: number;
    installments: {
      id: string;
      paymentId: string;
      amount: string;
      dueDate: string;
      paid: boolean | number;
      paymentDate?: string | null;
      paymentMethod?: string | null;
      comment?: string | null;
    }[];
  } | null;
}

export type TStudent = {
  firstName: string;
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
  joinedDate?: Date | null;
};
