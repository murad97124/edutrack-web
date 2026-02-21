# EduTrack360 API Quick Reference

## Base URL
```
http://localhost:8087
```

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

## User Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | Any |
| PUT | `/api/users/me` | Update current user profile | Any |
| GET | `/api/users` | Get all users (paginated) | Principal, Assistant Principal |
| POST | `/api/users` | Create new user | Principal, Assistant Principal |
| GET | `/api/users/{id}` | Get user by ID | Principal, Assistant Principal |
| PUT | `/api/users/{id}` | Update user | Principal, Assistant Principal |
| PATCH | `/api/users/{id}/status` | Update user status | Principal, Assistant Principal |

## Student Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/students` | Create student | Principal, Assistant Principal |
| GET | `/api/students` | Get all students (paginated) | Principal, Assistant Principal, Teacher |
| GET | `/api/students/{id}` | Get student by ID | Principal, Assistant Principal, Teacher |
| PUT | `/api/students/{id}` | Update student | Principal, Assistant Principal |
| GET | `/api/students/{id}/parents` | Get student's parents | Principal, Assistant Principal, Teacher |
| POST | `/api/students/relationships` | Create parent-student relationship | Principal, Assistant Principal |
| DELETE | `/api/students/relationships/{id}` | Delete parent-student relationship | Principal, Assistant Principal |

## Bus Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/buses` | Create bus | Principal, Assistant Principal |
| GET | `/api/buses` | Get all buses (paginated) | Principal, Assistant Principal, Teacher |
| GET | `/api/buses/{id}` | Get bus by ID | Any |
| PUT | `/api/buses/{id}` | Update bus | Principal, Assistant Principal |
| GET | `/api/buses/{id}/location` | Get current bus location | Any |
| POST | `/api/buses/{id}/location` | Update bus location | Any |
| GET | `/api/buses/{id}/route` | Get bus routes | Any |
| POST | `/api/buses/routes` | Create bus route | Principal, Assistant Principal |
| GET | `/api/buses/{id}/assignments` | Get bus student assignments | Principal, Assistant Principal, Teacher |
| POST | `/api/buses/assignments` | Assign student to bus | Principal, Assistant Principal |

## Parent Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/parent/students` | Get my children | Parent |
| GET | `/api/parent/students/{studentId}/bus` | Get student's bus assignment | Parent |
| GET | `/api/parent/buses/{busId}/location` | Track bus location | Parent |
| GET | `/api/parent/buses/{busId}/route` | Get bus route | Parent |

## Messaging

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/messages/send` | Send message | Principal, Assistant Principal, Teacher |
| GET | `/api/messages/inbox` | Get inbox messages | Any |
| GET | `/api/messages/sent` | Get sent messages | Any |
| GET | `/api/messages/unread` | Get unread messages | Any |
| GET | `/api/messages/unread/count` | Get unread count | Any |
| GET | `/api/messages/{id}` | Get message by ID | Any |
| PATCH | `/api/messages/{id}/mark-read` | Mark message as read | Any |
| POST | `/api/messages/{id}/reply` | Reply to message | Any |
| GET | `/api/messages/{id}/replies` | Get message replies | Any |
| GET | `/api/messages/search` | Search messages | Principal, Assistant Principal |

## Notifications

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/notifications/emergency` | Send emergency notification | Principal, Assistant Principal |
| POST | `/api/notifications/bus/{busId}/broadcast` | Broadcast to bus parents | Principal, Assistant Principal |
| GET | `/api/notifications/my-notifications` | Get my notifications | Any |
| GET | `/api/notifications/unread` | Get unread notifications | Any |
| GET | `/api/notifications/unread/count` | Get unread count | Any |
| PATCH | `/api/notifications/{id}/read` | Mark as read | Any |
| PATCH | `/api/notifications/{id}/acknowledge` | Acknowledge notification | Any |

## Dashboard

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/school` | Get school dashboard stats | Principal, Assistant Principal, Teacher |
| GET | `/api/dashboard/parent` | Get parent dashboard stats | Parent |

## Device Tokens

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/devices/register-token` | Register device token | Any |
| DELETE | `/api/devices/token` | Remove device token | Any |

## System Admin - School Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/admin/schools` | Create new school | System Admin |
| GET | `/api/admin/schools` | Get all schools (paginated) | System Admin |
| GET | `/api/admin/schools/{id}` | Get school by ID | System Admin |
| PUT | `/api/admin/schools/{id}` | Update school | System Admin |
| PATCH | `/api/admin/schools/{id}/status` | Update school status | System Admin |

## System Admin Management

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/admin/system-admins` | Create system admin | System Admin |
| GET | `/api/admin/system-admins` | Get all system admins | System Admin |
| GET | `/api/admin/system-admins/{id}` | Get system admin by ID | System Admin |
| PATCH | `/api/admin/system-admins/{id}/status` | Update status | System Admin |
| DELETE | `/api/admin/system-admins/{id}` | Delete system admin | System Admin |

## Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/public/schools/by-subdomain/{subdomain}` | Get school branding | No |

## Common Query Parameters

### Pagination
- `page` - Page number (0-based, default: 0)
- `size` - Page size (default: 20)

### Filtering
- `status` - Filter by status
- `role` - Filter by user role
- `search` - Text search
- `gradeLevel` - Filter students by grade
- `className` - Filter students by class

### Example with Query Parameters
```
GET /api/students?page=0&size=20&status=ACTIVE&gradeLevel=3&search=John
```

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## User Roles

- `SYSTEM_ADMIN` - Full system access
- `PRINCIPAL` - School-wide management
- `ASSISTANT_PRINCIPAL` - School-wide management
- `TEACHER` - View and limited management
- `PARENT` - View own children and related info

## Status Enums

### User Status
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### Student Status
- `ACTIVE`
- `INACTIVE`
- `TRANSFERRED`
- `GRADUATED`

### Bus Status
- `ACTIVE`
- `INACTIVE`
- `MAINTENANCE`

### School Status
- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### Message Type
- `DIRECT`
- `BROADCAST`

### Notification Type
- `EMERGENCY`
- `BUS_ALERT`
- `GENERAL`
- `SYSTEM`

### Route Type
- `PICKUP`
- `DROPOFF`

### Gender
- `MALE`
- `FEMALE`
- `OTHER`

### Device Type
- `ANDROID`
- `IOS`
- `WEB`

## Sample Request Bodies

### Login Request
```json
{
    "usernameOrEmail": "admin@edutrack.com",
    "password": "Admin@123",
    "schoolSubdomain": "demo-school"
}
```

### Create Student Request
```json
{
    "firstName": "Emma",
    "lastName": "Johnson",
    "dateOfBirth": "2015-05-15",
    "gender": "FEMALE",
    "gradeLevel": "3",
    "className": "3A",
    "enrollmentDate": "2024-09-01"
}
```

### Create Bus Request
```json
{
    "busNumber": "BUS-001",
    "licensePlate": "ABC1234",
    "capacity": 40,
    "driverName": "Mike Wilson",
    "driverPhone": "+1234567892"
}
```

### Update Bus Location Request
```json
{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 35.5,
    "heading": 90.0
}
```

### Send Message Request
```json
{
    "subject": "Parent-Teacher Meeting",
    "content": "Meeting scheduled for next week",
    "messageType": "BROADCAST",
    "recipientUserIds": [5, 6, 7],
    "priority": "NORMAL"
}
```

### Emergency Notification Request
```json
{
    "title": "Emergency Alert",
    "message": "School will be closed today",
    "notificationType": "EMERGENCY",
    "targetAudience": "ALL_PARENTS"
}
```

---

For detailed documentation, see `POSTMAN_COLLECTION_GUIDE.md`
