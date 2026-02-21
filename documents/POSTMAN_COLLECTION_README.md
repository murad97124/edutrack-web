# 📬 EduTrack360 Postman Collection

Complete Postman collection for testing all EduTrack360 School Management System APIs.

## 📦 What's Included

1. **EduTrack360_Postman_Collection.json** - Complete API collection with 80+ endpoints
2. **EduTrack360_Dev_Environment.postman_environment.json** - Pre-configured development environment
3. **POSTMAN_COLLECTION_GUIDE.md** - Comprehensive usage guide
4. **API_QUICK_REFERENCE.md** - Quick reference for all endpoints
5. **POSTMAN_TEST_SCRIPTS.md** - Automated testing scripts

## 🚀 Quick Start

### Step 1: Import into Postman

1. Open Postman
2. Click **Import** button
3. Import these files:
   - `EduTrack360_Postman_Collection.json`
   - `EduTrack360_Dev_Environment.postman_environment.json`

### Step 2: Select Environment

1. Click the environment dropdown (top-right)
2. Select "EduTrack360 - Development"

### Step 3: Start the Application

```powershell
# Start the EduTrack360 application
.\start-app.ps1

# Or manually
mvn spring-boot:run
```

### Step 4: Test the API

1. Open **Authentication** → **Login**
2. Click **Send**
3. Tokens will be automatically saved
4. Test other endpoints!

## 📚 API Categories

The collection includes 12 main categories:

### 🔐 1. Authentication (5 endpoints)
- Login, Register, Refresh Token, Logout, Change Password

### 👥 2. Users (7 endpoints)
- User profile management, CRUD operations

### 🎓 3. Students (7 endpoints)
- Student management, parent relationships

### 🚌 4. Buses (10 endpoints)
- Bus management, routes, locations, assignments

### 👨‍👩‍👧 5. Parent (4 endpoints)
- Parent-specific views, bus tracking

### 💬 6. Messages (10 endpoints)
- School messaging system

### 🔔 7. Notifications (7 endpoints)
- Emergency alerts, push notifications

### 📊 8. Dashboard (2 endpoints)
- Statistics and analytics

### 📱 9. Device Tokens (2 endpoints)
- Push notification device management

### 🏫 10. System Admin - Schools (5 endpoints)
- School management for system admins

### 👔 11. System Admin Management (5 endpoints)
- System administrator management

### 🌐 12. Public (1 endpoint)
- Public endpoints (no auth required)

## 🔑 Default Credentials

### System Admin
- **Email**: `admin@edutrack.com`
- **Password**: `Admin@123`

### Test Principal
Create via System Admin endpoints

### Test Parent
Create via User Management endpoints

## 📖 Documentation

### For Detailed Usage
See **POSTMAN_COLLECTION_GUIDE.md** for:
- Step-by-step instructions
- Request/response examples
- Troubleshooting guide
- Testing scenarios

### For Quick Reference
See **API_QUICK_REFERENCE.md** for:
- Complete endpoint list
- HTTP methods and paths
- Required roles
- Sample payloads

### For Automated Testing
See **POSTMAN_TEST_SCRIPTS.md** for:
- Pre-built test scripts
- Newman CLI usage
- Test automation examples

## 🔄 Environment Variables

The environment includes these variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:8087` | API server URL |
| `access_token` | (auto-set) | JWT access token |
| `refresh_token` | (auto-set) | JWT refresh token |
| `school_subdomain` | `demo-school` | School subdomain |
| `system_admin_email` | `admin@edutrack.com` | Admin email |
| `system_admin_password` | `Admin@123` | Admin password |
| `test_student_id` | `1` | Test student ID |
| `test_bus_id` | `1` | Test bus ID |
| `test_user_id` | `1` | Test user ID |

## 🎯 Common Testing Workflows

### Workflow 1: Complete Student Setup
1. Login as Principal
2. Create Student
3. Create Parent User
4. Link Parent to Student
5. Assign Student to Bus

### Workflow 2: Emergency Communication
1. Login as Principal
2. Send Emergency Notification
3. Login as Parent
4. View Notifications
5. Acknowledge Alert

### Workflow 3: Bus Tracking
1. Create Bus
2. Create Route with Stops
3. Assign Students
4. Update Location (as driver)
5. Track Location (as parent)

## 🧪 Automated Testing

### Using Postman Runner
1. Select collection
2. Click **Run**
3. Configure iterations
4. Click **Run EduTrack360**

### Using Newman CLI
```bash
# Install Newman
npm install -g newman

# Run all tests
newman run EduTrack360_Postman_Collection.json \
  -e EduTrack360_Dev_Environment.postman_environment.json

# Run with HTML report
newman run EduTrack360_Postman_Collection.json \
  -e EduTrack360_Dev_Environment.postman_environment.json \
  -r html --reporter-html-export report.html
```

## 📝 Response Format

All APIs return responses in this format:

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { ... },
    "timestamp": "2024-02-21T10:30:00"
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description",
    "errors": ["Detailed errors"],
    "timestamp": "2024-02-21T10:30:00"
}
```

## 🔧 Troubleshooting

### Issue: 401 Unauthorized
**Solution**: Re-login to get fresh tokens

### Issue: 403 Forbidden
**Solution**: Check user role/permissions

### Issue: Connection Refused
**Solution**: Ensure application is running on port 8087

### Issue: Token Expired
**Solution**: Use Refresh Token endpoint or re-login

## 🌐 Additional Resources

- **Swagger UI**: http://localhost:8087/swagger-ui.html
- **OpenAPI Docs**: http://localhost:8087/v3/api-docs
- **H2 Console**: http://localhost:8087/h2-console (if H2 enabled)

## 📞 Support

For issues or questions:
1. Check the server logs
2. Verify database connection
3. Review the documentation files
4. Check API responses for error details

## 🎁 Features

✅ **80+ API Endpoints** - Complete coverage  
✅ **Auto Token Management** - Login saves tokens automatically  
✅ **Role-Based Testing** - Endpoints organized by role  
✅ **Sample Data** - Realistic request examples  
✅ **Environment Setup** - Pre-configured variables  
✅ **Test Scripts** - Automated testing support  
✅ **Documentation** - Comprehensive guides  
✅ **Quick Reference** - Fast endpoint lookup  

## 📄 Files Overview

```
EduTrack360/
├── EduTrack360_Postman_Collection.json          # Main collection
├── EduTrack360_Dev_Environment.postman_environment.json  # Environment
├── POSTMAN_COLLECTION_README.md                 # This file
├── POSTMAN_COLLECTION_GUIDE.md                  # Detailed guide
├── API_QUICK_REFERENCE.md                       # Endpoint reference
└── POSTMAN_TEST_SCRIPTS.md                      # Testing scripts
```

## 🚦 Getting Help

1. **First Time User?** → Read `POSTMAN_COLLECTION_GUIDE.md`
2. **Need an Endpoint?** → Check `API_QUICK_REFERENCE.md`
3. **Want to Automate?** → See `POSTMAN_TEST_SCRIPTS.md`
4. **Quick Overview?** → You're reading it!

---

**Happy Testing! 🎉**

Made with ❤️ for EduTrack360
