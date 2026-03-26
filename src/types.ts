export type UserRole = 'Super Admin' | 'Management' | 'Teacher' | 'Student' | 'Parent' | 'Security' | 'Reception' | 'Store' | 'Electrician' | 'Accounts' | 'Attender' | 'Librarian';

export type RoleType = 'academic' | 'non-academic';

export interface User {
  user_id: string;
  name: string;
  role: UserRole;
  role_type: RoleType;
  email: string;
  phone: string;
  linked_id: string; // student_id / teacher_id / staff_id
  photo?: string;
}

export interface Alert {
  id: string;
  type: 'Security' | 'Medical' | 'Fire' | 'General' | 'Emergency' | 'Incident';
  message: string;
  timestamp: string;
  sender: string;
  senderId?: string;
  status: 'Active' | 'Resolved';
  scope?: string;
}

export interface LeaveRequest {
  id: string;
  student_id: string;
  userId?: string;
  studentName: string;
  userName?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

export interface BusRoute {
  id: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  capacity: number;
  studentsCount: number;
  stops: { name: string; time: string }[];
  status: 'On Time' | 'Delayed' | 'Maintenance';
}

export interface Subject {
  id: string;
  name: string;
  class: string;
  teacherId: string;
}

export interface FeePayment {
  id: string;
  amount: number;
  date: string;
  method: string;
  receiptNo: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  lastRestocked?: string;
}

export interface SalaryRecord {
  id: string;
  month: string;
  year: number;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
  paidAt: string;
}

export interface StudentSummary {
  attendance_percentage: number;
  latest_grade: string;
  fee_status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Student {
  student_id: string;
  name: string;
  class_id: string;
  class: string; // Added for compatibility
  section: string;
  parent_id: string;
  subjects: string[];
  summary: StudentSummary;
  email: string;
  photo?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  assignedBusId?: string;
  guardian?: {
    name: string;
    phone: string;
    email: string;
    relation: string;
    address: string;
    photo?: string;
  };
  fees: {
    total: number;
    paid: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    history: FeePayment[];
  };
}

export interface Parent {
  parent_id: string;
  name: string;
  linked_students: string[]; // array of student_ids
  email: string;
  phone?: string;
}

export interface Teacher {
  teacher_id: string;
  name: string;
  assigned_classes: string[]; // e.g. ["10-A", "10-B"]
  subjects: string[];
  email: string;
  photo?: string;
  phone?: string;
  salary: {
    basic: number;
    allowances: number;
    history: SalaryRecord[];
  };
}

export interface Staff {
  staff_id: string;
  name: string;
  role: UserRole;
  module_access: string[];
  email: string;
}

// Logs and other records
export interface GateLog {
  id: string;
  user_id: string;
  type: 'In' | 'Out';
  timestamp: string;
  notes?: string;
}

export interface AttendanceLog {
  id: string;
  user_id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  timestamp: string;
}

export interface InquiryLog {
  id: string;
  visitor_name: string;
  purpose: string;
  timestamp: string;
  handled_by: string; // user_id
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface MaintenanceLog {
  id: string;
  issue: string;
  status: 'Pending' | 'Completed';
  timestamp: string;
  handled_by: string; // user_id
}

export interface LibraryRecord {
  id: string;
  book_title: string;
  student_id: string;
  due_date: string;
  status: 'Issued' | 'Returned';
}

export interface Reservation {
  id: string;
  book_title: string;
  student_id: string;
  student_name: string;
  reservation_date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
}

export interface AttendanceRecord extends AttendanceLog {
  student_id: string;
  studentName?: string;
  studentEmail?: string;
  class?: string;
  section?: string;
}

export interface ExamResult {
  id: string;
  student_id: string;
  studentName?: string;
  class?: string;
  section?: string;
  subject: string;
  examName?: string;
  marksObtained?: number;
  maxMarks?: number;
  grade: string;
  date: string;
  teacherId?: string;
}

export interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}
