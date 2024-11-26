# eduai-user-service
.
## **General Overview**

### 1. **Service Purposes**

The service is designed to:

- Manage users within an application, allowing operations such as adding, retrieving, updating, and deleting user data.
- Handle fine-grained operations such as updating specific user details (e.g., notification settings, profile images).
- Provide scalable and secure APIs for user management.
- Support advanced notification settings and flexible user profile management.

### 2. **High-Level Architecture**

- **Client Layer:** RESTful API endpoints handle incoming HTTP requests and responses.
- **Service Layer:** Contains business logic for handling user-related operations, delegating database tasks to the repository layer.
- **Repository Layer:** Interfaces with the database to execute CRUD operations and manage persistence.
- **Database Layer:** Stores structured data, including user profiles, notification settings, and metadata.

### 3. **Tech Stack**

- **Backend Framework:** Node.js with Express.
- **Database:** MongoDB for data persistence.
- **Authentication:** superToken done by haj (**not applied yet on user service**).
- **Message Broker:** RabbitMQ or Kafka for handling asynchronous operations (**not yet** ).
- **Other Tools:** Mongoose for MongoDB ODM, bcrypt for password hashing.

---

## **API Documentation**

### 1. **List of Endpoints**

| HTTP Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/signup` | Creates a new user account with email and password. |
| GET | `/users` | Retrieves all users. |
| GET | `/users/:id` | Retrieves a specific user by their ID. |
| DELETE | `/users/:id` | Deletes a specific user by their ID. |
| PUT | `/users/:id` | Updates general user details provided in the request body. |
| PUT | `/users/:id/details` | Updates specific user fields such as address, phone, or birthday. |
| GET | `/users/:id/notification-settings` | Retrieves all notification settings for a user. |
| PUT | `/users/:id/notification-settings` | Updates notification settings for a user. |
| GET | `/users/:id/notification-settings/:field` | Retrieves a specific field of notification settings for a user. |
| PUT | `/users/:id/notification-settings/:field` | Updates a specific field in a user's notification settings. |
| PUT | `/users/:id/profile-image` | Updates the profile image URL for a user. |

---

### 2. **Authorization and Authentication**

- **Authentication:**
    - not yet
- **Authorization:**
    - not yet

---

## **Internal Architecture**

### 1. **Classes**

- **Service Classes:** Handle business logic (`UserService`).
- **Repository Classes:** Directly interact with MongoDB (`UserRepository`,).
- **DTOs:** Manage data transfer between layers (`Usermodel`).
note : all these files called user you can find them by path like (repository/user)

### 2. **Data Flow**

1. **Request:** API receives a client request.
2. **Validation:** Middleware validates inputs and JWT tokens. (notyet))
3. **Service Layer:** Business logic processes the request.
4. **Repository Layer:** Executes database operations.
5. **Response:** Processed data is formatted and returned to the client.

### 3. **Message Broker (not yet)**

- Handles asynchronous tasks such as:
    - Sending notification emails.
    - Logging audit events.

---

## **Database and Storage**

### 1. **Database Schema**

- **Users Table:**
    - `user_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `birthday`, `address_line_1`, `address_line_2`, `state`, `country`, `created_at`, `updated_at`.
- **Notification Settings Table:**
    - `user_id`, `notifications_enabled`, `email_notifications`, `sms_notifications`, `push_notifications`.

### 2. **Data Access and Persistence**

- Mongoose is used to interact with MongoDB for CRUD operations.
- Repository layer ensures separation of concerns between the service logic and database operations.

### 3. **Backup and Recovery**

- Automated backups using MongoDB Atlas or cron jobs.
- Recovery plans include restoring from the latest backup in case of data corruption.

---

## **Deployment and Infrastructure (not yet)**

### 1. **Deployment Process**

- Code is pushed to a CI/CD pipeline (e.g., GitHub Actions or Jenkins).
- Docker containers deploy the service to a cloud platform (e.g., AWS, Azure, or GCP).
- Load balancers distribute traffic across instances.

### 2. **Scaling**

- Horizontal scaling via container orchestration (Kubernetes).
- Database scaling using read replicas and sharding.

---

## **Security**

- Passwords are hashed using bcrypt.
- JWT ensures secure stateless authentication.
- Role-based access control (RBAC) manages user permissions.
- Input validation and sanitation prevent SQL/NoSQL injection attacks.

---

## **Fault Tolerance**

- Retry mechanisms in API calls.
- Graceful error handling with appropriate HTTP status codes.
- Circuit breakers for dependent services to avoid cascading failures.

---

## **Testing Approach**

- Unit Tests: Verify individual functions/classes.
- Integration Tests: Ensure the service works with external systems (e.g., database, message broker).
- E2E Tests: Validate the complete user journey.

---

## **Versioning**

- Follows semantic versioning (e.g., `v1.0.0`).
- API versioning through URL paths (e.g., `/api/v1/users`).

---

## **Dependencies**

- **bcrypt:** Password hashing.
- **jsonwebtoken:** JWT handling.
- **Mongoose:** MongoDB object modeling.
- **Express:** API framework.
- **Message Broker (RabbitMQ/Kafka):** Asynchronous processing.(not used yet)

no of yet in the doc = 6 yets 🙂
