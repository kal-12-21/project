import { ReferralsService } from './referrals.service';
export declare class ReferralsController {
    private readonly referralsService;
    constructor(referralsService: ReferralsService);
    getMyReferrals(req: any): Promise<({
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
    getIncomingReferrals(req: any): Promise<({
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
    updateStatus(id: string, body: {
        status: string;
        clinicalNote?: string;
    }): Promise<{
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
}
