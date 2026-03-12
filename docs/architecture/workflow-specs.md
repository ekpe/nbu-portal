# NBU Portal Workflow Specifications

## 1. Purpose

This document defines the core operational workflows for the NBU Portal System.

It provides a functional reference for:

- user interactions
- workflow state transitions
- approval responsibilities
- rejection and correction handling
- system validations
- audit requirements

The initial focus is on the two most critical academic workflows:

1. course registration
2. result submission and publication

A payment eligibility workflow is also included because it influences registration access.

---

## 2. Workflow Design Principles

All workflows in the portal must follow these principles:

1. **state-driven execution**  
   each business process must move through explicit statuses

2. **server-side enforcement**  
   the backend must validate who can act and when

3. **scope-aware permissions**  
   users can only act within their assigned faculty, department, programme, course, or cohort scope

4. **commentable decisions**  
   approvals and rejections should support comments where needed

5. **auditable transitions**  
   every critical state change must be logged

6. **recoverable corrections**  
   rejected or returned items should be correctable and resubmittable where policy allows

---

## 3. Common Workflow Concepts

### 3.1 Actor
The user performing the action.

Examples:
- student
- lecturer
- adviser
- HOD
- dean
- super admin

### 3.2 Entity
The record being acted upon.

Examples:
- course registration
- result sheet

### 3.3 Status
The current workflow state of the entity.

### 3.4 Transition
The movement from one status to another.

### 3.5 Action
The operation taken by an actor.

Examples:
- save draft
- submit
- approve
- reject
- publish
- lock

### 3.6 Comment
Optional or required text attached to a workflow action.

### 3.7 Audit Event
A log record describing the action taken and context.

---

## 4. Course Registration Workflow

## 4.1 Objective

Allow students to register courses for a session and semester, route the registration through the appropriate academic review chain, and produce an approved/locked registration record.

---

## 4.2 Entities Involved

- StudentProfile
- StudentProgrammeEnrollment
- CourseOffering
- CourseRegistration
- CourseRegistrationItem
- AdviserAssignment
- WorkflowAction
- AuditLog
- PaymentVerification
- Notification

---

## 4.3 Registration Statuses

- DRAFT
- SUBMITTED
- ADVISER_REVIEWED
- HOD_REVIEWED
- DEAN_REVIEWED
- APPROVED
- REJECTED
- LOCKED

Not every institution or faculty must use all review levels, but the status model should allow them.

---

## 4.4 Actor Responsibilities

### Student
Can:
- create draft registration
- add and remove courses before submission
- submit registration
- view approval status
- view rejection comments
- print approved registration
- resubmit after rejection if policy allows

Cannot:
- approve own registration
- edit locked registration

### Course Adviser
Can:
- review student registration within assigned scope
- approve, reject, or return for correction
- add advisory comments if policy permits

Cannot:
- act on students outside assigned scope

### HOD
Can:
- review registrations escalated or routed to department level
- approve or reject according to policy

### Dean
Can:
- review faculty-level approvals if required
- finalize approval according to policy

### Super Admin
Can:
- configure workflow rules
- override in exceptional cases if policy allows
- audit all actions

---

## 4.5 Preconditions for Registration

Before a student can submit registration:

1. user must be authenticated
2. student profile must exist and be active
3. current session and semester must be active
4. registration window must be open
5. student must have a valid current enrollment
6. payment status must meet the configured rule, if payment check is enabled
7. selected courses must be valid for the student's programme/level or approved carryover path
8. total credits must not exceed policy limits unless override exists

---

## 4.6 Registration Actions and Transitions

### Action: Save Draft
**Actor:** Student  
**From:** none or DRAFT  
**To:** DRAFT

**Rules**
- may be saved multiple times
- courses can be added/removed while in DRAFT
- audit log optional for autosave, required for explicit draft save if desired

---

### Action: Submit Registration
**Actor:** Student  
**From:** DRAFT  
**To:** SUBMITTED

**Rules**
- validation must pass
- payment status check must pass if enabled
- total credits recalculated
- workflow action logged
- notifications sent to next reviewer(s)

---

### Action: Adviser Review Approve
**Actor:** Course Adviser  
**From:** SUBMITTED  
**To:** ADVISER_REVIEWED or APPROVED

**Rules**
- depends on whether additional review levels are configured
- adviser must be valid for student scope
- audit and workflow action required

---

### Action: Adviser Reject
**Actor:** Course Adviser  
**From:** SUBMITTED  
**To:** REJECTED

**Rules**
- rejection comment required
- student notified
- record becomes editable again if policy allows

---

### Action: HOD Approve
**Actor:** HOD  
**From:** ADVISER_REVIEWED  
**To:** HOD_REVIEWED or APPROVED

---

### Action: HOD Reject
**Actor:** HOD  
**From:** ADVISER_REVIEWED  
**To:** REJECTED

**Rules**
- rejection comment required

---

### Action: Dean Approve
**Actor:** Dean  
**From:** HOD_REVIEWED or ADVISER_REVIEWED  
**To:** DEAN_REVIEWED or APPROVED

**Rules**
- exact from-state depends on configured routing

---

### Action: Dean Reject
**Actor:** Dean  
**From:** HOD_REVIEWED or ADVISER_REVIEWED  
**To:** REJECTED

---

### Action: Lock Registration
**Actor:** System or Authorized Staff  
**From:** APPROVED  
**To:** LOCKED

**Rules**
- occurs after final approval or after deadline lock
- no further editing allowed
- printable record becomes final reference

---

## 4.7 Correction and Resubmission Model

If a registration is rejected:

- the system should preserve previous items and comments
- the student may edit and resubmit if policy permits
- resubmission creates a new workflow action history item
- the entity may remain the same record with status reset to DRAFT or SUBMITTED depending on policy

Recommended approach:
- set status back to DRAFT after rejection if student must edit before resubmitting

---

## 4.8 Validation Rules for Registration

The registration service should validate at least:

1. active session and semester
2. registration window open
3. no duplicate course entries
4. courses belong to allowed offering scope
5. credit load within maximum allowed range
6. compulsory courses included if policy requires
7. carryover courses properly flagged
8. no editing after lock
9. payment eligibility passes if enabled

---

## 4.9 Notifications in Registration Workflow

Recommended notification events:

- student submitted registration
- adviser review required
- HOD review required
- dean review required
- registration approved
- registration rejected
- registration locked

---

## 4.10 Audit Requirements for Registration Workflow

Audit events must be written for:

- submission
- approval
- rejection
- resubmission
- lock
- admin override

---

## 5. Result Submission and Publication Workflow

## 5.1 Objective

Allow lecturers to submit results for course offerings, validate the result set, route it through academic approval, and publish approved results to students.

---

## 5.2 Entities Involved

- CourseOffering
- CourseAssignment
- ResultSheet
- ResultEntry
- ResultApprovalAction
- GPARecord
- CGPARecord
- AuditLog
- Notification

---

## 5.3 Result Statuses

- DRAFT
- LECTURER_SUBMITTED
- ADVISER_REVIEWED
- HOD_REVIEWED
- DEAN_APPROVED
- PUBLISHED
- REJECTED

---

## 5.4 Actor Responsibilities

### Lecturer
Can:
- create result draft
- enter/upload scores for assigned course offerings
- submit result sheet

Cannot:
- publish results directly unless policy explicitly allows

### Adviser
Can:
- review result sheet if included in workflow
- approve or reject within scope

### HOD
Can:
- review department-level result submissions
- approve or reject

### Dean
Can:
- perform faculty-level approval
- authorize final publish stage depending on policy

### Super Admin
Can:
- configure workflow
- oversee audit trails
- perform exceptional override if policy allows

---

## 5.5 Preconditions for Result Submission

Before a lecturer can submit results:

1. lecturer must be assigned to the course offering
2. active session and semester must match the result context
3. students in result entries should be valid for the offering
4. scores must fall within allowed score range
5. grade calculations must align with active grading scale
6. duplicate student entries must not exist
7. result sheet must not already be published

---

## 5.6 Result Actions and Transitions

### Action: Save Result Draft
**Actor:** Lecturer  
**From:** none or DRAFT  
**To:** DRAFT

---

### Action: Submit Result Sheet
**Actor:** Lecturer  
**From:** DRAFT  
**To:** LECTURER_SUBMITTED

**Rules**
- validation must pass
- workflow action required
- notifications sent to next reviewer

---

### Action: Adviser Review Approve
**Actor:** Adviser  
**From:** LECTURER_SUBMITTED  
**To:** ADVISER_REVIEWED or HOD_REVIEWED or DEAN_APPROVED

**Rules**
- depends on configured route

---

### Action: Adviser Reject
**Actor:** Adviser  
**From:** LECTURER_SUBMITTED  
**To:** REJECTED

**Rules**
- comment required
- lecturer notified for correction

---

### Action: HOD Approve
**Actor:** HOD  
**From:** ADVISER_REVIEWED or LECTURER_SUBMITTED  
**To:** HOD_REVIEWED or DEAN_APPROVED

---

### Action: HOD Reject
**Actor:** HOD  
**From:** ADVISER_REVIEWED or LECTURER_SUBMITTED  
**To:** REJECTED

---

### Action: Dean Approve
**Actor:** Dean  
**From:** HOD_REVIEWED or ADVISER_REVIEWED  
**To:** DEAN_APPROVED

---

### Action: Publish Results
**Actor:** Authorized Staff or System  
**From:** DEAN_APPROVED  
**To:** PUBLISHED

**Rules**
- only approved result sheets can be published
- publication should trigger GPA/CGPA recalculation where relevant
- student notifications may be generated

---

## 5.7 Correction Model for Rejected Results

If a result sheet is rejected:

- rejection comment must be stored
- lecturer should be able to edit and resubmit
- prior approval history must remain visible
- a new submission should append to workflow history, not erase it

---

## 5.8 Validation Rules for Results

The result service should validate at least:

1. assigned lecturer is valid
2. result entries are for valid students
3. no duplicate students in one result sheet
4. score within configured range
5. grade derived correctly
6. only registered students allowed if that is policy
7. no modification after publish unless an amendment workflow exists
8. approval actor has valid scope

---

## 5.9 GPA/CGPA Calculation Trigger

Recommended triggers:

- on final result publication for a semester
- on publication of each result sheet if recalculation is incremental
- on admin re-run if corrections occur later

Recommended MVP approach:
- recalculate GPA/CGPA after approved result publication for relevant student-term combinations

---

## 5.10 Notifications in Result Workflow

Recommended notification events:

- lecturer submitted results
- reviewer action required
- result sheet rejected
- result sheet approved
- results published to student

---

## 5.11 Audit Requirements for Result Workflow

Audit events must be written for:

- draft save if needed
- submission
- approval
- rejection
- publication
- recalculation
- override or manual correction

---

## 6. Payment Eligibility Workflow

## 6.1 Objective

Determine whether a student is eligible to complete course registration based on fee verification.

---

## 6.2 Entities Involved

- StudentProfile
- PaymentVerification
- CourseRegistration
- Notification
- AuditLog

---

## 6.3 Payment Statuses

- PENDING
- VERIFIED
- FAILED
- EXEMPTED
- MANUAL_REVIEW

---

## 6.4 Payment Workflow Behavior

### Check Payment Status
**Actor:** System or Admin  
**Output:** PaymentVerification status for student/session/semester

### Allow Registration
Registration submission can proceed if:
- status is VERIFIED, or
- status is EXEMPTED, or
- configuration allows manual review users to proceed

### Block Registration
Registration submission should be blocked if:
- status is FAILED, or
- status is PENDING and policy requires verified payment first

---

## 6.5 Payment Override Rules

Authorized users may apply:
- EXEMPTED
- MANUAL_REVIEW

Every override must:
- store actor identity
- store comment/reason
- generate audit log

---

## 7. Queue Views Required in MVP

The following queue pages are recommended:

### Registration Queues
- adviser pending queue
- HOD pending queue
- dean pending queue

### Results Queues
- lecturer draft/submitted view
- adviser pending queue
- HOD pending queue
- dean approval queue

Each queue should support:
- filtering by session
- filtering by semester
- filtering by faculty/department/programme where appropriate
- quick status visibility

---

## 8. Printable and Student-Visible Outputs

### Registration Output
Students should be able to view and print:
- registration summary
- course list
- total credits
- approval status
- final approval snapshot if approved

### Results Output
Students should be able to view:
- course-level results
- semester GPA
- cumulative CGPA
- publication state

---

## 9. Exception Handling

The MVP should support basic exception handling for:

- registration rejected with comment
- result sheet rejected with comment
- payment manual review
- missing adviser assignment
- missing course offering configuration
- expired registration window

These should be handled with user-friendly messages and auditable admin visibility.

---

## 10. Future Workflow Extensions

The workflow framework should later support:

- add/drop workflows
- result amendment workflows
- transcript request workflows
- clearance workflows
- graduation eligibility workflows
- faculty-specific routing variations