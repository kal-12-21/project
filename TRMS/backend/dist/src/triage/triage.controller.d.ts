import { TriageService } from './triage.service';
import { ReferralStatus, Priority } from '@prisma/client';
export declare class UpdateStatusDto {
    status: ReferralStatus;
    note?: string;
}
export declare class UpdatePriorityDto {
    priority: Priority;
}
export declare class TriageController {
    private readonly triageService;
    constructor(triageService: TriageService);
    getPendingRequests(facilityId: string | undefined, req: any): Promise<({
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
    updateStatus(id: string, body: UpdateStatusDto, req: any): Promise<{
        success: boolean;
        status: import("@prisma/client").$Enums.ReferralStatus;
        message: string;
    }>;
    updatePriority(id: string, body: UpdatePriorityDto, req: any): Promise<{
        success: boolean;
        priority: import("@prisma/client").$Enums.Priority;
        message: string;
    }>;
}
