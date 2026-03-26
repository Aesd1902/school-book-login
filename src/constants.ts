import { User, Teacher, Student, Parent, Staff, UserRole, BusRoute, ExamResult } from './types';

const subjects = ['English', 'Telugu', 'Hindi', 'Maths', 'Science', 'Social'];
export const CLASSES = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
export const SECTIONS = ['A', 'B', 'C', 'D'];
export const SUBJECTS = subjects;

export const INITIAL_TEACHERS: Teacher[] = Array.from({ length: 10 }, (_, i) => {
  const sub = subjects[i % subjects.length];
  const teacherId = `T-${(i+1).toString().padStart(3, '0')}`;
  return {
    teacher_id: teacherId,
    name: `Teacher ${i+1} (${sub})`,
    assigned_classes: CLASSES.map(c => `${c}-A`),
    subjects: [sub],
    email: `teacher${i+1}@school.com`,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacherId}`,
    phone: '9876543210',
    salary: { basic: 50000, allowances: 5000, history: [] }
  };
});

export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_PARENTS: Parent[] = [];
export const INITIAL_EXAM_RESULTS: ExamResult[] = [];

CLASSES.forEach((c) => {
  for (let i = 1; i <= 5; i++) {
    const studentIdx = (parseInt(c) - 1) * 5 + i;
    const studentId = `S-${studentIdx.toString().padStart(3, '0')}`;
    const parentId = `P-${studentIdx.toString().padStart(3, '0')}`;
    
    INITIAL_STUDENTS.push({
      student_id: studentId,
      name: `Student ${studentIdx} (Class ${c})`,
      class_id: c,
      class: c,
      section: 'A',
      parent_id: parentId,
      subjects: subjects,
      summary: { attendance_percentage: 95, latest_grade: 'A', fee_status: 'Pending' },
      email: `student${studentIdx}@school.com`,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId}`,
      phone: `98765${studentIdx.toString().padStart(5, '0')}`,
      fatherName: `Father of Student ${studentIdx}`,
      guardian: {
        name: `Guardian ${studentIdx}`,
        phone: `98765${studentIdx.toString().padStart(5, '0')}`,
        email: `guardian${studentIdx}@school.com`,
        relation: 'Father',
        address: `123 Edu Road, Area ${c}`,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=G-${studentId}`
      },
      fees: { total: 50000, paid: 25000, status: 'Pending', history: [] }
    });

    INITIAL_PARENTS.push({
      parent_id: parentId,
      name: `Parent ${studentIdx}`,
      linked_students: [studentId],
      email: `guardian${studentIdx}@school.com`,
      phone: `98765${studentIdx.toString().padStart(5, '0')}`
    });

    INITIAL_EXAM_RESULTS.push(
      { id: `ER-${studentId}-1`, student_id: studentId, subject: 'Mathematics', marksObtained: 95, maxMarks: 100, grade: 'A+', date: '2025-10-15' },
      { id: `ER-${studentId}-2`, student_id: studentId, subject: 'Science', marksObtained: 88, maxMarks: 100, grade: 'A', date: '2025-10-16' },
      { id: `ER-${studentId}-3`, student_id: studentId, subject: 'English', marksObtained: 78, maxMarks: 100, grade: 'B+', date: '2025-10-17' },
      { id: `ER-${studentId}-4`, student_id: studentId, subject: 'Social', marksObtained: 82, maxMarks: 100, grade: 'A-', date: '2025-10-18' },
      { id: `ER-${studentId}-5`, student_id: studentId, subject: 'Hindi', marksObtained: 85, maxMarks: 100, grade: 'A', date: '2025-10-19' },
      { id: `ER-${studentId}-6`, student_id: studentId, subject: 'Telugu', marksObtained: 90, maxMarks: 100, grade: 'A+', date: '2025-10-20' }
    );
  }
});

export const MOCK_USERS: User[] = [
  { user_id: 'U-ADMIN1', email: 'eswara.alugolu6511@gmail.com', role: 'Super Admin', role_type: 'academic', name: 'Eswara Alugolu', phone: '1234567890', linked_id: 'ADMIN-01' },
  { user_id: 'U-ADMIN2', email: 'admin@school.com', role: 'Management', role_type: 'academic', name: 'Management Admin', phone: '1234567891', linked_id: 'ADMIN-02' },
  
  ...INITIAL_TEACHERS.map((t, i) => ({ user_id: `U-T${i}`, email: t.email, role: 'Teacher' as UserRole, role_type: 'academic' as const, name: t.name, phone: t.phone || '9876543210', linked_id: t.teacher_id, photo: t.photo })),
  
  ...INITIAL_STUDENTS.map((s, i) => ({ user_id: `U-S${i}`, email: s.email, role: 'Student' as UserRole, role_type: 'academic' as const, name: s.name, phone: s.phone || '9876543230', linked_id: s.student_id, photo: s.photo })),
  
  ...INITIAL_PARENTS.map((p, i) => ({ user_id: `U-P${i}`, email: p.email, role: 'Parent' as UserRole, role_type: 'academic' as const, name: p.name, phone: p.phone || '9876543231', linked_id: p.parent_id })),

  { user_id: 'U-SEC', email: 'security@school.com', role: 'Security', role_type: 'non-academic', name: 'Officer Mike', phone: '555-0101', linked_id: 'ST-001' },
  { user_id: 'U-REC', email: 'reception@school.com', role: 'Reception', role_type: 'non-academic', name: 'Ms. Parker', phone: '555-0203', linked_id: 'ST-002' }
];

export const ROLE_PASSWORDS: Record<UserRole, string> = {
  'Super Admin': 'S.admin12!@',
  'Management': 'Admin12!@',
  'Teacher': 'Teacher12!@',
  'Student': 'Student12!@',
  'Parent': 'Parent12!@',
  'Security': 'Security12!@',
  'Reception': 'Reception12!@',
  'Store': 'Store12!@',
  'Electrician': 'Electrician12!@',
  'Accounts': 'Accounts12!@',
  'Attender': 'Attender12!@',
  'Librarian': 'Librarian12!@',
};

export const INITIAL_STAFF: Staff[] = [
  { staff_id: 'ST-001', name: 'Officer Mike', role: 'Security', module_access: ['gate_logs', 'alerts'], email: 'security@school.com' },
  { staff_id: 'ST-002', name: 'Ms. Parker', role: 'Reception', module_access: ['inquiry_logs', 'visitors'], email: 'reception@school.com' }
];

export const INITIAL_BUS_ROUTES: BusRoute[] = [
  { id: 'BR-001', routeName: 'North Route', driverName: 'John Doe', driverPhone: '1234567890', busNumber: 'BUS-01', capacity: 40, studentsCount: 25, stops: [{ name: 'Main Gate', time: '07:30 AM' }, { name: 'North Park', time: '07:45 AM' }], status: 'On Time' }
];

export const INITIAL_SECURITY_STAFF = INITIAL_STAFF.filter(s => s.role === 'Security');
export const INITIAL_NON_TEACHING_STAFF = INITIAL_STAFF.filter(s => s.role !== 'Security');
