// Tipos de usuário e sistema de permissões

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
  DIRECTOR = 'director',
  ADMIN = 'admin'
}

export enum Permission {
  // Permissões de estudante
  VIEW_OWN_PROGRESS = 'view_own_progress',
  TAKE_LESSONS = 'take_lessons',
  TAKE_QUIZZES = 'take_quizzes',
  
  // Permissões de professor
  VIEW_CLASSES = 'view_classes',
  VIEW_STUDENT_PROGRESS = 'view_student_progress',
  MANAGE_GRADES = 'manage_grades',
  CREATE_ASSIGNMENTS = 'create_assignments',
  MARK_ATTENDANCE = 'mark_attendance',
  SEND_MESSAGES = 'send_messages',
  EXPORT_REPORTS = 'export_reports',
  
  // Permissões de coordenador
  MANAGE_TEACHERS = 'manage_teachers',
  MANAGE_CLASSES = 'manage_classes',
  VIEW_ALL_REPORTS = 'view_all_reports',
  ASSIGN_TEACHERS = 'assign_teachers',
  
  // Permissões de diretor
  MANAGE_SCHOOL_SETTINGS = 'manage_school_settings',
  VIEW_FINANCIAL = 'view_financial',
  MANAGE_COORDINATORS = 'manage_coordinators',
  APPROVE_CHANGES = 'approve_changes',
  
  // Permissões de admin
  MANAGE_ALL_SCHOOLS = 'manage_all_schools',
  SYSTEM_SETTINGS = 'system_settings'
}

// Mapeamento de permissões por role
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    Permission.VIEW_OWN_PROGRESS,
    Permission.TAKE_LESSONS,
    Permission.TAKE_QUIZZES
  ],
  [UserRole.TEACHER]: [
    Permission.VIEW_OWN_PROGRESS,
    Permission.TAKE_LESSONS,
    Permission.TAKE_QUIZZES,
    Permission.VIEW_CLASSES,
    Permission.VIEW_STUDENT_PROGRESS,
    Permission.MANAGE_GRADES,
    Permission.CREATE_ASSIGNMENTS,
    Permission.MARK_ATTENDANCE,
    Permission.SEND_MESSAGES,
    Permission.EXPORT_REPORTS
  ],
  [UserRole.COORDINATOR]: [
    Permission.VIEW_OWN_PROGRESS,
    Permission.TAKE_LESSONS,
    Permission.TAKE_QUIZZES,
    Permission.VIEW_CLASSES,
    Permission.VIEW_STUDENT_PROGRESS,
    Permission.MANAGE_GRADES,
    Permission.CREATE_ASSIGNMENTS,
    Permission.MARK_ATTENDANCE,
    Permission.SEND_MESSAGES,
    Permission.EXPORT_REPORTS,
    Permission.MANAGE_TEACHERS,
    Permission.MANAGE_CLASSES,
    Permission.VIEW_ALL_REPORTS,
    Permission.ASSIGN_TEACHERS
  ],
  [UserRole.DIRECTOR]: [
    Permission.VIEW_OWN_PROGRESS,
    Permission.TAKE_LESSONS,
    Permission.TAKE_QUIZZES,
    Permission.VIEW_CLASSES,
    Permission.VIEW_STUDENT_PROGRESS,
    Permission.MANAGE_GRADES,
    Permission.CREATE_ASSIGNMENTS,
    Permission.MARK_ATTENDANCE,
    Permission.SEND_MESSAGES,
    Permission.EXPORT_REPORTS,
    Permission.MANAGE_TEACHERS,
    Permission.MANAGE_CLASSES,
    Permission.VIEW_ALL_REPORTS,
    Permission.ASSIGN_TEACHERS,
    Permission.MANAGE_SCHOOL_SETTINGS,
    Permission.VIEW_FINANCIAL,
    Permission.MANAGE_COORDINATORS,
    Permission.APPROVE_CHANGES
  ],
  [UserRole.ADMIN]: Object.values(Permission)
};

// Interfaces de usuário
export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends BaseUser {
  role: UserRole.STUDENT;
  studentId: string;
  classId: string;
  grade: string;
  enrollmentDate: string;
  parentEmail?: string;
  parentPhone?: string;
  // Dados de gamificação
  lives: number;
  gems: number;
  xp: number;
  level: number;
  premiumPlan?: string;
}

export interface Teacher extends BaseUser {
  role: UserRole.TEACHER;
  teacherId: string;
  subjects: string[];
  classes: string[];
  hireDate: string;
  phone?: string;
  department?: string;
  specialization?: string;
}

export interface Coordinator extends BaseUser {
  role: UserRole.COORDINATOR;
  coordinatorId: string;
  department: string;
  teachers: string[];
  classes: string[];
  hireDate: string;
  phone?: string;
}

export interface Director extends BaseUser {
  role: UserRole.DIRECTOR;
  directorId: string;
  schoolId: string;
  hireDate: string;
  phone?: string;
}

export interface Admin extends BaseUser {
  role: UserRole.ADMIN;
  adminId: string;
  permissions: Permission[];
}

export type User = Student | Teacher | Coordinator | Director | Admin;

// Interface para classe/turma
export interface Class {
  id: string;
  name: string;
  grade: string;
  shift: 'morning' | 'afternoon' | 'evening';
  teacherId: string;
  studentIds: string[];
  subjects: string[];
  year: number;
  createdAt: string;
  updatedAt: string;
}

// Interface para frequência
export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  notes?: string;
  markedBy: string;
  createdAt: string;
}

// Interface para notas
export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  assignmentName: string;
  score: number;
  maxScore: number;
  date: string;
  teacherId: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para atividades
export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  maxScore: number;
  type: 'quiz' | 'homework' | 'project' | 'exam';
  status: 'draft' | 'published' | 'closed';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Helper functions para verificação de permissões
export function hasPermission(user: User, permission: Permission): boolean {
  const userPermissions = RolePermissions[user.role];
  return userPermissions.includes(permission);
}

export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}

// Helper para verificar se é estudante, professor, etc.
export function isStudent(user: User): user is Student {
  return user.role === UserRole.STUDENT;
}

export function isTeacher(user: User): user is Teacher {
  return user.role === UserRole.TEACHER;
}

export function isCoordinator(user: User): user is Coordinator {
  return user.role === UserRole.COORDINATOR;
}

export function isDirector(user: User): user is Director {
  return user.role === UserRole.DIRECTOR;
}

export function isAdmin(user: User): user is Admin {
  return user.role === UserRole.ADMIN;
}

// Helper para obter nome da role em português
export function getRoleName(role: UserRole): string {
  const names = {
    [UserRole.STUDENT]: 'Estudante',
    [UserRole.TEACHER]: 'Professor(a)',
    [UserRole.COORDINATOR]: 'Coordenador(a)',
    [UserRole.DIRECTOR]: 'Diretor(a)',
    [UserRole.ADMIN]: 'Administrador'
  };
  return names[role];
}
