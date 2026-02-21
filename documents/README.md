# EduTrack360 Backend API

## Overview

EduTrack360 is a comprehensive school management platform backend built with Java 21 and Spring Boot 3. This system provides RESTful APIs for managing schools, users, students, buses, notifications, and communications.

## Technology Stack

- **Java 21**
- **Spring Boot 3.5.10**
- **Spring Security with JWT**
- **Spring Data JPA**
- **WebSocket (STOMP over SockJS)**
- **MySQL 8.0+ / H2 (Development)**
- **Lombok**
- **OpenAPI/Swagger**

## Getting Started

### Prerequisites

- Java 21 or higher
- Maven 3.8+
- MySQL 8.0+ (for production)

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run with Maven:

```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### API Documentation

Access Swagger UI at: `http://localhost:8080/swagger-ui.html`

Access OpenAPI JSON at: `http://localhost:8080/v3/api-docs`

### 📬 Postman Collection

A comprehensive Postman collection is available for testing all APIs:

- **Collection File:** `EduTrack360_Postman_Collection.json`
- **Environment File:** `EduTrack360_Dev_Environment.postman_environment.json`
- **Quick Start:** See `POSTMAN_COLLECTION_README.md`
- **Detailed Guide:** See `POSTMAN_COLLECTION_GUIDE.md`
- **API Reference:** See `API_QUICK_REFERENCE.md`

Import the collection into Postman and start testing immediately with pre-configured requests for all 80+ endpoints!

## Default Test Credentials

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| System Admin | sysadmin | admin123 | Platform administrator |
| Principal | principal | principal123 | School principal |
| Asst. Principal | asstprincipal | assistant123 | Assistant principal |
| Teacher | teacher1 | teacher123 | Teacher account |
| Parent | parent1 | parent123 | Parent account |

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### Public Endpoints (`/api/public`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/schools/by-subdomain/{subdomain}` | Get school branding |

### System Admin - Schools (`/api/admin/schools`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/admin/schools` | Create new school | SYSTEM_ADMIN |
| GET | `/api/admin/schools` | List all schools | SYSTEM_ADMIN |
| GET | `/api/admin/schools/{id}` | Get school by ID | SYSTEM_ADMIN |
| PUT | `/api/admin/schools/{id}` | Update school | SYSTEM_ADMIN |
| PATCH | `/api/admin/schools/{id}/status` | Update school status | SYSTEM_ADMIN |

### Users (`/api/users`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Get current user | All |
| PUT | `/api/users/me` | Update profile | All |
| GET | `/api/users` | List users | PRINCIPAL, ASST_PRINCIPAL |
| POST | `/api/users` | Create user | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/users/{id}` | Get user by ID | PRINCIPAL, ASST_PRINCIPAL |
| PUT | `/api/users/{id}` | Update user | PRINCIPAL, ASST_PRINCIPAL |
| PATCH | `/api/users/{id}/status` | Update user status | PRINCIPAL, ASST_PRINCIPAL |

### Students (`/api/students`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/students` | Create student | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/students` | List students | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| GET | `/api/students/{id}` | Get student by ID | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| PUT | `/api/students/{id}` | Update student | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/students/{id}/parents` | Get student's parents | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| POST | `/api/students/relationships` | Link parent to student | PRINCIPAL, ASST_PRINCIPAL |
| DELETE | `/api/students/relationships/{id}` | Remove relationship | PRINCIPAL, ASST_PRINCIPAL |

### Buses (`/api/buses`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/buses` | Create bus | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/buses` | List buses | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| GET | `/api/buses/{id}` | Get bus by ID | All |
| PUT | `/api/buses/{id}` | Update bus | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/buses/{id}/location` | Get current location | All |
| POST | `/api/buses/{id}/location` | Update location | All |
| GET | `/api/buses/{id}/route` | Get bus routes | All |
| POST | `/api/buses/routes` | Create route | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/buses/{id}/assignments` | Get student assignments | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| POST | `/api/buses/assignments` | Assign student to bus | PRINCIPAL, ASST_PRINCIPAL |

### Notifications (`/api/notifications`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/notifications/emergency` | Send emergency notification | PRINCIPAL, ASST_PRINCIPAL |
| POST | `/api/notifications/bus/{busId}/broadcast` | Broadcast to bus parents | PRINCIPAL, ASST_PRINCIPAL |
| GET | `/api/notifications/my-notifications` | Get user's notifications | All |
| GET | `/api/notifications/unread` | Get unread notifications | All |
| GET | `/api/notifications/unread/count` | Get unread count | All |
| PATCH | `/api/notifications/{id}/read` | Mark as read | All |
| PATCH | `/api/notifications/{id}/acknowledge` | Acknowledge notification | All |

### Messages (`/api/messages`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/messages/send` | Send message | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| GET | `/api/messages/inbox` | Get inbox | All |
| GET | `/api/messages/sent` | Get sent messages | All |
| GET | `/api/messages/unread` | Get unread messages | All |
| GET | `/api/messages/unread/count` | Get unread count | All |
| GET | `/api/messages/{id}` | Get message by ID | All |
| PATCH | `/api/messages/{id}/mark-read` | Mark as read | All |
| POST | `/api/messages/{id}/reply` | Reply to message | All |
| GET | `/api/messages/{id}/replies` | Get message replies | All |
| GET | `/api/messages/search` | Search messages | PRINCIPAL, ASST_PRINCIPAL |

### Parent Endpoints (`/api/parent`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/parent/students` | Get parent's children | PARENT |
| GET | `/api/parent/students/{studentId}/bus` | Get student's bus assignment | PARENT |
| GET | `/api/parent/buses/{busId}/location` | Track bus location | PARENT |
| GET | `/api/parent/buses/{busId}/route` | Get bus route | PARENT |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/dashboard/school` | Get school stats | PRINCIPAL, ASST_PRINCIPAL, TEACHER |
| GET | `/api/dashboard/parent` | Get parent stats | PARENT |

### Device Tokens (`/api/devices`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/devices/register-token` | Register device for push | All |
| DELETE | `/api/devices/token` | Remove device token | All |

## WebSocket Endpoints

### Bus Tracking

- **Connect:** `ws://localhost:8080/ws`
- **Subscribe:** `/topic/bus/{busId}/location`
- **Send Location:** `/app/buses/{busId}/location`

### Notifications

- **Subscribe (User):** `/user/queue/notifications`

### Messages

- **Subscribe (User):** `/user/queue/messages`
- **Subscribe (Replies):** `/user/queue/replies`

## Database Configuration

### Development (H2)

Default configuration uses H2 in-memory database.

Access H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:edutrack`
- Username: `sa`
- Password: (empty)

### Production (MySQL)

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edutrack?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

## Security

- JWT-based stateless authentication
- Access token expiration: 15 minutes
- Refresh token expiration: 7 days
- BCrypt password hashing
- Role-based access control (RBAC)

## Project Structure

```
src/main/java/com/edutrack/edutrack/
├── config/           # Configuration classes
├── controller/       # REST Controllers
├── dto/
│   ├── request/      # Request DTOs
│   └── response/     # Response DTOs
├── entity/
│   └── enums/        # Enum types
├── exception/        # Custom exceptions
├── repository/       # JPA Repositories
├── security/         # Security components
└── service/          # Business logic
```

## License

Proprietary - EduTrack360 © 2026

