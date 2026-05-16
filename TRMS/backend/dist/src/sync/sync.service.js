"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const events_gateway_1 = require("../events/events.gateway");
const attachments_service_1 = require("../attachments/attachments.service");
let SyncService = SyncService_1 = class SyncService {
    prisma;
    events;
    attachmentsService;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(prisma, events, attachmentsService) {
        this.prisma = prisma;
        this.events = events;
        this.attachmentsService = attachmentsService;
    }
    async processSyncBatch(drafts) {
        const syncedIds = [];
        for (const draft of drafts) {
            try {
                const newReferral = await this.prisma.$transaction(async (tx) => {
                    const originFacilityId = draft.referral?.originFacilityId;
                    const destFacilityId = draft.referral?.destFacilityId;
                    const selectedServiceId = draft.referral?.selectedServiceId;
                    if (!originFacilityId) {
                        throw new Error(`Draft ${draft._id} missing originFacilityId — cannot sync.`);
                    }
                    if (!destFacilityId) {
                        throw new Error(`Draft ${draft._id} missing destFacilityId — cannot sync.`);
                    }
                    if (!selectedServiceId) {
                        throw new Error(`Draft ${draft._id} missing selectedServiceId — cannot sync.`);
                    }
                    let patient;
                    if (draft.patientId) {
                        patient = await tx.patient.findUnique({ where: { id: draft.patientId } });
                        if (!patient) {
                            throw new Error(`Draft ${draft._id} missing patientId (patient not found in DB) — cannot sync.`);
                        }
                    }
                    else {
                        const patientData = draft.patient;
                        if (!patientData?.mrn) {
                            throw new Error(`Draft ${draft._id} missing patientId (no MRN provided either) — cannot sync.`);
                        }
                        patient = await tx.patient.upsert({
                            where: { mrn: patientData.mrn },
                            update: {
                                firstName: patientData.firstName,
                                lastName: patientData.lastName,
                                phone: patientData.phone || null,
                                age: patientData.age || null,
                                sex: patientData.sex,
                            },
                            create: {
                                mrn: patientData.mrn,
                                firstName: patientData.firstName,
                                lastName: patientData.lastName,
                                phone: patientData.phone || null,
                                age: patientData.age || null,
                                sex: patientData.sex,
                            },
                        });
                    }
                    if (!patient?.id) {
                        throw new Error(`Draft ${draft._id} missing patientId after sync preparation — cannot sync.`);
                    }
                    let originFac = await tx.facility.findUnique({ where: { id: originFacilityId } });
                    let destFac = await tx.facility.findUnique({ where: { id: destFacilityId } });
                    if (!originFac) {
                        this.logger.warn(`Draft ${draft._id}: originFacilityId "${originFacilityId}" not found in DB. Skipping.`);
                        throw new Error(`Origin facility ${originFacilityId} not found in database.`);
                    }
                    if (!destFac) {
                        this.logger.warn(`Draft ${draft._id}: destFacilityId "${destFacilityId}" not found in DB. Skipping.`);
                        throw new Error(`Destination facility ${destFacilityId} not found in database.`);
                    }
                    const serviceRequest = await tx.serviceRequest.create({
                        data: {
                            patientId: patient.id,
                            originId: originFac.id,
                            destId: destFac.id,
                            selectedServiceId: selectedServiceId,
                            priority: draft.referral.priority,
                            clinicalSummary: draft.referral.clinicalSummary || '',
                            status: 'SUBMITTED',
                        },
                    });
                    if (draft.consentGiven) {
                        await tx.consent.create({
                            data: {
                                patientId: patient.id,
                                serviceRequestId: serviceRequest.id,
                                consentGiven: true,
                            },
                        });
                    }
                    syncedIds.push(draft._id);
                    return { serviceRequest, patient, destFacility: destFac };
                });
                if (draft.attachments && draft.attachments.length > 0) {
                    for (const att of draft.attachments) {
                        try {
                            await this.attachmentsService.storeAttachmentBase64(newReferral.serviceRequest.id, att);
                        }
                        catch (attErr) {
                            this.logger.warn(`Failed to store attachment for ${newReferral.serviceRequest.id}: ${attErr.message}`);
                        }
                    }
                }
                this.events.emitNewReferral({
                    referralId: newReferral.serviceRequest.id,
                    patientMrn: newReferral.patient.mrn,
                    priority: newReferral.serviceRequest.priority,
                    destFacilityId: newReferral.serviceRequest.destId,
                    destFacilityName: newReferral.destFacility.name,
                });
                this.logger.log(`✅ Successfully synced draft ${draft._id} → referral ${newReferral.serviceRequest.id}`);
            }
            catch (error) {
                this.logger.warn(`⚠️  Skipped draft ${draft._id}: ${error.message}`);
            }
        }
        return syncedIds;
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway,
        attachments_service_1.AttachmentsService])
], SyncService);
//# sourceMappingURL=sync.service.js.map