
---

# 2. `docs/architecture/system-architecture.md`

```md
# NBU Portal System Architecture Specification

## 1. Document Purpose

This document defines the formal architecture for the Nigerian British University (NBU) Portal System.

It serves as the reference for:

- system design
- development planning
- module boundaries
- workflow implementation
- deployment strategy
- future extensibility decisions

---

## 2. System Vision

The NBU Portal System is a unified digital platform for managing university academic and administrative workflows across students, staff, and administrators.

The platform must:

- centralize key academic operations
- support role-based and workflow-based approvals
- remain modular and extensible
- deploy efficiently through GitHub and Vercel
- maintain security, traceability, and operational reliability

---

## 3. Architecture Style

The system shall use a **modular monolith** architecture.

### Rationale

This architecture is selected because it provides:

- rapid MVP delivery
- simpler deployment
- strong internal organization
- lower operational complexity than microservices
- easier refactoring and extension as the platform grows

The system will be implemented as a **single Next.js application** with internal domain modules.

---

## 4. Architectural Principles

### 4.1 Single Codebase
The application shall use one repository and one deployable application in the MVP and early production stages.

### 4.2 Modular by Business Domain
Code organization shall follow business capabilities, not only technical layers.

### 4.3 Server-First Business Logic
Sensitive workflows and permission checks shall run on the server.

### 4.4 Workflow-Aware Access Control
Protected actions shall require both:
- valid role/permission
- valid workflow state

### 4.5 Configuration Over Hardcoding
Academic rules and operational settings shall be configurable.

### 4.6 Secure and Auditable Design
Critical actions shall be logged and sensitive files shall be stored securely.

---

## 5. High-Level Architecture

### 5.1 Presentation Layer
Implemented using Next.js App Router.

Responsibilities:
- route handling
- dashboard layouts
- forms and interactive pages
- role-specific views
- responsive UI rendering

### 5.2 Application Layer
Implemented using:
- server actions
- route handlers
- application services

Responsibilities:
- orchestrating workflows
- validating requests
- enforcing rules
- coordinating domain modules

### 5.3 Domain Layer
Organized into domain modules such as:
- auth
- users
- students
- staff
- academics
- courses
- assignments
- registration
- results
- payments
- notifications
- files
- audit
- reporting
- settings

### 5.4 Data Layer
Implemented with:
- PostgreSQL
- Prisma ORM

Responsibilities:
- persistence
- relational integrity
- migrations
- typed data access

### 5.5 Infrastructure Layer
Implemented through:
- Vercel
- GitHub
- object/blob storage
- email provider
- environment configuration
- logging/monitoring

---

## 6. Technology Specification

| Layer | Technology | Purpose |
|---|---|---|
| App | Next.js | Full-stack web platform |
| Language | TypeScript | Typed development |
| Styling | Tailwind CSS | UI styling |
| Database | PostgreSQL | System of record |
| ORM | Prisma | Schema and data access |
| Authentication | Session-based auth + Argon2 | Secure login |
| Authorization | Internal permission helpers | Role/action enforcement |
| File Storage | Private blob/object storage | Secure file handling |
| Email | Resend / SendGrid / SES | Notifications |
| Hosting | Vercel | Deployment and preview environments |
| Source Control | GitHub | Version control and workflow |

---

## 7. Users and Roles

The initial supported roles are:

- Super Admin
- Dean
- HOD
- Course Adviser
- Lecturer
- Student

These roles define high-level access boundaries, but actual actions must also be constrained by workflow state and organizational scope.

Examples:
- faculty scope
- department scope
- assigned course scope
- assigned adviser scope
- active academic session scope

---

## 8. Core Domain Model

### 8.1 Identity and Users
- User
- Role
- UserRole
- StudentProfile
- StaffProfile

### 8.2 Academic Master Data
- Faculty
- Department
- Programme
- Level
- AcademicSession
- Semester
- GradingScale
- RegistrationWindow

### 8.3 Academic Operations
- Course
- CourseOffering
- CourseAssignment
- AdviserAssignment
- StudentProgrammeEnrollment
- CourseRegistration
- CourseRegistrationItem

### 8.4 Results
- ResultSheet
- ResultEntry
- GPARecord
- CGPARecord
- ResultApprovalAction

### 8.5 Communication and Finance
- Notification
- EmailDeliveryLog
- PaymentVerification

### 8.6 Audit and Files
- FileAsset
- AuditLog
- WorkflowAction
- SystemSetting
- FeatureFlagOverride

---

## 9. Workflow Model

### 9.1 Course Registration Workflow
Possible states:
- Draft
- Submitted
- Adviser Reviewed
- HOD Reviewed
- Dean Reviewed
- Approved
- Rejected
- Locked

### 9.2 Result Workflow
Possible states:
- Draft
- Lecturer Submitted
- Adviser Reviewed
- HOD Reviewed
- Dean Approved
- Published
- Rejected

### 9.3 Payment Workflow
Possible states:
- Pending
- Verified
- Failed
- Exempted
- Manual Review

The workflow engine must validate whether a user can act at a given stage.

---

## 10. Security Requirements

The system shall implement:

- secure password hashing using Argon2
- secure session management
- server-side authorization checks
- protected route enforcement
- validation and sanitization of user input
- audit logging for critical actions
- controlled access to uploaded files
- rate limiting on sensitive operations
- environment-separated secrets

### Audited Actions
The following actions must generate audit events:

- login/logout
- password reset
- role assignment
- course creation/update
- course assignment
- registration submission
- registration approval/rejection
- result submission
- result approval/publication
- payment override
- file upload/download/delete

---

## 11. Deployment Architecture

### 11.1 Environments
The application shall support:

- Local Development
- Preview
- Production

### 11.2 Git Workflow
- `feature/*` branches → preview deployment
- `develop` → integration/staging
- `main` → production

### 11.3 Deployment Rules
All major changes should be validated in preview before production merge.

---

## 12. File Storage Architecture

The system shall use **private application-controlled object/blob storage** for:

- profile photos
- result sheets
- uploaded supporting documents
- approval attachments

Google Drive shall not be used as the primary application file store.

---

## 13. Non-Functional Requirements

### Maintainability
- domain-based structure
- reusable components
- typed service boundaries
- documented architecture decisions

### Scalability
- module-by-module growth
- efficient queries
- future service extraction if needed

### Reliability
- managed migrations
- database backups
- graceful integration failure handling
- clear error logging

### Usability
- mobile-responsive layouts
- clean role-based dashboards
- printable views for key records
- simple approval queues

---

## 14. Key Architectural Decisions

1. Use one Next.js application instead of multiple frontend apps.
2. Avoid a separate Express backend for MVP.
3. Use PostgreSQL + Prisma as the system of record.
4. Implement modular domain boundaries from day one.
5. Model workflow states explicitly.
6. Use secure application-controlled storage for files.
7. Deploy through GitHub + Vercel with preview-first workflow.

---

## 15. Future Extensions

The architecture should support future modules such as:

- transcript generation
- clearance workflows
- timetable management
- announcements/news
- self-service requests
- faculty-specific reporting
- SSO/MFA
- mobile client support
- broader ERP features