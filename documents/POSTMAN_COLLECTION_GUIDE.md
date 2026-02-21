# EduTrack360 Postman Collection Guide

This guide will help you use the Postman collection for testing all EduTrack360 APIs.

## 📦 Import Collection

1. Open Postman
2. Click **Import** button
3. Select `EduTrack360_Postman_Collection.json`
4. The collection will be imported with all endpoints organized by category

## 🔧 Configuration

### Collection Variables

The collection uses the following variables that you can customize:

- **base_url**: `http://localhost:8087` (default server URL)
- **access_token**: Auto-populated after login
- **refresh_token**: Auto-populated after login
- **school_subdomain**: `demo-school` (change to your school's subdomain)

### How to Update Variables

1. Right-click on the collection
2. Select **Edit**
3. Go to **Variables** tab
4. Update the values as needed

## 🚀 Getting Started

### Step 1: Start the Application

Make sure your EduTrack360 application is running:

```powershell
# Using the provided script
.\start-app.ps1

# Or manually
mvn spring-boot:run
```

The application should be running on `http://localhost:8087`

### Step 2: Login

1. Go to **Authentication** → **Login**
2. Update the request body with valid credentials:
   ```json
   {
       "usernameOrEmail": "admin@edutrack.com",
       "password": "Admin@123",
       "schoolSubdomain": "demo-school"
   }
   ```
3. Click **Send**
4. The `access_token` and `refresh_token` will be automatically saved to collection variables

### Step 3: Test Other Endpoints

All other endpoints (except Public endpoints) require authentication. The collection is configured to automatically use the `access_token` from the login response.

## 📚 API Categories

### 1. Authentication
- **Login**: Authenticate and get JWT tokens
- **Register**: Create new user account
- **Refresh Token**: Get new access token
- **Logout**: Invalidate session
- **Change Password**: Update user password

### 2. Users
- **Get Current User**: Get logged-in user profile
- **Update Current User**: Update profile
- **Get All Users**: List users (Admin only)
- **Create User**: Add new user (Admin only)
- **Get/Update User by ID**: Manage specific user
- **Update User Status**: Activate/deactivate users

### 3. Students
- **Create Student**: Add new student
- **Get All Students**: List students with filters
- **Get/Update Student by ID**: Manage student details
- **Get Student Parents**: View parent relationships
- **Create/Delete Parent-Student Relationship**: Manage family connections

### 4. Buses
- **Create/Update Bus**: Manage bus fleet
- **Get All Buses**: List all buses
- **Get/Update Bus Location**: Track real-time location
- **Get/Create Bus Routes**: Manage routes and stops
- **Get/Create Bus Assignments**: Assign students to buses

### 5. Parent
Parent-specific endpoints for accessing child information:
- **Get My Children**: View all children
- **Get Student Bus Assignment**: Check child's bus details
- **Track Bus Location**: Real-time bus tracking
- **Get Bus Route**: View bus route and stops

### 6. Messages
School messaging system:
- **Send Message**: Direct or broadcast messages
- **Get Inbox/Sent/Unread**: Manage messages
- **Reply to Message**: Respond to messages
- **Mark as Read**: Update message status
- **Search Messages**: Find specific messages

### 7. Notifications
Push notification system:
- **Send Emergency Notification**: Alert all parents
- **Broadcast to Bus Parents**: Notify specific bus parents
- **Get My Notifications**: View notifications
- **Mark as Read/Acknowledge**: Update notification status
- **Get Unread Count**: Check pending notifications

### 8. Dashboard
- **Get School Dashboard Stats**: Admin dashboard data
- **Get Parent Dashboard Stats**: Parent dashboard data

### 9. Device Tokens
For mobile push notifications:
- **Register Device Token**: Register mobile device
- **Remove Device Token**: Unregister device

### 10. System Admin - Schools
System administrator school management:
- **Create School**: Add new school with principal
- **Get All Schools**: List all schools
- **Update School**: Modify school details
- **Update School Status**: Activate/suspend schools

### 11. System Admin Management
Manage system administrators:
- **Create System Admin**: Add new admin
- **Get All System Admins**: List admins
- **Update Status**: Activate/deactivate admins
- **Delete System Admin**: Remove admin

### 12. Public
No authentication required:
- **Get School Branding by Subdomain**: Public school information

## 🔐 Authentication & Authorization

### Token Management

The collection automatically handles token management:

1. **Login** request saves tokens to variables
2. All authenticated requests use the `access_token`
3. Use **Refresh Token** when access token expires

### Role-Based Access

Different roles have different permissions:

- **SYSTEM_ADMIN**: Full system access
- **PRINCIPAL**: School-wide management
- **ASSISTANT_PRINCIPAL**: School-wide management
- **TEACHER**: View and limited management
- **PARENT**: View own children and related info

## 📝 Request Examples

### Creating a Student

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

### Creating a Bus

```json
{
    "busNumber": "BUS-001",
    "licensePlate": "ABC1234",
    "capacity": 40,
    "driverName": "Mike Wilson",
    "driverPhone": "+1234567892"
}
```

### Sending a Message

```json
{
    "subject": "Parent-Teacher Meeting",
    "content": "Dear parents, we have scheduled a parent-teacher meeting next week.",
    "messageType": "BROADCAST",
    "recipientUserIds": [5, 6, 7],
    "priority": "NORMAL"
}
```

### Creating a Bus Route

```json
{
    "busId": 1,
    "routeName": "Morning Route A",
    "routeType": "PICKUP",
    "startTime": "07:00:00",
    "endTime": "08:30:00",
    "stops": [
        {
            "stopName": "Main Street",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "stopOrder": 1,
            "arrivalTime": "07:15:00"
        },
        {
            "stopName": "Park Avenue",
            "latitude": 40.7580,
            "longitude": -73.9855,
            "stopOrder": 2,
            "arrivalTime": "07:30:00"
        }
    ]
}
```

## 🔍 Query Parameters

Many endpoints support pagination and filtering:

### Pagination
- `page`: Page number (0-based)
- `size`: Items per page (default: 20)

### Common Filters
- `status`: Filter by status (ACTIVE, INACTIVE, etc.)
- `search`: Text search
- `role`: Filter by user role
- `gradeLevel`: Filter students by grade
- `className`: Filter students by class

### Example
```
GET {{base_url}}/api/students?page=0&size=20&status=ACTIVE&gradeLevel=3&search=John
```

## 🎯 Testing Scenarios

### Scenario 1: Complete Student Onboarding

1. **Create User** (Parent account)
2. **Create Student**
3. **Create Parent-Student Relationship**
4. **Assign Student to Bus**

### Scenario 2: Emergency Alert Flow

1. **Login** as Principal
2. **Send Emergency Notification**
3. **Login** as Parent
4. **Get My Notifications**
5. **Acknowledge Notification**

### Scenario 3: Bus Tracking

1. **Create Bus**
2. **Create Bus Route**
3. **Assign Students to Bus**
4. **Update Bus Location** (simulate driver app)
5. **Track Bus Location** (as parent)

## 🐛 Troubleshooting

### Issue: 401 Unauthorized

**Solution**: 
- Re-login to get fresh tokens
- Check if token has expired
- Use Refresh Token endpoint

### Issue: 403 Forbidden

**Solution**:
- Check user role/permissions
- Ensure you're logged in with correct role for the endpoint

### Issue: 404 Not Found

**Solution**:
- Verify the resource ID exists
- Check if the base_url is correct

### Issue: 400 Bad Request

**Solution**:
- Verify request body format
- Check required fields
- Validate data types

## 📊 Response Structure

All API responses follow this structure:

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { /* response data */ },
    "timestamp": "2024-02-21T10:30:00"
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description",
    "errors": ["Detailed error messages"],
    "timestamp": "2024-02-21T10:30:00"
}
```

### Paginated Response
```json
{
    "success": true,
    "data": {
        "content": [ /* array of items */ ],
        "page": 0,
        "size": 20,
        "totalElements": 100,
        "totalPages": 5,
        "last": false
    }
}
```

## 🔄 Environment Setup (Optional)

You can create multiple environments for different deployments:

### Development Environment
- base_url: `http://localhost:8087`
- school_subdomain: `demo-school`

### Staging Environment
- base_url: `https://staging.edutrack360.com`
- school_subdomain: `staging-school`

### Production Environment
- base_url: `https://api.edutrack360.com`
- school_subdomain: `your-school`

## 📖 Additional Resources

- **API Documentation**: Access Swagger UI at `http://localhost:8087/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8087/v3/api-docs`
- **Project Documentation**: See `docs/EduTrack360_Documentation.md`

## 💡 Tips

1. **Use Environments**: Create separate environments for dev, staging, and prod
2. **Save Responses**: Use Postman's example feature to save sample responses
3. **Test Scripts**: Add test scripts to automate validation
4. **Pre-request Scripts**: Add scripts for dynamic data generation
5. **Collections Runner**: Use runner to test multiple requests in sequence
6. **Monitor**: Set up monitors for continuous API testing

## 🤝 Support

If you encounter any issues:
1. Check the server logs
2. Verify database connection
3. Ensure all required services are running
4. Check the API documentation

---

**Happy Testing! 🚀**
