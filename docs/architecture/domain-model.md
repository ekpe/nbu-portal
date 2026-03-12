# NBU Portal Domain Model

## 1. Purpose

This document defines the core domain model for the NBU Portal System.

It serves as the shared reference for:

- database design
- Prisma schema design
- module boundaries
- workflow logic
- validation rules
- reporting and integrations

The model is designed for a **modular monolith** architecture and prioritizes academic operations, approval workflows, and extensibility.

---

## 2. Domain Modeling Principles

The domain model follows these principles:

1. **Business-first structure**  
   Entities are grouped by institutional function, not just database convenience.

2. **Clear separation of master data vs transactional data**  
   Stable academic structures are separated from time-bound operations.

3. **Workflow-aware design**  
   Transactions that require review or approval must carry state and history.

4. **Auditability**  
   Critical business changes must be traceable.

5. **Extensibility**  
   The model should support future modules without major restructuring.

---

## 3. Domain Areas

The model is divided into the following areas:

1. Identity and Access
2. User Profiles
3. Academic Master Data
4. Academic Operations
5. Registration
6. Results
7. Payments
8. Notifications
9. Files and Documents
10. Audit and Configuration

---

## 4. Identity and Access Domain

### 4.1 User
Represents the base authentication and application identity record.

**Key attributes**
- id
- email
- passwordHash
- firstName
- lastName
- middleName
- phone
- isActive
- lastLoginAt
- createdAt
- updatedAt

**Notes**
- Every student and staff member must map to a `User`.
- A user may hold one or more roles.
- Authentication is based on this entity.

---

### 4.2 Role
Represents a system-level access role.

**Examples**
- SUPER_ADMIN
- DEAN
- HOD
- COURSE_ADVISER
- LECTURER
- STUDENT

**Key attributes**
- id
- code
- name
- description
- createdAt
- updatedAt

---

### 4.3 UserRole
Maps users to roles.

**Key attributes**
- id
- userId
- roleId
- assignedAt
- assignedByUserId
- isActive

**Notes**
- Allows one user to hold multiple roles.
- Supports future time-bound or scoped role assignments.

---

## 5. User Profile Domain

### 5.1 StudentProfile
Stores student-specific identity and academic-personal data.

**Key attributes**
- id
- userId
- matricNumber
- admissionNumber
- dateOfBirth
- gender
- nationality
- stateOfOrigin
- localGovernment
- address
- profilePhotoFileId
- admissionYear
- currentLevelId
- currentProgrammeId
- currentDepartmentId
- currentFacultyId
- status
- createdAt
- updatedAt

**Notes**
- Should not duplicate auth-level fields unnecessarily.
- Academic positioning fields can be snapshots for convenience, but the authoritative academic placement should come from enrollment records.

---

### 5.2 StaffProfile
Stores staff-specific profile information.

**Key attributes**
- id
- userId
- staffNumber
- title
- qualification
- rank
- departmentId
- facultyId
- officeLocation
- profilePhotoFileId
- employmentStatus
- createdAt
- updatedAt

**Notes**
- Staff roles come from `UserRole`, not from this entity alone.
- A staff member may act as lecturer, adviser, HOD, or dean depending on assignments and active roles.

---

## 6. Academic Master Data Domain

### 6.1 Faculty
Represents a top-level academic grouping.

**Key attributes**
- id
- code
- name
- description
- isActive

---

### 6.2 Department
Represents an academic department under a faculty.

**Key attributes**
- id
- facultyId
- code
- name
- description
- isActive

---

### 6.3 Programme
Represents an academic programme under a department.

**Key attributes**
- id
- departmentId
- facultyId
- code
- name
- awardType
- durationYears
- isActive

**Examples**
- BSc Computer Science
- BSc Data Science

---

### 6.4 Level
Represents academic level/year.

**Key attributes**
- id
- code
- name
- numericValue
- isActive

**Examples**
- 100
- 200
- 300
- 400

---

### 6.5 AcademicSession
Represents an academic session.

**Key attributes**
- id
- name
- startDate
- endDate
- isActive
- isCurrent
- createdAt
- updatedAt

**Example**
- 2025/2026

---

### 6.6 Semester
Represents a semester/term within a session.

**Key attributes**
- id
- code
- name
- startDate
- endDate
- isActive
- isCurrent
- createdAt
- updatedAt

**Examples**
- First Semester
- Second Semester

---

### 6.7 GradingScale
Represents configurable grading boundaries.

**Key attributes**
- id
- name
- minScore
- maxScore
- gradeLetter
- gradePoint
- isActive
- effectiveFromSessionId

**Notes**
- Supports future changes to grading policy.

---

### 6.8 RegistrationWindow
Represents when course registration is allowed.

**Key attributes**
- id
- sessionId
- semesterId
- opensAt
- closesAt
- lateRegistrationClosesAt
- isActive
- appliesToFacultyId (nullable)
- appliesToDepartmentId (nullable)
- appliesToProgrammeId (nullable)

**Notes**
- Supports institution-wide or scoped registration windows.

---

## 7. Academic Operations Domain

### 7.1 Course
Represents the master record for a course.

**Key attributes**
- id
- courseCode
- title
- description
- creditUnits
- levelId
- departmentId
- facultyId
- programmeId (nullable)
- category
- isCarryoverEligible
- isElective
- isActive

**Examples of category**
- CORE
- ELECTIVE
- GST

---

### 7.2 CourseOffering
Represents a course made available in a given session and semester.

**Key attributes**
- id
- courseId
- sessionId
- semesterId
- facultyId
- departmentId
- programmeId
- levelId
- isActive
- registrationCap
- createdAt
- updatedAt

**Notes**
- `Course` is the master definition.
- `CourseOffering` is the operational availability.

---

### 7.3 CourseAssignment
Represents assignment of a lecturer to a course offering.

**Key attributes**
- id
- courseOfferingId
- lecturerStaffProfileId
- assignedByUserId
- assignedAt
- isPrimary
- isActive

---

### 7.4 AdviserAssignment
Represents assignment of an adviser to a programme/level or student cohort.

**Key attributes**
- id
- staffProfileId
- facultyId
- departmentId
- programmeId
- levelId
- sessionId
- semesterId
- isActive
- assignedByUserId
- assignedAt

**Notes**
- Can be used to determine who reviews student registrations.

---

### 7.5 StudentProgrammeEnrollment
Represents a student's academic placement in a particular session/period.

**Key attributes**
- id
- studentProfileId
- programmeId
- departmentId
- facultyId
- levelId
- sessionId
- semesterId
- enrollmentStatus
- isCurrent
- createdAt
- updatedAt

**Notes**
- This is the authoritative placement record for registration and result validation.

---

## 8. Registration Domain

### 8.1 CourseRegistration
Represents a student’s registration submission for a term.

**Key attributes**
- id
- studentProfileId
- sessionId
- semesterId
- enrollmentId
- status
- totalCredits
- submittedAt
- approvedAt
- rejectedAt
- lockedAt
- createdByUserId
- updatedByUserId
- createdAt
- updatedAt

**Example statuses**
- DRAFT
- SUBMITTED
- ADVISER_REVIEWED
- HOD_REVIEWED
- DEAN_REVIEWED
- APPROVED
- REJECTED
- LOCKED

---

### 8.2 CourseRegistrationItem
Represents an individual course within a registration.

**Key attributes**
- id
- registrationId
- courseOfferingId
- courseId
- creditUnits
- itemType
- isCarryover
- createdAt
- updatedAt

**Examples of itemType**
- NORMAL
- CARRYOVER
- ELECTIVE

---

### 8.3 WorkflowAction
Represents workflow state transitions or actions taken on a business record.

**Key attributes**
- id
- entityType
- entityId
- actionType
- fromStatus
- toStatus
- actorUserId
- comment
- metadataJson
- createdAt

**Examples of entityType**
- COURSE_REGISTRATION
- RESULT_SHEET

**Examples of actionType**
- SUBMIT
- APPROVE
- REJECT
- RETURN_FOR_CORRECTION
- PUBLISH
- LOCK

---

## 9. Results Domain

### 9.1 ResultSheet
Represents the result submission for a course offering.

**Key attributes**
- id
- courseOfferingId
- sessionId
- semesterId
- lecturerStaffProfileId
- status
- submittedAt
- approvedAt
- publishedAt
- createdAt
- updatedAt

**Example statuses**
- DRAFT
- LECTURER_SUBMITTED
- ADVISER_REVIEWED
- HOD_REVIEWED
- DEAN_APPROVED
- PUBLISHED
- REJECTED

---

### 9.2 ResultEntry
Represents a single student’s score/grade for a course offering.

**Key attributes**
- id
- resultSheetId
- studentProfileId
- registrationId (nullable)
- score
- gradeLetter
- gradePoint
- remark
- createdAt
- updatedAt

**Notes**
- `remark` may include PASS, FAIL, ABSENT, INCOMPLETE.

---

### 9.3 GPARecord
Represents GPA for a student in a specific term.

**Key attributes**
- id
- studentProfileId
- sessionId
- semesterId
- totalUnitsAttempted
- totalUnitsPassed
- totalGradePoints
- gpa
- calculatedAt

---

### 9.4 CGPARecord
Represents cumulative GPA for a student up to a given point.

**Key attributes**
- id
- studentProfileId
- sessionId
- semesterId
- totalCumulativeUnits
- totalCumulativeGradePoints
- cgpa
- calculatedAt

---

### 9.5 ResultApprovalAction
Represents approval history for results.

**Key attributes**
- id
- resultSheetId
- actorUserId
- actionType
- fromStatus
- toStatus
- comment
- createdAt

---

## 10. Payments Domain

### 10.1 PaymentVerification
Represents fee verification state for a student and term.

**Key attributes**
- id
- studentProfileId
- sessionId
- semesterId
- verificationStatus
- externalReference
- verifiedAmount
- verifiedAt
- rawResponseJson
- lastCheckedAt
- createdAt
- updatedAt

**Example statuses**
- PENDING
- VERIFIED
- FAILED
- EXEMPTED
- MANUAL_REVIEW

**Notes**
- This entity should be decoupled from the registration entity so payment checks can be re-run independently.

---

## 11. Notifications Domain

### 11.1 Notification
Represents in-app notifications.

**Key attributes**
- id
- userId
- title
- message
- notificationType
- entityType
- entityId
- isRead
- readAt
- createdAt

---

### 11.2 EmailDeliveryLog
Represents email delivery attempts and outcomes.

**Key attributes**
- id
- userId
- notificationId (nullable)
- emailAddress
- subject
- templateCode
- deliveryStatus
- providerMessageId
- failureReason
- sentAt
- createdAt

---

## 12. Files and Documents Domain

### 12.1 FileAsset
Represents files stored in application-controlled storage.

**Key attributes**
- id
- storageProvider
- storagePath
- fileName
- mimeType
- fileSizeBytes
- visibility
- uploadedByUserId
- relatedEntityType
- relatedEntityId
- uploadedAt
- deletedAt (nullable)

**Examples of relatedEntityType**
- STUDENT_PROFILE
- STAFF_PROFILE
- RESULT_SHEET
- COURSE_REGISTRATION

---

## 13. Audit and Configuration Domain

### 13.1 AuditLog
Represents auditable system events.

**Key attributes**
- id
- actorUserId
- actionType
- entityType
- entityId
- summary
- beforeJson
- afterJson
- ipAddress
- userAgent
- createdAt

---

### 13.2 SystemSetting
Represents configurable system values.

**Key attributes**
- id
- category
- key
- value
- description
- isActive
- updatedByUserId
- updatedAt

**Examples**
- active_session_id
- active_semester_id
- max_credit_load_default
- result_publication_enabled

---

### 13.3 FeatureFlagOverride
Represents feature-flag settings or overrides.

**Key attributes**
- id
- flagKey
- environment
- scopeType
- scopeId
- isEnabled
- createdAt
- updatedAt

---

## 14. Key Relationships Summary

### Identity and Profiles
- User 1..* UserRole
- Role 1..* UserRole
- User 1..1 StudentProfile or StaffProfile

### Academic Structure
- Faculty 1..* Department
- Department 1..* Programme
- Programme 1..* StudentProgrammeEnrollment
- Level referenced by Course, Enrollment, Registration scope

### Courses
- Course 1..* CourseOffering
- CourseOffering 1..* CourseAssignment
- CourseOffering 1..* ResultSheet
- CourseOffering 1..* CourseRegistrationItem

### Registration
- StudentProfile 1..* CourseRegistration
- CourseRegistration 1..* CourseRegistrationItem
- CourseRegistration 1..* WorkflowAction

### Results
- ResultSheet 1..* ResultEntry
- ResultSheet 1..* ResultApprovalAction
- StudentProfile 1..* GPARecord
- StudentProfile 1..* CGPARecord

### Payments and Notifications
- StudentProfile 1..* PaymentVerification
- User 1..* Notification
- User 1..* EmailDeliveryLog

### Files and Audit
- User 1..* FileAsset
- User 1..* AuditLog

---

## 15. Modeling Guidelines for Prisma

When implementing this model in Prisma:

1. use explicit enums for workflow statuses where appropriate
2. keep master data and transactional data separate
3. use nullable references carefully for flexible workflows
4. add createdAt and updatedAt consistently
5. use soft-delete only where business needs justify it
6. index frequently queried fields such as:
   - email
   - matricNumber
   - staffNumber
   - courseCode
   - sessionId
   - semesterId
   - status
7. avoid putting too much business logic in the database itself
8. keep audit and workflow history append-only where possible

---

## 16. Future Domain Extensions

The model should support later additions such as:

- transcript requests
- clearance workflows
- announcements
- timetable scheduling
- hostel allocation
- alumni tracking
- learning analytics
- broader finance integrations