# 🗺️ EduTrack360 Postman Collection - Navigation Guide

## 🎯 Start Here

**New to this collection?** → Read this file first, then proceed based on your needs.

## 📁 File Structure

```
📦 EduTrack360 Postman Collection
│
├── 🔴 CORE FILES (Import These)
│   ├── EduTrack360_Postman_Collection.json ⭐ IMPORT FIRST
│   └── EduTrack360_Dev_Environment.postman_environment.json ⭐ IMPORT SECOND
│
└── 📘 DOCUMENTATION (Read as Needed)
    ├── 📄 POSTMAN_COLLECTION_README.md ⭐ START HERE
    ├── 📄 POSTMAN_COLLECTION_GUIDE.md
    ├── 📄 API_QUICK_REFERENCE.md
    ├── 📄 POSTMAN_TEST_SCRIPTS.md
    ├── 📄 POSTMAN_CHANGELOG.md
    └── 📄 POSTMAN_COLLECTION_SUMMARY.md
```

## 🚦 Choose Your Path

### Path 1: I Just Want to Test APIs Quickly ⚡
1. Import `EduTrack360_Postman_Collection.json`
2. Import `EduTrack360_Dev_Environment.postman_environment.json`
3. Select the environment in Postman
4. Open **Authentication** → **Login** and click Send
5. Start testing other endpoints!

**Estimated Time:** 2 minutes

---

### Path 2: I Want to Understand Everything 📚
1. Read `POSTMAN_COLLECTION_README.md` (Overview)
2. Read `POSTMAN_COLLECTION_GUIDE.md` (Detailed Guide)
3. Import the collection and environment
4. Follow the guide step-by-step
5. Refer to `API_QUICK_REFERENCE.md` when needed

**Estimated Time:** 20 minutes

---

### Path 3: I Need a Specific Endpoint 🔍
1. Open `API_QUICK_REFERENCE.md`
2. Find your endpoint in the table
3. Note the HTTP method and required role
4. Open that endpoint in the collection
5. Update the request body if needed
6. Send the request

**Estimated Time:** 1 minute per endpoint

---

### Path 4: I Want to Automate Testing 🤖
1. Read `POSTMAN_TEST_SCRIPTS.md`
2. Copy relevant test scripts
3. Add scripts to your requests or collection
4. Run using Postman Runner or Newman CLI
5. Review test results

**Estimated Time:** 15 minutes setup

---

### Path 5: I'm Troubleshooting Issues 🔧
1. Check `POSTMAN_COLLECTION_GUIDE.md` → Troubleshooting section
2. Verify your environment variables
3. Check if the application is running
4. Review the error response
5. Consult the API_QUICK_REFERENCE for correct format

**Estimated Time:** 5-10 minutes

---

## 📖 Documentation Guide

| File | When to Read | What's Inside |
|------|--------------|---------------|
| **POSTMAN_COLLECTION_README.md** | First time using | Quick start, features, overview |
| **POSTMAN_COLLECTION_GUIDE.md** | Need detailed help | Complete guide, examples, troubleshooting |
| **API_QUICK_REFERENCE.md** | Looking for endpoint | All endpoints, methods, roles |
| **POSTMAN_TEST_SCRIPTS.md** | Want automation | Test scripts, Newman usage |
| **POSTMAN_CHANGELOG.md** | Track changes | Version history, updates |
| **POSTMAN_COLLECTION_SUMMARY.md** | Need statistics | Metrics, charts, coverage |

## 🎯 Common Questions

### ❓ How do I import the collection?
1. Open Postman
2. Click "Import" button
3. Select the JSON files
4. Done!

See: `POSTMAN_COLLECTION_README.md` → Quick Start

---

### ❓ How do I login?
1. Open **Authentication** → **Login**
2. Click "Send"
3. Tokens are auto-saved

See: `POSTMAN_COLLECTION_GUIDE.md` → Getting Started → Step 2

---

### ❓ What are the default credentials?
- **Email:** `admin@edutrack.com`
- **Password:** `Admin@123`

See: `POSTMAN_COLLECTION_README.md` → Default Credentials

---

### ❓ How do I find a specific endpoint?
Open `API_QUICK_REFERENCE.md` and search for your endpoint.

---

### ❓ I'm getting 401 Unauthorized
You need to login first. Tokens expire after 15 minutes.

See: `POSTMAN_COLLECTION_GUIDE.md` → Troubleshooting

---

### ❓ I'm getting 403 Forbidden
Check if your user role has permission for that endpoint.

See: `API_QUICK_REFERENCE.md` → Check the "Required Role" column

---

### ❓ How do I add automated tests?
Copy scripts from `POSTMAN_TEST_SCRIPTS.md` and add to your requests.

---

### ❓ Can I use this for CI/CD?
Yes! Use Newman CLI.

See: `POSTMAN_TEST_SCRIPTS.md` → Using Newman (CLI)

---

### ❓ How do I track a bus?
1. Login as Parent
2. Go to **Parent** → **Track Bus Location**
3. Update the busId parameter
4. Send request

See: `POSTMAN_COLLECTION_GUIDE.md` → Testing Scenarios → Bus Tracking

---

### ❓ What's the difference between the files?
- **Collection JSON** = The actual API requests
- **Environment JSON** = Variables like URL, tokens
- **Documentation MD** = Help files

---

## 🎓 Learning Resources

### For Beginners
```
1. POSTMAN_COLLECTION_README.md (5 min)
2. Try the Login endpoint (1 min)
3. Try 2-3 more endpoints (5 min)
4. Read API_QUICK_REFERENCE.md (10 min)
```
**Total Time:** 20 minutes

### For Advanced Users
```
1. Import collection (1 min)
2. Skim POSTMAN_COLLECTION_GUIDE.md (5 min)
3. Setup automated tests (15 min)
4. Integrate with CI/CD (30 min)
```
**Total Time:** 50 minutes

### For Developers
```
1. Review API_QUICK_REFERENCE.md
2. Test all endpoints for your feature
3. Add custom test scripts
4. Document any issues
```

## 📊 Collection Statistics

| Category | Count |
|----------|-------|
| Total Endpoints | 80+ |
| API Categories | 12 |
| User Roles | 5 |
| Documentation Files | 6 |
| Environment Variables | 9 |

## 🎨 API Categories Overview

1. **Authentication** - Login, register, tokens
2. **Users** - User management
3. **Students** - Student management
4. **Buses** - Fleet, routes, tracking
5. **Parent** - Parent-specific views
6. **Messages** - School messaging
7. **Notifications** - Alerts, broadcasts
8. **Dashboard** - Statistics
9. **Device Tokens** - Push notifications
10. **System Admin - Schools** - School management
11. **System Admin Management** - Admin accounts
12. **Public** - Public endpoints

## 🔗 Quick Links

### Essential Reading
- [Quick Start](POSTMAN_COLLECTION_README.md#-quick-start)
- [Default Credentials](POSTMAN_COLLECTION_README.md#-default-credentials)
- [Troubleshooting](POSTMAN_COLLECTION_GUIDE.md#-troubleshooting)

### Reference
- [All Endpoints](API_QUICK_REFERENCE.md)
- [Request Examples](POSTMAN_COLLECTION_GUIDE.md#-request-examples)
- [Response Format](POSTMAN_COLLECTION_GUIDE.md#-response-structure)

### Advanced
- [Test Scripts](POSTMAN_TEST_SCRIPTS.md)
- [Newman CLI](POSTMAN_TEST_SCRIPTS.md#using-newman-cli)
- [Test Workflows](POSTMAN_TEST_SCRIPTS.md#complete-test-workflow-example)

## 💡 Pro Tips

1. **Import Environment First** - Set variables before testing
2. **Login First** - Most endpoints need authentication
3. **Check Role Requirements** - Use API_QUICK_REFERENCE.md
4. **Use Variables** - Don't hardcode IDs
5. **Save Important IDs** - Use test scripts to auto-save
6. **Check Server** - Ensure app is running on port 8087
7. **Read Error Messages** - They're usually helpful
8. **Use Swagger Too** - Great for exploring: http://localhost:8087/swagger-ui.html

## 🆘 Need Help?

### Check These First
1. Is the application running?
2. Did you import the environment?
3. Did you select the environment?
4. Are you logged in?
5. Does your role have permission?

### Then Consult
1. [Troubleshooting Guide](POSTMAN_COLLECTION_GUIDE.md#-troubleshooting)
2. [API Reference](API_QUICK_REFERENCE.md)
3. Server logs
4. Error response message

## 🎉 You're Ready!

Choose your path above and start testing. Everything you need is in these files.

---

## 📌 Quick Reference Card

```
┌─────────────────────────────────────────┐
│  EduTrack360 API - Quick Reference      │
├─────────────────────────────────────────┤
│  Base URL: http://localhost:8087        │
│  Login: POST /api/auth/login            │
│  Default User: admin@edutrack.com       │
│  Default Pass: Admin@123                │
│  Swagger: /swagger-ui.html              │
│  Token Expiry: 15 minutes               │
└─────────────────────────────────────────┘
```

---

**Happy Testing! 🚀**

*Last Updated: February 21, 2024*
