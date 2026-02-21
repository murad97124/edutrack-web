import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './app.constants';
import {
  ApiEnvelope,
  AuthUser,
  Bus,
  DemoRequestItem,
  DemoRequestPayload,
  DemoRequestResponse,
  LoginPayload,
  LoginResponse,
  MessageItem,
  NotificationItem,
  ParentStudentRelationship,
  Role,
  School,
  Student,
  SystemAdmin,
  User
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  submitDemoRequest(
    payload: DemoRequestPayload
  ): Observable<ApiEnvelope<DemoRequestResponse> | DemoRequestResponse> {
    return this.http.post<ApiEnvelope<DemoRequestResponse> | DemoRequestResponse>(
      `${API_BASE_URL}/api/public/demo-requests`,
      payload
    );
  }

  login(payload: LoginPayload): Observable<ApiEnvelope<LoginResponse> | LoginResponse> {
    return this.http.post<ApiEnvelope<LoginResponse> | LoginResponse>(
      `${API_BASE_URL}/api/auth/login`,
      payload
    );
  }

  logout(): Observable<ApiEnvelope<void> | void> {
    return this.http.post<ApiEnvelope<void> | void>(`${API_BASE_URL}/api/auth/logout`, {});
  }

  getMyProfile(): Observable<ApiEnvelope<AuthUser> | AuthUser> {
    return this.http.get<ApiEnvelope<AuthUser> | AuthUser>(`${API_BASE_URL}/api/users/me`);
  }

  listUsers(params?: { page?: number; size?: number; role?: Role; search?: string }): Observable<ApiEnvelope<User[]> | User[]> {
    return this.http.get<ApiEnvelope<User[]> | User[]>(`${API_BASE_URL}/api/users`, {
      params: toHttpParams(params)
    });
  }

  createUser(payload: Partial<User> & { password?: string }): Observable<ApiEnvelope<User> | User> {
    return this.http.post<ApiEnvelope<User> | User>(`${API_BASE_URL}/api/users`, payload);
  }

  listStudents(params?: { page?: number; size?: number; gradeLevel?: string; className?: string; search?: string }): Observable<ApiEnvelope<Student[]> | Student[]> {
    return this.http.get<ApiEnvelope<Student[]> | Student[]>(`${API_BASE_URL}/api/students`, {
      params: toHttpParams(params)
    });
  }

  createStudent(payload: Partial<Student>): Observable<ApiEnvelope<Student> | Student> {
    return this.http.post<ApiEnvelope<Student> | Student>(`${API_BASE_URL}/api/students`, payload);
  }

  createParentStudentRelationship(
    payload: ParentStudentRelationship
  ): Observable<ApiEnvelope<ParentStudentRelationship> | ParentStudentRelationship> {
    return this.http.post<ApiEnvelope<ParentStudentRelationship> | ParentStudentRelationship>(
      `${API_BASE_URL}/api/students/relationships`,
      payload
    );
  }

  deleteParentStudentRelationship(
    relationshipId: string | number
  ): Observable<ApiEnvelope<void> | void> {
    return this.http.delete<ApiEnvelope<void> | void>(
      `${API_BASE_URL}/api/students/relationships/${relationshipId}`
    );
  }

  listBuses(params?: { page?: number; size?: number; status?: string }): Observable<ApiEnvelope<Bus[]> | Bus[]> {
    return this.http.get<ApiEnvelope<Bus[]> | Bus[]>(`${API_BASE_URL}/api/buses`, {
      params: toHttpParams(params)
    });
  }

  createBus(payload: Partial<Bus>): Observable<ApiEnvelope<Bus> | Bus> {
    return this.http.post<ApiEnvelope<Bus> | Bus>(`${API_BASE_URL}/api/buses`, payload);
  }

  createBusAssignment(payload: {
    studentId: string | number;
    busId: string | number;
    pickupStopId: string | number;
    dropoffStopId: string | number;
    effectiveFrom: string;
  }): Observable<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>> {
    return this.http.post<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>>(
      `${API_BASE_URL}/api/buses/assignments`,
      payload
    );
  }

  listInboxMessages(params?: { page?: number; size?: number }): Observable<ApiEnvelope<MessageItem[]> | MessageItem[]> {
    return this.http.get<ApiEnvelope<MessageItem[]> | MessageItem[]>(`${API_BASE_URL}/api/messages/inbox`, {
      params: toHttpParams(params)
    });
  }

  createMessage(payload: {
    subject: string;
    body: string;
    recipientIds: Array<string | number>;
    messageType?: string;
    priority?: string;
  }): Observable<ApiEnvelope<MessageItem> | MessageItem> {
    return this.http.post<ApiEnvelope<MessageItem> | MessageItem>(
      `${API_BASE_URL}/api/messages/send`,
      payload
    );
  }

  listNotifications(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Observable<ApiEnvelope<NotificationItem[]> | NotificationItem[]> {
    return this.http.get<ApiEnvelope<NotificationItem[]> | NotificationItem[]>(
      `${API_BASE_URL}/api/notifications/my-notifications`,
      {
        params: toHttpParams(params)
      }
    );
  }

  markNotificationRead(id: string): Observable<ApiEnvelope<void> | void> {
    return this.http.patch<ApiEnvelope<void> | void>(`${API_BASE_URL}/api/notifications/${id}/read`, {});
  }

  listSchools(params?: { page?: number; size?: number; status?: string; search?: string }): Observable<ApiEnvelope<School[]> | School[]> {
    return this.http.get<ApiEnvelope<School[]> | School[]>(`${API_BASE_URL}/api/admin/schools`, {
      params: toHttpParams(params)
    });
  }

  createSchool(payload: Partial<School> & { principalEmail?: string; principalFirstName?: string; principalLastName?: string }): Observable<ApiEnvelope<School> | School> {
    return this.http.post<ApiEnvelope<School> | School>(`${API_BASE_URL}/api/admin/schools`, payload);
  }

  updateSchoolStatus(
    schoolId: string | number,
    status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
  ): Observable<ApiEnvelope<void> | void> {
    return this.http.patch<ApiEnvelope<void> | void>(
      `${API_BASE_URL}/api/admin/schools/${schoolId}/status`,
      { status }
    );
  }

  listSystemAdmins(params?: {
    page?: number;
    size?: number;
    status?: string;
    search?: string;
  }): Observable<ApiEnvelope<SystemAdmin[]> | SystemAdmin[]> {
    return this.http.get<ApiEnvelope<SystemAdmin[]> | SystemAdmin[]>(
      `${API_BASE_URL}/api/admin/system-admins`,
      {
        params: toHttpParams(params)
      }
    );
  }

  createSystemAdmin(payload: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }): Observable<ApiEnvelope<SystemAdmin> | SystemAdmin> {
    return this.http.post<ApiEnvelope<SystemAdmin> | SystemAdmin>(
      `${API_BASE_URL}/api/admin/system-admins`,
      payload
    );
  }

  updateSystemAdminStatus(
    adminId: string | number,
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ): Observable<ApiEnvelope<void> | void> {
    return this.http.patch<ApiEnvelope<void> | void>(
      `${API_BASE_URL}/api/admin/system-admins/${adminId}/status`,
      null,
      {
        params: toHttpParams({ status })
      }
    );
  }

  listDemoRequests(params?: {
    page?: number;
    size?: number;
    status?: string;
    assignedTo?: string;
    search?: string;
  }): Observable<ApiEnvelope<DemoRequestItem[]> | DemoRequestItem[]> {
    return this.http.get<ApiEnvelope<DemoRequestItem[]> | DemoRequestItem[]>(
      `${API_BASE_URL}/api/admin/demo-requests`,
      {
        params: toHttpParams(params)
      }
    );
  }

  demoRequestStats(): Observable<ApiEnvelope<Record<string, number>> | Record<string, number>> {
    return this.http.get<ApiEnvelope<Record<string, number>> | Record<string, number>>(
      `${API_BASE_URL}/api/admin/demo-requests/stats`
    );
  }

  updateDemoRequestStatus(
    demoRequestId: string | number,
    status:
      | 'PENDING'
      | 'CONTACTED'
      | 'SCHEDULED'
      | 'COMPLETED'
      | 'CONVERTED'
      | 'DECLINED'
      | 'NO_RESPONSE'
  ): Observable<ApiEnvelope<void> | void> {
    return this.http.patch<ApiEnvelope<void> | void>(
      `${API_BASE_URL}/api/admin/demo-requests/${demoRequestId}/status`,
      null,
      {
        params: toHttpParams({ status })
      }
    );
  }

  parentStudents(): Observable<ApiEnvelope<Student[]> | Student[]> {
    return this.http.get<ApiEnvelope<Student[]> | Student[]>(`${API_BASE_URL}/api/parent/students`);
  }

  parentStudentBus(studentId: string | number): Observable<ApiEnvelope<Bus> | Bus> {
    return this.http.get<ApiEnvelope<Bus> | Bus>(`${API_BASE_URL}/api/parent/students/${studentId}/bus`);
  }

  parentBusLocation(busId: string | number): Observable<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>> {
    return this.http.get<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>>(
      `${API_BASE_URL}/api/parent/buses/${busId}/location`
    );
  }

  parentBusRoute(busId: string | number): Observable<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>> {
    return this.http.get<ApiEnvelope<Record<string, unknown>> | Record<string, unknown>>(
      `${API_BASE_URL}/api/parent/buses/${busId}/route`
    );
  }

  schoolDashboard(): Observable<ApiEnvelope<Record<string, number>> | Record<string, number>> {
    return this.http.get<ApiEnvelope<Record<string, number>> | Record<string, number>>(
      `${API_BASE_URL}/api/dashboard/school`
    );
  }

  parentDashboard(): Observable<ApiEnvelope<Record<string, number>> | Record<string, number>> {
    return this.http.get<ApiEnvelope<Record<string, number>> | Record<string, number>>(
      `${API_BASE_URL}/api/dashboard/parent`
    );
  }
}

function toHttpParams(params?: Record<string, string | number | undefined>): HttpParams {
  let httpParams = new HttpParams();
  if (!params) {
    return httpParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.length > 0) {
      httpParams = httpParams.set(key, `${value}`);
    }
  });
  return httpParams;
}
