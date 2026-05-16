"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhirMapperService = void 0;
const common_1 = require("@nestjs/common");
let FhirMapperService = class FhirMapperService {
    toFhirPatient(patient) {
        return {
            resourceType: 'Patient',
            id: patient.id,
            identifier: [
                {
                    use: 'official',
                    system: 'urn:trms:mrn',
                    value: patient.mrn,
                },
            ],
            name: [
                {
                    use: 'official',
                    family: patient.lastName,
                    given: [patient.firstName],
                },
            ],
            gender: this.mapGender(patient.sex),
            birthDate: patient.dateOfBirth ?? undefined,
            telecom: patient.phone
                ? [{ system: 'phone', value: patient.phone, use: 'mobile' }]
                : [],
            meta: {
                profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
                lastUpdated: patient.updatedAt ?? new Date().toISOString(),
            },
        };
    }
    toFhirServiceRequest(ref) {
        const priorityMap = {
            ROUTINE: 'routine',
            URGENT: 'urgent',
            EMERGENCY: 'asap',
        };
        const statusMap = {
            SUBMITTED: 'active',
            ACCEPTED: 'active',
            REJECTED: 'revoked',
            REDIRECTED: 'on-hold',
            PENDING_INFO: 'on-hold',
            COMPLETED: 'completed',
        };
        return {
            resourceType: 'ServiceRequest',
            id: ref.id,
            status: statusMap[ref.status] ?? 'unknown',
            intent: 'order',
            priority: priorityMap[ref.priority] ?? 'routine',
            code: {
                coding: [
                    {
                        system: 'http://snomed.info/sct',
                        code: '3457005',
                        display: ref.serviceCategory ?? 'Patient referral',
                    },
                ],
                text: ref.serviceCategory ?? 'Patient referral',
            },
            subject: {
                reference: `Patient/${ref.patientId}`,
                display: ref.patient
                    ? `${ref.patient.firstName} ${ref.patient.lastName}`
                    : undefined,
            },
            requester: {
                reference: `Organization/${ref.originId}`,
                display: ref.originFacility?.name ?? ref.originId,
            },
            performer: [
                {
                    reference: `Organization/${ref.destId}`,
                    display: ref.destFacility?.name ?? ref.destId,
                },
            ],
            note: ref.clinicalSummary ? [{ text: ref.clinicalSummary }] : [],
            authoredOn: ref.createdAt,
            meta: {
                profile: ['http://hl7.org/fhir/StructureDefinition/ServiceRequest'],
                lastUpdated: ref.updatedAt ?? ref.createdAt,
            },
        };
    }
    toFhirTask(task, serviceRequestId) {
        const statusMap = {
            PENDING: 'requested',
            IN_PROGRESS: 'in-progress',
            COMPLETED: 'completed',
            REJECTED: 'rejected',
        };
        return {
            resourceType: 'Task',
            id: task.id,
            status: statusMap[task.status] ?? 'requested',
            intent: 'order',
            focus: { reference: `ServiceRequest/${serviceRequestId}` },
            owner: task.assignedToUserId
                ? { reference: `Practitioner/${task.assignedToUserId}` }
                : undefined,
            note: task.notes ? [{ text: task.notes }] : [],
            authoredOn: task.createdAt,
            meta: {
                profile: ['http://hl7.org/fhir/StructureDefinition/Task'],
            },
        };
    }
    toBundle(resources, type = 'searchset') {
        return {
            resourceType: 'Bundle',
            type,
            total: resources.length,
            entry: resources.map((resource) => ({ resource })),
        };
    }
    mapGender(sex) {
        const map = {
            MALE: 'male',
            FEMALE: 'female',
            OTHER: 'other',
            UNKNOWN: 'unknown',
        };
        return map[sex] ?? 'unknown';
    }
    parseFhirBundle(bundle) {
        if (bundle?.resourceType !== 'Bundle' || !Array.isArray(bundle.entry)) {
            throw new Error('Invalid or missing FHIR Bundle entries');
        }
        let patientRes = null;
        let requestRes = null;
        for (const entry of bundle.entry) {
            if (entry.resource?.resourceType === 'Patient') {
                patientRes = entry.resource;
            }
            else if (entry.resource?.resourceType === 'ServiceRequest') {
                requestRes = entry.resource;
            }
        }
        if (!patientRes || !requestRes) {
            throw new Error('Bundle must contain at least one Patient and one ServiceRequest resource');
        }
        const mrnIdentifier = patientRes.identifier?.find((i) => i.system === 'urn:trms:mrn' || true)?.value;
        const nameObj = patientRes.name?.[0] || {};
        const patientData = {
            mrn: mrnIdentifier || `MRN-${Date.now()}`,
            lastName: nameObj.family || 'Unknown',
            firstName: nameObj.given?.[0] || 'Unknown',
            sex: this.parseGender(patientRes.gender),
            dateOfBirth: patientRes.birthDate
                ? new Date(patientRes.birthDate)
                : undefined,
            phone: patientRes.telecom?.find((t) => t.system === 'phone')?.value,
        };
        const priorityMap = {
            routine: 'ROUTINE',
            urgent: 'URGENT',
            asap: 'EMERGENCY',
            stat: 'EMERGENCY',
        };
        const originRef = requestRes.requester?.reference?.replace('Organization/', '') ||
            'Origin-Unknown';
        const destRef = requestRes.performer?.[0]?.reference?.replace('Organization/', '') ||
            'Dest-Unknown';
        const serviceRequestData = {
            priority: priorityMap[requestRes.priority] || 'ROUTINE',
            serviceCategory: requestRes.code?.text || 'Patient referral',
            clinicalSummary: requestRes.note?.[0]?.text || '',
            originFacilityId: originRef,
            destFacilityId: destRef,
        };
        return { patientData, serviceRequestData };
    }
    parseGender(gender) {
        const map = {
            male: 'MALE',
            female: 'FEMALE',
            other: 'OTHER',
            unknown: 'UNKNOWN',
        };
        return map[gender] ?? 'UNKNOWN';
    }
};
exports.FhirMapperService = FhirMapperService;
exports.FhirMapperService = FhirMapperService = __decorate([
    (0, common_1.Injectable)()
], FhirMapperService);
//# sourceMappingURL=fhir-mapper.service.js.map