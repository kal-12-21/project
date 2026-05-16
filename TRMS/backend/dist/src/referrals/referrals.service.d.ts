import { PrismaService } from '../prisma.service';
export declare class ReferralsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyReferrals(facilityId?: string): Promise<({
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
    getIncomingReferrals(facilityId: string): Promise<({
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
    updateReferralStatus(id: string, status: string, clinicalNote?: string): Promise<{
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
    getAllReferrals(): Promise<({
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
}
