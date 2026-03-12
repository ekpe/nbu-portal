# NBU Portal MVP Scope

## 1. MVP Objective

The MVP will establish the operational core of the NBU Portal System while preserving a clean architecture for future expansion.

The MVP is intended to make the platform demonstrable, usable, and extensible.

---

## 2. MVP Scope Philosophy

The MVP must prioritize:

- high-value academic operations
- secure user access
- configurable university master data
- approval workflows
- auditability
- deployment readiness

The MVP should avoid overloading the first release with low-priority features that can be added later.

---

## 3. Module-by-Module MVP Scope Table

| Module | Purpose | MVP Inclusion | MVP Features | Deferred Features |
|---|---|---|---|---|
| Identity & Access | Authentication and authorization | Yes | login, logout, role-based redirects, protected routes, session handling | MFA, SSO |
| Users & Profiles | Manage users and profiles | Yes | create/import users, student/staff profile pages, profile photos | self-service advanced profile editing |
| Academic Structure | Master academic data | Yes | faculties, departments, programmes, levels, sessions, semesters | academic calendar automation |
| Settings & Configuration | Central rules and policies | Yes | active session, active semester, grading scale, registration windows | advanced policy engine |
| Course Catalog | Course definitions | Yes | course CRUD, units, level/programme mapping | curriculum versioning |
| Course Offerings | Session/semester course availability | Yes | create offerings by session/semester/programme | automatic roll-forward |
| Staff Assignments | Lecturer/adviser/dean mappings | Yes | assign lecturers and advisers | workload balancing |
| Student Enrolment Mapping | Student academic placement | Yes | map student to programme/level | progression automation |
| Course Registration | Student registration workflow | Yes | draft/submit, validation, adviser approval, rejection comments, printable view | complex add/drop exceptions |
| Results Management | Lecturer result lifecycle | Yes | result entry/upload, validation, approval queue, publishing | result amendments |
| GPA/CGPA Engine | Academic summary computation | Yes | GPA and CGPA calculations | transcript transformations |
| Notifications | Operational alerts | Yes | in-app notifications, basic emails | preferences, SMS/push |
| Payments Verification | Fee eligibility checks | Partial | payment status integration point, registration blocking | reconciliation dashboards |
| Files & Documents | Secure uploads | Partial | profile photo upload, result sheets, attachments | archive/lifecycle management |
| Audit & Compliance | Critical activity logging | Yes | audit events for sensitive actions | compliance dashboards |
| Reporting | Administrative summaries | Partial | registration counts, queue summaries, basic dashboards | advanced analytics |
| Public Pages | Landing/info pages | Minimal | login landing page shell | public CMS |

---

## 4. Recommended MVP Release Sequence

### Release 1 — Foundation
Included modules:
- Identity & Access
- Users & Profiles
- Academic Structure
- Settings & Configuration
- Audit foundation
- Admin dashboard shell

### Release 2 — Academic Setup
Included modules:
- Course Catalog
- Course Offerings
- Staff Assignments
- Student Enrolment Mapping

### Release 3 — Registration Workflow
Included modules:
- Course Registration
- Notifications
- Basic payment status check
- Adviser/HOD/Dean queues

### Release 4 — Results Workflow
Included modules:
- Results Management
- GPA/CGPA Engine
- Student results view
- Expanded audit trail

---

## 5. Out-of-Scope for Initial MVP

The following should be intentionally deferred unless urgently required:

- SSO or institutional single sign-on
- MFA
- advanced analytics dashboards
- transcript request workflows
- timetable scheduling
- hostel/accommodation modules
- HR/payroll functions
- complex financial reconciliation
- news/CMS module
- mobile apps
- highly granular policy engine
- automated curriculum versioning

---

## 6. MVP Success Criteria

The MVP should be considered successful when:

1. users can log in securely by role
2. admin can manage academic master data
3. courses and staff assignments can be created
4. students can register courses
5. advisers/staff can review and approve registrations
6. lecturers can submit results
7. approved results can be published to students
8. payment eligibility can be checked or stubbed
9. critical actions are auditable
10. the portal deploys cleanly through GitHub + Vercel

---

## 7. MVP Deliverables Summary

### Must-Have
- secure authentication
- role-based dashboard shells
- student and staff profiles
- academic setup module
- course setup and offerings
- lecturer/adviser assignments
- course registration workflow
- results workflow
- GPA/CGPA calculations
- in-app notification foundation
- audit logging foundation

### Should-Have
- basic email alerts
- payment integration stub or live verification check
- secure file uploads
- printable registration view
- basic reporting summaries

### Can-Wait
- advanced reporting
- full payment reconciliation dashboards
- transcript workflows
- advanced document lifecycle
- SSO/MFA
- public content management

---

## 8. Risks if MVP Scope Expands Too Early

If too many modules are added too early, the likely risks are:

- slower delivery
- unstable workflows
- weak testing coverage
- architecture drift
- delayed deployment
- unclear ownership of priorities

The MVP should stay focused on the academic operational core.