# EduTrack360 API Testing Scripts

This document contains test scripts that can be added to Postman requests for automated testing.

## Global Test Scripts

Add this to the Collection's Tests tab to run for all requests:

```javascript
// Log response time
console.log("Response time: " + pm.response.responseTime + "ms");

// Check response time is reasonable
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Check content type
pm.test("Content-Type is application/json", function () {
    pm.response.to.have.header("Content-Type");
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
```

## Login Endpoint Tests

```javascript
// Parse response
var jsonData = pm.response.json();

// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has success field", function () {
    pm.expect(jsonData).to.have.property('success');
});

pm.test("Login successful", function () {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response contains access token", function () {
    pm.expect(jsonData.data).to.have.property('accessToken');
});

pm.test("Response contains refresh token", function () {
    pm.expect(jsonData.data).to.have.property('refreshToken');
});

// Save tokens to variables
if (pm.response.code === 200 && jsonData.data) {
    pm.collectionVariables.set("access_token", jsonData.data.accessToken);
    pm.collectionVariables.set("refresh_token", jsonData.data.refreshToken);
    
    if (jsonData.data.user) {
        pm.collectionVariables.set("current_user_id", jsonData.data.user.id);
        pm.collectionVariables.set("current_user_role", jsonData.data.user.role);
    }
    
    console.log("✅ Tokens saved successfully");
}
```

## Create Resource Tests (POST)

```javascript
var jsonData = pm.response.json();

pm.test("Status code is 201 Created", function () {
    pm.response.to.have.status(201);
});

pm.test("Response indicates success", function () {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response contains data", function () {
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.not.be.null;
});

pm.test("Created resource has ID", function () {
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data.id).to.be.a('number');
});

// Save ID for later use
if (jsonData.data && jsonData.data.id) {
    // Save based on endpoint type
    var endpoint = pm.request.url.path.join('/');
    
    if (endpoint.includes('students')) {
        pm.collectionVariables.set("test_student_id", jsonData.data.id);
        console.log("✅ Student ID saved: " + jsonData.data.id);
    } else if (endpoint.includes('buses')) {
        pm.collectionVariables.set("test_bus_id", jsonData.data.id);
        console.log("✅ Bus ID saved: " + jsonData.data.id);
    } else if (endpoint.includes('users')) {
        pm.collectionVariables.set("test_user_id", jsonData.data.id);
        console.log("✅ User ID saved: " + jsonData.data.id);
    }
}
```

## Get Resource Tests (GET)

```javascript
var jsonData = pm.response.json();

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response indicates success", function () {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response contains data", function () {
    pm.expect(jsonData).to.have.property('data');
});

pm.test("Data is not null", function () {
    pm.expect(jsonData.data).to.not.be.null;
});
```

## Get List/Paginated Tests (GET)

```javascript
var jsonData = pm.response.json();

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response indicates success", function () {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response contains paginated data", function () {
    pm.expect(jsonData.data).to.have.property('content');
    pm.expect(jsonData.data).to.have.property('page');
    pm.expect(jsonData.data).to.have.property('size');
    pm.expect(jsonData.data).to.have.property('totalElements');
    pm.expect(jsonData.data).to.have.property('totalPages');
});

pm.test("Content is an array", function () {
    pm.expect(jsonData.data.content).to.be.an('array');
});

pm.test("Page number is correct", function () {
    var requestedPage = pm.request.url.query.get("page") || 0;
    pm.expect(jsonData.data.page).to.equal(parseInt(requestedPage));
});
```

## Update Resource Tests (PUT/PATCH)

```javascript
var jsonData = pm.response.json();

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response indicates success", function () {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Success message present", function () {
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.be.a('string');
});

pm.test("Updated data returned", function () {
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.not.be.null;
});
```

## Delete Resource Tests (DELETE)

```javascript
var jsonData = pm.response.json();

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response indicates success", function () {
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Success message present", function () {
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.include('deleted');
});
```

## Error Response Tests (401, 403, 404, etc.)

```javascript
var jsonData = pm.response.json();

pm.test("Response indicates failure", function () {
    pm.expect(jsonData.success).to.be.false;
});

pm.test("Error message present", function () {
    pm.expect(jsonData).to.have.property('message');
    pm.expect(jsonData.message).to.be.a('string');
});

// For 401 Unauthorized
if (pm.response.code === 401) {
    pm.test("Status code is 401 Unauthorized", function () {
        pm.response.to.have.status(401);
    });
    console.log("❌ Authentication required - Please login");
}

// For 403 Forbidden
if (pm.response.code === 403) {
    pm.test("Status code is 403 Forbidden", function () {
        pm.response.to.have.status(403);
    });
    console.log("❌ Insufficient permissions");
}

// For 404 Not Found
if (pm.response.code === 404) {
    pm.test("Status code is 404 Not Found", function () {
        pm.response.to.have.status(404);
    });
    console.log("❌ Resource not found");
}
```

## Pre-request Script Examples

### Generate Dynamic Data

```javascript
// Generate random email
var randomEmail = "test_" + Date.now() + "@example.com";
pm.collectionVariables.set("random_email", randomEmail);

// Generate random username
var randomUsername = "user_" + Date.now();
pm.collectionVariables.set("random_username", randomUsername);

// Generate random phone
var randomPhone = "+1" + Math.floor(Math.random() * 9000000000 + 1000000000);
pm.collectionVariables.set("random_phone", randomPhone);

// Current date
var currentDate = new Date().toISOString().split('T')[0];
pm.collectionVariables.set("current_date", currentDate);

console.log("Generated test data:");
console.log("Email: " + randomEmail);
console.log("Username: " + randomUsername);
console.log("Phone: " + randomPhone);
console.log("Date: " + currentDate);
```

### Check Token Expiration

```javascript
var token = pm.collectionVariables.get("access_token");

if (!token) {
    console.log("⚠️ No access token found. Please login first.");
} else {
    // Decode JWT token (basic decode, not validation)
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var payload = JSON.parse(atob(base64));
        
        var expirationTime = payload.exp * 1000; // Convert to milliseconds
        var currentTime = Date.now();
        var timeLeft = expirationTime - currentTime;
        
        if (timeLeft < 0) {
            console.log("⚠️ Token expired. Please refresh or login again.");
        } else {
            var minutesLeft = Math.floor(timeLeft / 60000);
            console.log("✅ Token valid for " + minutesLeft + " more minutes");
        }
    } catch (e) {
        console.log("⚠️ Could not decode token");
    }
}
```

## Complete Test Workflow Example

### 1. Login Test
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.response.to.have.status(200);
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.accessToken).to.exist;
    
    // Save tokens
    pm.collectionVariables.set("access_token", jsonData.data.accessToken);
    pm.collectionVariables.set("refresh_token", jsonData.data.refreshToken);
});
```

### 2. Create Student Test
```javascript
pm.test("Student created successfully", function () {
    var jsonData = pm.response.json();
    pm.response.to.have.status(201);
    pm.expect(jsonData.data.id).to.exist;
    
    // Save student ID for next requests
    pm.collectionVariables.set("created_student_id", jsonData.data.id);
});
```

### 3. Get Student Test
```javascript
pm.test("Retrieved student successfully", function () {
    var jsonData = pm.response.json();
    pm.response.to.have.status(200);
    
    var createdId = pm.collectionVariables.get("created_student_id");
    pm.expect(jsonData.data.id).to.equal(parseInt(createdId));
});
```

### 4. Update Student Test
```javascript
pm.test("Student updated successfully", function () {
    var jsonData = pm.response.json();
    pm.response.to.have.status(200);
    pm.expect(jsonData.message).to.include('updated');
});
```

### 5. Delete Relationship Test
```javascript
pm.test("Relationship deleted successfully", function () {
    var jsonData = pm.response.json();
    pm.response.to.have.status(200);
    pm.expect(jsonData.message).to.include('deleted');
});
```

## Running Tests

### Using Postman Runner

1. Select the collection or folder
2. Click "Run" button
3. Configure iterations and delay
4. Click "Run EduTrack360"
5. View results with pass/fail status

### Using Newman (CLI)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run EduTrack360_Postman_Collection.json -e EduTrack360_Dev_Environment.postman_environment.json

# Run with HTML report
newman run EduTrack360_Postman_Collection.json -e EduTrack360_Dev_Environment.postman_environment.json -r html

# Run specific folder
newman run EduTrack360_Postman_Collection.json --folder "Authentication"
```

## Best Practices

1. **Always test status code first**
2. **Check response structure before accessing properties**
3. **Save important IDs for dependent requests**
4. **Use meaningful test names**
5. **Add console.log for debugging**
6. **Clean up test data when possible**
7. **Use pre-request scripts for dynamic data**
8. **Group related tests in folders**

---

Happy Testing! 🎯
