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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const events_gateway_1 = require("../events/events.gateway");
const audit_service_1 = require("../audit/audit.service");
let TriageService = class TriageService {
    prisma;
    notifications;
    events;
    audit;
    constructor(prisma, notifications, events, audit) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.events = events;
        this.audit = audit;
    }
    async getPendingReferrals(facilityId) {
        const whereClause = {
            status: { in: ['SUBMITTED', 'PENDING_INFO'] },
        };
        if (facilityId)
            whereClause.destId = facilityId;
        return this.prisma.serviceRequest.findMany({
            where: whereClause,
            include: {
                patient: true,
                originFacility: true,
                destFacility: true,
                tasks: true,
                attachments: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateReferralStatus(id, status, note, actionByUserId, ipAddress) {
        if (['REJECTED', 'REDIRECTED', 'PENDING_INFO'].includes(status) && !note) {
            throw new common_1.BadRequestException(`A clinical note/reason is legally required when setting status to ${status}.`);
        }
        const receiptToken = status === 'ACCEPTED'
            ? `TRMS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            : undefined;
        const updated = await this.prisma.$transaction(async (tx) => {
            if (note || status !== 'SUBMITTED') {
                const tStatus = status === 'REJECTED'
                    ? 'REJECTED'
                    : status === 'COMPLETED'
                        ? 'COMPLETED'
                        : 'IN_PROGRESS';
                await tx.task.create({
                    data: {
                        serviceRequestId: id,
                        status: tStatus,
                        notes: note || `Status updated to ${status}`,
                        assignedToUserId: actionByUserId,
                    },
                });
            }
            return tx.serviceRequest.update({
                where: { id },
                data: {
                    status,
                    ...(receiptToken ? { referralToken: receiptToken } : {}),
                },
                include: { patient: true, destFacility: true },
            });
        });
        await this.audit.log({
            userId: actionByUserId,
            action: `REFERRAL_${status}`,
            resource: 'ServiceRequest',
            resourceId: id,
            details: note ?? `Referral status transitioned to ${status}`,
            ipAddress,
        });
        this.events.emitReferralUpdated({ referralId: id, status, note });
        if (status === 'ACCEPTED' && updated.patient.phone && receiptToken) {
            await this.notifications.sendReferralAcceptedSMS(updated.patient.phone, receiptToken, updated.destFacility.name);
        }
        return updated;
    }
    async updateReferralPriority(id, priority, actionByUserId, ipAddress) {
        const referral = await this.prisma.serviceRequest.findUnique({ where: { id } });
        if (!referral)
            throw new common_1.NotFoundException(`Referral ${id} not found.`);
        const updated = await this.prisma.serviceRequest.update({
            where: { id },
            data: { priority },
        });
        await this.audit.log({
            userId: actionByUserId,
            action: 'REFERRAL_PRIORITY_UPDATED',
            resource: 'ServiceRequest',
            resourceId: id,
            details: `Priority changed to ${priority}`,
            ipAddress,
        });
        return updated;
    }
};
exports.TriageService = TriageService;
exports.TriageService = TriageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        events_gateway_1.EventsGateway,
        audit_service_1.AuditService])
], TriageService);
//# sourceMappingURL=triage.service.js.map