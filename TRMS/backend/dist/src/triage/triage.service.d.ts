import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsGateway } from '../events/events.gateway';
import { AuditService } from '../audit/audit.service';
import { ReferralStatus, Priority } from '@prisma/client';
export declare class TriageService {
    private readonly prisma;
    private readonly notifications;
    private readonly events;
    private readonly audit;
    constructor(prisma: PrismaService, notifications: NotificationsService, events: EventsGateway, audit: AuditService);
    getPendingReferrals(facilityId?: string): Promise<({
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            sex: import("@prisma/client").$Enums.Gender;
            age: number | null;
            createdAt: Date;
            updatedAt: Date;
            mrn: string;
            allergies: string[];
            medications: string[];
            diagnoses: string[];
            clinicalNotes: string | null;
        };
        attachments: {
            id: string;
            createdAt: Date;
            name: string;
            type: string;
            filePath: string;
            sizeKb: number;
            serviceRequestId: string;
        }[];
        destFacility: {
            id: string;
            status: import("@prisma/client").$Enums.FacilityStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            region: string;
            zone: string | null;
            woreda: string | null;
            levelOfCare: string | null;
        };
        originFacility: {
            id: string;
            status: import("@prisma/client").$Enums.FacilityStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            region: string;
            zone: string | null;
            woreda: string | null;
            levelOfCare: string | null;
        };
        tasks: {
            id: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            createdAt: Date;
            updatedAt: Date;
            serviceRequestId: string;
            notes: string | null;
            assignedToUserId: string | null;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ReferralStatus;
        createdAt: Date;
        updatedAt: Date;
        selectedServiceId: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        clinicalSummary: string;
        referralToken: string | null;
        patientId: string;
        originId: string;
        destId: string;
    })[]>;
    updateReferralStatus(id: string, status: ReferralStatus, note?: string, actionByUserId?: string, ipAddress?: string): Promise<{
        patient: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            sex: import("@prisma/client").$Enums.Gender;
            age: number | null;
            createdAt: Date;
            updatedAt: Date;
            mrn: string;
            allergies: string[];
            medications: string[];
            diagnoses: string[];
            clinicalNotes: string | null;
        };
        destFacility: {
            id: string;
            status: import("@prisma/client").$Enums.FacilityStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            region: string;
            zone: string | null;
            woreda: string | null;
            levelOfCare: string | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ReferralStatus;
        createdAt: Date;
        updatedAt: Date;
        selectedServiceId: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        clinicalSummary: string;
        referralToken: string | null;
        patientId: string;
        originId: string;
        destId: string;
    }>;
    updateReferralPriority(id: string, priority: Priority, actionByUserId?: string, ipAddress?: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ReferralStatus;
        createdAt: Date;
        updatedAt: Date;
        selectedServiceId: string | null;
        priority: import("@prisma/client").$Enums.Priority;
        clinicalSummary: string;
        referralToken: string | null;
        patientId: string;
        originId: string;
        destId: string;
    }>;
}
