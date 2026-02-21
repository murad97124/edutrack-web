export type Role =
  | 'SYSTEM_ADMIN'
  | 'PRINCIPAL'
  | 'ASSISTANT_PRINCIPAL'
  | 'TEACHER'
  | 'PARENT'
  | 'STUDENT'
  | 'STAFF';

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  schoolId?: string;
  schoolName?: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  user?: AuthUser;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phoneNumber?: string;
  status?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  enrollmentDate?: string;
  gender?: string;
  gradeLevel?: string;
  className?: string;
  status?: string;
}

export interface ParentStudentRelationship {
  id?: string | number;
  studentId: string | number;
  parentUserId: string | number;
  relationship: string;
  isPrimaryContact: boolean;
}

export interface Bus {
  id: string;
  busNumber: string;
  licensePlate?: string;
  capacity?: number;
  driverName?: string;
  driverPhone?: string;
  status?: string;
}

export interface MessageItem {
  id: string;
  subject: string;
  content?: string;
  body?: string;
  messageType?: string;
  priority?: string;
  createdAt?: string;
  read?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notificationType?: string;
  priority?: string;
  acknowledged?: boolean;
  read?: boolean;
  createdAt?: string;
}

export interface School {
  id: string;
  name: string;
  subdomain: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  status?: string;
}

export interface DemoRequestPayload {
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  schoolSize: string;
  message: string;
  country?: string;
  preferredDemoDate?: string;
  source?: string;
}

export interface DemoRequestResponse {
  requestId: string;
}

export interface SystemAdmin {
  id: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  status?: string;
}

export interface DemoRequestItem {
  id: string | number;
  requestId?: string;
  schoolName: string;
  contactName: string;
  email: string;
  phone?: string;
  status?: string;
  assignedTo?: string;
  internalNotes?: string;
  scheduledDemoDate?: string;
  createdAt?: string;
}
