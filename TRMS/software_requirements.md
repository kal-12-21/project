# Tigray Resilient Referral Management System (TRMS) 
## Software Requirements and Role-Based Documentation

**Prepared for:** Regional Health Bureau, PHC Nurses, and Liaison Officers  
**Based on:** The provided Referral Management document, expanded into a backend/frontend implementation guide.

**Document Type:** Software Requirements & Functional Design  
**Primary Users:** Regional Health Bureau (Admin), Nurses (PHC), Liaison Officers  
**Core Principles:** Offline-first, role-based access, closed referral loop, interoperability  

## 2. Purpose and Scope
**Purpose.** This document defines the software requirements, user roles, privileges, workflows, and front-end/back-end modules for TRMS. It extends the referral management concept in the provided document into a practical specification that can be implemented by a development team.  
**Scope.** The system covers referral creation at PHC level, triage and scheduling at receiving hospitals, and regional oversight by the Regional Health Bureau (RHB). It also includes user registration, authentication, audit logging, service-capacity tracking, SMS notifications, and integration with SmartCare and DHIS2.

## 3. System Overview
TRMS is an offline-first, role-based referral management platform designed for Tigray’s health system. It supports interrupted connectivity, enables clinical referrals to be stored locally and synchronized later, and closes the referral loop by sending the outcome back to the referring nurse and reporting aggregated data to the RHB.

## 4. Stakeholders and System Roles
The system has three main operational roles defined in this documentation:
- **Regional Health Bureau (RHB) Admin:** creates and manages nurse and liaison officer accounts, oversees system health, and monitors referral analytics.
- **PHC Nurse:** creates referrals, reviews service availability, tracks referral status, and receives feedback.
- **Liaison Officer:** receives referrals, triages cases, updates disposition, and coordinates hospital-side workflow.

## 5. User Account Model
Account creation is performed by the RHB Admin only. All nurses and liaison officers sign in using the credentials created by the admin.

**Required account profile fields:**
- Profile photo
- First name
- Last name
- Phone number
- Sex
- Age
- Email
- Password
- Role
- Department
- Placement (Ayder Hospital, K. Maryam Axum Hospital, Adigrat General Hospital, Suhul Shire Hospital, Lemelem Kanuel Hospital)
- Occupation date

**Recommended validation rules:**
- Email must be unique and valid.
- Phone number must be unique and stored in E.164 or a consistent national format.
- Password must be hashed and never stored in plain text.
- Role must be selected from predefined system roles only.
- Placement must be one of the approved facilities only.
- Occupation date must be a valid calendar date.
- Age may be stored for display, but the system should ideally keep Date of Birth as the canonical source in implementation.

## 6. Role Responsibilities and Privileges

| Role | Responsibilities | Core Privileges | Restrictions |
|---|---|---|---|
| **RHB Admin** | Register users, assign roles and placements, activate/deactivate accounts, monitor dashboards, review logs, manage service capacity policies, oversee compliance. | Create/update/deactivate nurse and liaison accounts; view all referrals; view analytics; export reports; access audit logs; manage facilities and departments. | Cannot modify clinical outcomes in place; cannot impersonate users; clinical triage actions remain with liaison officers. |
| **PHC Nurse** | Assess patients, create referrals, attach supporting files, track referral status, receive discharge feedback, follow up after treatment. | Create and edit own referrals before submission; view service directory; view status of own referrals; receive notifications; upload attachments. | Cannot access other facilities’ referrals; cannot triage hospital queue; cannot create user accounts; cannot change facility capacity status. |
| **Liaison Officer** | Review referrals, triage, accept/reject/redirect, request more information, coordinate appointments, update outcomes, maintain hospital-side workflow. | View incoming referrals for assigned facility; update referral status; add clinical notes; schedule patient flow; trigger pre-registration; send feedback. | Cannot create user accounts; cannot access records outside assigned scope; cannot alter regional analytics configuration. |

## 7. Functional Requirements

### 7.1 Authentication and Access Control
- **FR-AUTH-01:** The system shall allow only registered users to sign in using admin-created credentials.
- **FR-AUTH-02:** The system shall enforce role-based access control for Admin, Nurse, and Liaison Officer.
- **FR-AUTH-03:** The system shall support account activation, deactivation, and password reset by the RHB Admin.
- **FR-AUTH-04:** The system shall log all login attempts and security events.

### 7.2 Admin User Management
- **FR-ADM-01:** The RHB Admin shall be able to create user profiles with photo, names, phone, sex, age, email, password, role, department, placement, and occupation date.
- **FR-ADM-02:** The RHB Admin shall be able to update profile details except audit history.
- **FR-ADM-03:** The RHB Admin shall be able to deactivate or reactivate user accounts.
- **FR-ADM-04:** The RHB Admin shall be able to assign or change a user’s placement and department.
- **FR-ADM-05:** The RHB Admin shall be able to view all registered users in searchable and filterable lists.

### 7.3 Nurse Referral Workflow
- **FR-NUR-01:** The nurse shall be able to create a referral from a mobile or responsive web interface.
- **FR-NUR-02:** The nurse shall be able to save referrals offline and synchronize later when connectivity is available.
- **FR-NUR-03:** The nurse shall be able to attach files such as images, PDFs, and clinical notes.
- **FR-NUR-04:** The nurse shall be able to search the service directory before sending a referral.
- **FR-NUR-05:** The nurse shall be able to view referral status updates and discharge feedback.

### 7.4 Liaison Officer Workflow
- **FR-LIA-01:** The liaison officer shall receive and review incoming referrals for the assigned hospital.
- **FR-LIA-02:** The liaison officer shall be able to accept, reject, redirect, or request more information.
- **FR-LIA-03:** The liaison officer shall be able to update triage priority and appointment timing.
- **FR-LIA-04:** The liaison officer shall be able to mark a referral as completed after care is delivered.
- **FR-LIA-05:** The liaison officer shall be able to push outcome feedback to the referring facility.

### 7.5 Directory, Capacity, and Notifications
- **FR-SVC-01:** The system shall provide a daily-updated service capacity directory for all approved placements.
- **FR-SVC-02:** The system shall display facility service availability and functional status.
- **FR-SVC-03:** The system shall send SMS notifications to patients and/or staff when configured.
- **FR-SVC-04:** The system shall generate referral tokens for patient identification at the receiving hospital.

### 7.6 Reporting and Audit
- **FR-RPT-01:** The system shall provide aggregated reports to the RHB dashboard.
- **FR-RPT-02:** The system shall integrate with DHIS2 for monthly or periodic aggregate reporting.
- **FR-RPT-03:** The system shall maintain audit logs for account changes, referral actions, and access events.
- **FR-RPT-04:** The system shall allow authorized administrators to review logs for compliance and troubleshooting.

## 8. Non-Functional Requirements
- **NFR-01:** Offline operations must continue during power or network interruptions without data loss.
- **NFR-02:** The interface must remain simple enough for low-digital-literacy users and support Tigrinya and English.
- **NFR-03:** Synchronization should be efficient even on low-bandwidth connections.
- **NFR-04:** All sensitive data must be encrypted in transit and at rest.
- **NFR-05:** The system must scale across the named referral hospitals and additional facilities in future phases.
- **NFR-06:** The system must maintain an audit trail for all privileged operations.

## 9. Frontend Specification

### 9.1 Admin Dashboard
- Create user account screen
- User list with search, filters, and status badges
- Profile management page
- Facility and placement management
- Analytics dashboard for referral trends
- Audit log viewer
- Import/export users and reports

### 9.2 Nurse Interface
- Login page
- Referral creation form
- Offline draft indicator
- Service directory search
- Referral detail page with status timeline
- Message and feedback inbox
- Patient SMS/token preview

### 9.3 Liaison Officer Portal
- Incoming referral queue
- Referral review drawer/modal
- Accept / reject / redirect / request-info actions
- Schedule and priority controls
- Outcome note entry
- Pre-registration handoff to SmartCare
- Service status beacon editor

## 10. Backend Specification
- **Authentication service:** secure sign-in, password hashing, role-based authorization, token refresh.
- **User management service:** create, update, deactivate, restore, and query user accounts.
- **Referral service:** create, update, sync, and store ServiceRequest records.
- **Triage service:** manage referral workflow states and liaison actions.
- **Directory service:** maintain facilities, departments, and capacity status.
- **Notification service:** SMS and in-app notifications.
- **Audit and reporting service:** logs, dashboards, and DHIS2 aggregation.
- **Integration service:** SmartCare and DHIS2 connectivity, with offline queue handling.

## 11. Data Model Summary

| Entity | Key Fields | Owned By | Notes |
|---|---|---|---|
| **User** | id, photo, firstName, lastName, phone, sex, age, email, passwordHash, role, department, placement, occupationDate, status | RHB Admin | Used for all authenticated staff. |
| **Referral** | id, patientId, sourceFacility, destinationFacility, summary, attachments, priority, status, timestamps | Nurse / Liaison | Offline-first, sync-enabled clinical record. |
| **Facility** | id, name, department, serviceAvailability, functionalStatus, lastUpdated | Liaison / Admin | Supports directory and triage decisions. |
| **AuditLog** | id, actor, action, entityType, entityId, timestamp, metadata | System | Immutable compliance trail. |
| **Notification** | id, recipient, channel, message, status, createdAt | System | SMS and in-app messages. |

## 12. Core Workflow Summary
1. RHB Admin registers a nurse or liaison officer account.
2. User signs in with assigned credentials.
3. Nurse creates a referral and saves it online or offline.
4. Referral syncs to the server when connectivity returns.
5. Liaison officer reviews the referral and takes an action.
6. Patient receives SMS or token, and hospital records the encounter.
7. Outcome feedback returns to the referring nurse.
8. RHB Admin monitors dashboards and audit logs.

## 13. Acceptance Criteria
- A nurse can sign in only after the RHB Admin creates the account.
- A liaison officer can receive referrals only for the assigned placement.
- A referral created offline is preserved locally and synchronized later.
- The admin can see all registered users and update their profiles.
- The system can show referral status from creation to completion.
- Audit logs record user account changes and workflow actions.

## 14. Implementation Notes
- **Frontend recommendation:** Use a React-based admin portal for the RHB and liaison officers, and a responsive mobile-first or React Native app for nurses.
- **Backend recommendation:** Use a modular backend with auth, user management, referral workflow, notification, reporting, and integration services. Role enforcement should happen on the server, not only in the UI.
- **Security recommendation:** Store passwords as salted hashes, encrypt sensitive files, and log every privileged operation.
- **Interoperability recommendation:** Use a standards-based referral payload so the platform can evolve toward FHIR and SmartCare integration without redesigning the user experience.

## 15. Conclusion
This document defines a practical TRMS implementation that matches the referral management goals in the source document while extending them into a role-based software specification. It gives the RHB control over user registration, gives nurses an offline-first referral flow, and gives liaison officers a hospital-side triage workspace. The result is a complete, closed-loop referral platform suitable for Tigray’s operating environment.
