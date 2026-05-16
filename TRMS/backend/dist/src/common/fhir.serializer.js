"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFhirPatient = toFhirPatient;
exports.toFhirServiceRequest = toFhirServiceRequest;
exports.toFhirConsent = toFhirConsent;
function toFhirPatient(patient) {
    return {
        resourceType: 'Patient',
        id: patient.id,
        identifier: [{ system: 'urn:trms:mrn', value: patient.mrn }],
        name: [{ family: patient.lastName, given: [patient.firstName] }],
        gender: patient.sex?.toLowerCase() ?? 'unknown',
        telecom: patient.phone ? [{ system: 'phone', value: patient.phone }] : [],
    };
}
function toFhirServiceRequest(referral) {
    return {
        resourceType: 'ServiceRequest',
        id: referral.id,
        status: mapStatusToFhir(referral.status),
        intent: 'order',
        priority: referral.priority?.toLowerCase() ?? 'routine',
        subject: { reference: `Patient/${referral.patientId}` },
        requester: { reference: `Organization/${referral.originId}` },
        performer: [{ reference: `Organization/${referral.destId}` }],
        note: referral.clinicalSummary ? [{ text: referral.clinicalSummary }] : [],
        authoredOn: referral.createdAt,
    };
}
function toFhirConsent(consent) {
    return {
        resourceType: 'Consent',
        id: consent.id,
        status: consent.consentGiven ? 'active' : 'rejected',
        scope: { coding: [{ code: 'patient-privacy' }] },
        patient: { reference: `Patient/${consent.patientId}` },
        dateTime: consent.consentDate,
    };
}
function mapStatusToFhir(status) {
    const map = {
        DRAFT: 'draft',
        SUBMITTED: 'active',
        ACCEPTED: 'active',
        REJECTED: 'revoked',
        REDIRECTED: 'on-hold',
        PENDING: 'on-hold',
        COMPLETED: 'completed',
    };
    return map[status] ?? 'unknown';
}
//# sourceMappingURL=fhir.serializer.js.map