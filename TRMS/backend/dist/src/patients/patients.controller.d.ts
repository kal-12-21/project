import { PrismaService } from '../prisma.service';
export declare class PatientsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createOrUpdatePatient(patientData: any): Promise<{
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
    }>;
    search(q: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        sex: import("@prisma/client").$Enums.Gender;
        age: number | null;
        mrn: string;
    }[]>;
    getPatientHistory(id: string): Promise<{
        demographics: {
            id: string;
            mrn: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            age: number | null;
            sex: import("@prisma/client").$Enums.Gender;
        };
        allergies: string[];
        medications: string[];
        diagnoses: string[];
        clinicalNotes: string;
        referrals: {
            id: string;
            originName: string;
            destName: string;
            status: import("@prisma/client").$Enums.ReferralStatus;
            clinicalSummary: string;
            createdAt: Date;
        }[];
    } | null>;
}
