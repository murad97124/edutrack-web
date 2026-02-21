# EduTrack360 - User Roles & Permissions Guide

## Document Information
- **Version:** 1.0
- **Last Updated:** February 21, 2026
- **Purpose:** Web Developer Reference for Role-Based Access Control (RBAC)

---

## Table of Contents
1. [User Roles Overview](#1-user-roles-overview)
2. [Role Hierarchy](#2-role-hierarchy)
3. [Permissions Matrix](#3-permissions-matrix)
4. [Detailed API Permissions by Module](#4-detailed-api-permissions-by-module)
5. [Frontend Implementation Guidelines](#5-frontend-implementation-guidelines)

---

## 1. User Roles Overview

EduTrack360 has **6 distinct user roles**, each with specific access levels and capabilities:

| Role | Code | Description | Scope |
|------|------|-------------|-------|
| **System Admin** | `SYSTEM_ADMIN` | Platform administrator with full system access | Global (All Schools) |
| **Principal** | `PRINCIPAL` | School head with full school management access | Single School |
| **Assistant Principal** | `ASSISTANT_PRINCIPAL` | Assists principal with administrative tasks | Single School |
| **Teacher** | `TEACHER` | Faculty member with limited administrative access | Single School |
| **Parent** | `PARENT` | Parent/Guardian of enrolled students | Single School |
| **Student** | `STUDENT` | Enrolled student | Single School |

---

## 2. Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        SYSTEM_ADMIN                              │
│  (Full platform control - manages all schools & system admins)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PRINCIPAL                                │
│      (Full school control - manages all school operations)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ASSISTANT_PRINCIPAL                           │
│      (School admin - same as Principal except certain tasks)     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          TEACHER                                 │
│        (Limited admin - view students, send messages)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PARENT / STUDENT                           │
│              (End users - consume information only)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Permissions Matrix

### Legend:
- ✅ = Full Access (CRUD)
- 👁️ = Read Only
- ❌ = No Access
- 🔶 = Partial/Conditional Access

| Feature/Module | SYSTEM_ADMIN | PRINCIPAL | ASST_PRINCIPAL | TEACHER | PARENT | STUDENT |
|---------------|--------------|-----------|----------------|---------|--------|---------|
| **School Management** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **System Admin Management** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Demo Requests (Admin)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **User Management** | 🔶¹ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Student Management** | ❌ | ✅ | ✅ | 👁️ | ❌ | ❌ |
| **Parent-Student Links** | ❌ | ✅ | ✅ | 👁️ | ❌ | ❌ |
| **Bus Management** | ❌ | ✅ | ✅ | 👁️ | ❌ | ❌ |
| **Bus Tracking** | 👁️ | 👁️ | 👁️ | 👁️ | 👁️ | ❌ |
| **Messaging (Send)** | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Messaging (Receive)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Emergency Notifications** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Dashboard (School)** | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Dashboard (Parent)** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **My Children Info** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Profile (Own)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 4. Detailed API Permissions by Module

### 4.1 Public Endpoints (No Authentication Required)

These endpoints are accessible to **everyone**, including unauthenticated users:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/public/schools/by-subdomain/{subdomain}` | GET | Get school branding for login page |
| `/api/public/demo-requests` | POST | Submit a demo/sales request |
| `/api/public/demo-requests/{requestId}` | GET | Track demo request status |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/logout` | POST | User logout |

---

### 4.2 Authentication Endpoints

| Endpoint | Method | Required Role | Description |
|----------|--------|---------------|-------------|
| `/api/auth/change-password` | POST | Any Authenticated | Change own password |

---

### 4.3 System Admin Module

**Required Role:** `SYSTEM_ADMIN` only

#### School Management (`/api/admin/schools`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/schools` | POST | Create new school with principal |
| `/api/admin/schools` | GET | Get all schools (paginated) |
| `/api/admin/schools/{id}` | GET | Get school by ID |
| `/api/admin/schools/{id}` | PUT | Update school info |
| `/api/admin/schools/{id}/status` | PATCH | Update school status |

#### System Admin Management (`/api/admin/system-admins`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/system-admins` | POST | Create new system admin |
| `/api/admin/system-admins` | GET | Get all system admins |
| `/api/admin/system-admins/{id}` | GET | Get system admin by ID |
| `/api/admin/system-admins/{id}/status` | PATCH | Update system admin status |
| `/api/admin/system-admins/{id}` | DELETE | Delete system admin |

#### Demo Request Management (`/api/admin/demo-requests`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/demo-requests` | GET | Get all demo requests (paginated, filterable) |
| `/api/admin/demo-requests/stats` | GET | Get demo request statistics |
| `/api/admin/demo-requests/{id}` | GET | Get demo request by ID |
| `/api/admin/demo-requests/by-request-id/{requestId}` | GET | Get by public request ID |
| `/api/admin/demo-requests/{id}` | PATCH | Update demo request |
| `/api/admin/demo-requests/{id}/status` | PATCH | Update status only |
| `/api/admin/demo-requests/{id}/assign` | PATCH | Assign to team member |
| `/api/admin/demo-requests/{id}` | DELETE | Delete demo request |

---

### 4.4 User Management Module (`/api/users`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/users/me` | GET | Any Authenticated | Get own profile |
| `/api/users/me` | PUT | Any Authenticated | Update own profile |
| `/api/users` | GET | SYSTEM_ADMIN, PRINCIPAL, ASSISTANT_PRINCIPAL | Get school users |
| `/api/users` | POST | SYSTEM_ADMIN, PRINCIPAL, ASSISTANT_PRINCIPAL | Create user in school |
| `/api/users/{id}` | GET | SYSTEM_ADMIN, PRINCIPAL, ASSISTANT_PRINCIPAL | Get user by ID |
| `/api/users/{id}` | PUT | SYSTEM_ADMIN, PRINCIPAL, ASSISTANT_PRINCIPAL | Update user |
| `/api/users/{id}/status` | PATCH | SYSTEM_ADMIN, PRINCIPAL, ASSISTANT_PRINCIPAL | Update user status |

---

### 4.5 Student Management Module (`/api/students`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/students` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Create student |
| `/api/students` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | Get students list |
| `/api/students/{id}` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | Get student by ID |
| `/api/students/{id}` | PUT | PRINCIPAL, ASSISTANT_PRINCIPAL | Update student |
| `/api/students/{id}/parents` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | Get student's parents |
| `/api/students/relationships` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Create parent-student link |
| `/api/students/relationships/{id}` | DELETE | PRINCIPAL, ASSISTANT_PRINCIPAL | Delete relationship |

---

### 4.6 Bus Management Module (`/api/buses`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/buses` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Create bus |
| `/api/buses` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | Get buses list |
| `/api/buses/{id}` | GET | Any Authenticated | Get bus by ID |
| `/api/buses/{id}` | PUT | PRINCIPAL, ASSISTANT_PRINCIPAL | Update bus |
| `/api/buses/{id}/location` | GET | Any Authenticated | Get current bus location |
| `/api/buses/{id}/location` | POST | Any Authenticated | Update bus location (driver app) |
| `/api/buses/{id}/route` | GET | Any Authenticated | Get bus routes |
| `/api/buses/routes` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Create bus route |
| `/api/buses/{id}/assignments` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | Get bus student assignments |
| `/api/buses/assignments` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Assign student to bus |

---

### 4.7 Parent Module (`/api/parent`)

**Required Role:** `PARENT` only

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/parent/students` | GET | Get own children |
| `/api/parent/students/{studentId}/bus` | GET | Get child's bus assignment |
| `/api/parent/buses/{busId}/location` | GET | Track bus location |
| `/api/parent/buses/{busId}/route` | GET | Get bus route info |

---

### 4.8 Messaging Module (`/api/messages`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/messages/send` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | Send message |
| `/api/messages/inbox` | GET | Any Authenticated | Get inbox |
| `/api/messages/sent` | GET | Any Authenticated | Get sent messages |
| `/api/messages/unread` | GET | Any Authenticated | Get unread messages |
| `/api/messages/unread/count` | GET | Any Authenticated | Get unread count |
| `/api/messages/{id}` | GET | Any Authenticated | Get message by ID |
| `/api/messages/{id}/mark-read` | PATCH | Any Authenticated | Mark as read |
| `/api/messages/{id}/reply` | POST | Any Authenticated | Reply to message |
| `/api/messages/{id}/replies` | GET | Any Authenticated | Get message replies |
| `/api/messages/search` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL | Search messages |

---

### 4.9 Notification Module (`/api/notifications`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/notifications/emergency` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Send emergency notification |
| `/api/notifications/bus/{busId}/broadcast` | POST | PRINCIPAL, ASSISTANT_PRINCIPAL | Broadcast to bus parents |
| `/api/notifications/my-notifications` | GET | Any Authenticated | Get own notifications |
| `/api/notifications/unread` | GET | Any Authenticated | Get unread notifications |
| `/api/notifications/unread/count` | GET | Any Authenticated | Get unread count |
| `/api/notifications/{id}/read` | PATCH | Any Authenticated | Mark as read |
| `/api/notifications/{id}/acknowledge` | PATCH | Any Authenticated | Acknowledge notification |

---

### 4.10 Dashboard Module (`/api/dashboard`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/dashboard/school` | GET | PRINCIPAL, ASSISTANT_PRINCIPAL, TEACHER | School dashboard stats |
| `/api/dashboard/parent` | GET | PARENT | Parent dashboard stats |

---

### 4.11 Device Token Module (`/api/devices`)

| Endpoint | Method | Required Roles | Description |
|----------|--------|----------------|-------------|
| `/api/devices/register-token` | POST | Any Authenticated | Register push token |
| `/api/devices/token` | DELETE | Any Authenticated | Remove push token |

---

## 5. Frontend Implementation Guidelines

### 5.1 Role-Based UI Components

Based on the user's role, show/hide UI components:

#### System Admin Dashboard
```javascript
if (user.role === 'SYSTEM_ADMIN') {
  showComponents([
    'SchoolManagement',
    'SystemAdminManagement', 
    'DemoRequestDashboard',
    'GlobalUserStatus'
  ]);
}
```

#### School Admin Dashboard (Principal/Asst. Principal)
```javascript
if (['PRINCIPAL', 'ASSISTANT_PRINCIPAL'].includes(user.role)) {
  showComponents([
    'UserManagement',
    'StudentManagement',
    'BusManagement',
    'MessagingCenter',
    'EmergencyNotifications',
    'SchoolDashboard'
  ]);
}
```

#### Teacher Dashboard
```javascript
if (user.role === 'TEACHER') {
  showComponents([
    'StudentList',        // Read-only
    'BusList',            // Read-only
    'MessagingCenter',    // Can send
    'SchoolDashboard'
  ]);
}
```

#### Parent Dashboard
```javascript
if (user.role === 'PARENT') {
  showComponents([
    'MyChildren',
    'BusTracking',
    'MessagingInbox',     // Can receive & reply
    'Notifications',
    'ParentDashboard'
  ]);
}
```

#### Student Dashboard
```javascript
if (user.role === 'STUDENT') {
  showComponents([
    'MessagingInbox',     // Can receive & reply
    'Notifications',
    'Profile'
  ]);
}
```

### 5.2 Navigation Menu by Role

| Menu Item | SYSTEM_ADMIN | PRINCIPAL | ASST_PRINCIPAL | TEACHER | PARENT | STUDENT |
|-----------|--------------|-----------|----------------|---------|--------|---------|
| Schools | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Demo Requests | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Admins | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Users | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Students | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Buses | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Messages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| My Children | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Track Bus | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 5.3 JWT Token Structure

The access token contains user information for frontend routing:

```json
{
  "sub": "userId",
  "username": "john.doe",
  "email": "john@example.com",
  "role": "PRINCIPAL",
  "schoolId": 1,
  "schoolName": "Springfield Elementary",
  "iat": 1708520154,
  "exp": 1708606554
}
```

### 5.4 Error Handling for Authorization

Handle 403 Forbidden responses gracefully:

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      showNotification('Access Denied', 'You do not have permission to perform this action.');
      // Optionally redirect to dashboard
    }
    return Promise.reject(error);
  }
);
```

---

## Appendix A: Status Enums

### User Status
- `ACTIVE` - User can log in and use the system
- `INACTIVE` - User cannot log in
- `SUSPENDED` - User temporarily suspended

### School Status
- `ACTIVE` - School is operational
- `SUSPENDED` - School temporarily suspended
- `INACTIVE` - School deactivated

### Student Status
- `ACTIVE` - Currently enrolled
- `INACTIVE` - Not active
- `GRADUATED` - Completed education
- `TRANSFERRED` - Moved to another school
- `SUSPENDED` - Temporarily suspended

### Demo Request Status
- `PENDING` - New request, not reviewed
- `CONTACTED` - Initial contact made
- `SCHEDULED` - Demo scheduled
- `COMPLETED` - Demo completed
- `CONVERTED` - Became a customer
- `DECLINED` - Not interested
- `NO_RESPONSE` - No response after attempts

---

## Appendix B: Quick Reference Card

### Who Can Do What?

| Action | Who Can Do It |
|--------|--------------|
| Create a school | System Admin only |
| Create users in school | Principal, Asst. Principal |
| Create students | Principal, Asst. Principal |
| View students | Principal, Asst. Principal, Teacher |
| Manage buses | Principal, Asst. Principal |
| Track buses | Everyone (authenticated) |
| Send messages | Principal, Asst. Principal, Teacher |
| Receive messages | Everyone |
| Send emergency alerts | Principal, Asst. Principal |
| View own children | Parent only |
| Update own profile | Everyone |

---

**Document End**

*For questions or updates, contact the development team.*



