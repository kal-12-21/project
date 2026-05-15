# Tigray Referral Management System (TRMS)

**Version:** 1.0.0-rc1 | **Sprint Cycle:** 0–7 Complete  
An offline-first, referral-centric health information system for the Tigray region.

---

## Architecture Overview

```
d:/TRMS/
├── frontend/          # Next.js 16 (React, App Router, Vanilla CSS)
└── backend/           # NestJS + Prisma ORM + PostgreSQL
```

| Layer            | Technology                  | Port  |
|------------------|-----------------------------|-------|
| Frontend         | Next.js 16 / React 19       | 3000  |
| Backend API      | NestJS / Node.js            | 3001  |
| Database         | PostgreSQL (via Prisma ORM) | 5432  |
| Offline Store    | PouchDB (IndexedDB)         | —     |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally on port 5432
- npm

### 1. Backend Setup

```bash
cd backend
npm install
# Update .env with your DB credentials:
#   DATABASE_URL="postgresql://USER:PASS@localhost:5432/trms?schema=public"
npx prisma migrate dev --name init
npm run start:dev
```

Backend available at: **http://localhost:3001**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: **http://localhost:3000**

---

## Implemented Sprints

| Sprint | Focus                         | Status |
|--------|-------------------------------|--------|
| 0      | Repository & Foundation       | ✅ Done |
| 1      | Authentication Skeleton       | ✅ Done |
| 2      | Referral Creation Form        | ✅ Done |
| 3      | Offline Store & PouchDB Sync  | ✅ Done |
| 4      | Directory & Triage Dashboard  | ✅ Done |
| 5      | Notifications & Feedback Loop | ✅ Done |
| 6      | Analytics & Compliance        | ✅ Done |
| 7      | FHIR Readiness & Stabilization| ✅ Done |

---

## Key Frontend Routes

| Route            | Purpose                                            |
|------------------|----------------------------------------------------|
| `/`              | Login Page                                         |
| `/referral/new`  | 4-step referral creation wizard (offline-capable)  |
| `/triage`        | Triage Dashboard – Accept / Reject / Redirect      |
| `/directory`     | Facility Service capacity management               |
| `/analytics`     | KPI charts — volume, rejection rate, priority mix  |
| `/audit`         | Immutable audit trail viewer with CSV export       |

## Key Backend API Endpoints

| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| POST   | `/api/sync`                | Bulk upload offline referral drafts |
| GET    | `/api/triage/pending`      | List pending referrals for facility |
| PATCH  | `/api/triage/:id/status`   | Transition referral status         |
| GET    | `/api/analytics/summary`   | Aggregate KPI metrics              |
| GET    | `/api/audit`               | Paginated audit trail              |
| GET    | `/health`                  | System health check                |

---

## FHIR Interoperability (Sprint 7)

`backend/src/common/fhir.serializer.ts` provides mappers for:
- `Patient` → FHIR R4 Patient
- `ServiceRequest` → FHIR R4 ServiceRequest
- `Consent` → FHIR R4 Consent

These enable future SmartCare and DHIS2 integration without redesigning the data model.

---

## Security Features (Sprint 6)

- **Global Validation Pipe** — strips unknown fields, enforces DTOs
- **CORS** — restricted to configured `FRONTEND_URL`
- **Audit Trail** — all access and state changes logged with user ID and IP
- **Consent Gate** — patient consent record required before referral transmission
- **Mandatory Notes** — rejection/redirect requires clinical justification

---

## Open Decisions Before Production

| Item                            | Owner               | Due Before      |
|---------------------------------|---------------------|-----------------|
| SMS gateway (Twilio / AfricasTalking) | Product/Ops   | Sprint 5 cutover |
| SmartCare API contract          | Integration Lead    | Sprint 7 cutover |
| UAT pilot facility list         | Regional Health Bureau | Sprint 6     |
| Tigrinya localization review    | Clinical + UX Leads | Sprint 3+       |
| PostgreSQL hosting & backup     | Infrastructure Lead | Before Sprint 0 |
