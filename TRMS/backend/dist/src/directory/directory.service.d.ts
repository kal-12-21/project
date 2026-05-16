import { PrismaService } from '../prisma.service';
import { ServiceStatus } from '@prisma/client';
export declare class DirectoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getServices(): Promise<({
        facility: {
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
        clinicalService: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            category: string;
        };
        specialistQueues: {
            id: string;
            updatedAt: Date;
            facilityServiceId: string;
            specialistType: string;
            availableCount: number;
            currentWaitlist: number;
        }[];
        equipmentLinks: ({
            equipment: {
                id: string;
                status: string;
                facilityId: string;
                updatedAt: Date;
                name: string;
                category: string | null;
                functional: boolean;
                lastChecked: Date | null;
            };
        } & {
            id: string;
            facilityServiceId: string;
            equipmentId: string;
            requiredQuantity: number;
            isMandatory: boolean;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ServiceStatus;
        facilityId: string;
        updatedAt: Date;
        clinicalServiceId: string;
        waitlistCount: number;
        bedsAvailable: number;
        bedsTotal: number;
        statusNote: string | null;
    })[]>;
    getClinicalServices(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        category: string;
    }[]>;
    createClinicalService(data: {
        name: string;
        category: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        category: string;
    }>;
    getFacilities(): Promise<({
        services: ({
            clinicalService: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                category: string;
            };
            equipmentLinks: ({
                equipment: {
                    id: string;
                    status: string;
                    facilityId: string;
                    updatedAt: Date;
                    name: string;
                    category: string | null;
                    functional: boolean;
                    lastChecked: Date | null;
                };
            } & {
                id: string;
                facilityServiceId: string;
                equipmentId: string;
                requiredQuantity: number;
                isMandatory: boolean;
            })[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ServiceStatus;
            facilityId: string;
            updatedAt: Date;
            clinicalServiceId: string;
            waitlistCount: number;
            bedsAvailable: number;
            bedsTotal: number;
            statusNote: string | null;
        })[];
        equipments: {
            id: string;
            status: string;
            facilityId: string;
            updatedAt: Date;
            name: string;
            category: string | null;
            functional: boolean;
            lastChecked: Date | null;
        }[];
    } & {
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
    })[]>;
    updateServiceStatus(id: string, status: ServiceStatus): Promise<{
        specialistQueues: {
            id: string;
            updatedAt: Date;
            facilityServiceId: string;
            specialistType: string;
            availableCount: number;
            currentWaitlist: number;
        }[];
        equipmentLinks: {
            id: string;
            facilityServiceId: string;
            equipmentId: string;
            requiredQuantity: number;
            isMandatory: boolean;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ServiceStatus;
        facilityId: string;
        updatedAt: Date;
        clinicalServiceId: string;
        waitlistCount: number;
        bedsAvailable: number;
        bedsTotal: number;
        statusNote: string | null;
    }>;
    createFacility(data: any): Promise<{
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
    }>;
    updateFacility(id: string, data: any): Promise<{
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
    }>;
    deleteFacility(id: string): Promise<{
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
    }>;
    addServiceToFacility(facilityId: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ServiceStatus;
        facilityId: string;
        updatedAt: Date;
        clinicalServiceId: string;
        waitlistCount: number;
        bedsAvailable: number;
        bedsTotal: number;
        statusNote: string | null;
    }>;
    evaluateServiceStatus(id: string): Promise<void>;
    createEquipment(data: {
        facilityId: string;
        name: string;
        category?: string;
    }): Promise<{
        id: string;
        status: string;
        facilityId: string;
        updatedAt: Date;
        name: string;
        category: string | null;
        functional: boolean;
        lastChecked: Date | null;
    }>;
    updateEquipmentStatus(id: string, functional: boolean, status: string): Promise<{
        serviceLinks: {
            id: string;
            facilityServiceId: string;
            equipmentId: string;
            requiredQuantity: number;
            isMandatory: boolean;
        }[];
    } & {
        id: string;
        status: string;
        facilityId: string;
        updatedAt: Date;
        name: string;
        category: string | null;
        functional: boolean;
        lastChecked: Date | null;
    }>;
    linkEquipmentToFacilityService(facilityServiceId: string, equipmentId: string, isMandatory?: boolean): Promise<{
        id: string;
        facilityServiceId: string;
        equipmentId: string;
        requiredQuantity: number;
        isMandatory: boolean;
    }>;
    updateServiceCapacity(id: string, bedsTotal: number, bedsAvailable: number, waitlistCount: number, status: ServiceStatus, statusNote: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ServiceStatus;
        facilityId: string;
        updatedAt: Date;
        clinicalServiceId: string;
        waitlistCount: number;
        bedsAvailable: number;
        bedsTotal: number;
        statusNote: string | null;
    } | null>;
    updateSpecialistQueue(id: string, availableCount: number, currentWaitlist: number): Promise<{
        id: string;
        updatedAt: Date;
        facilityServiceId: string;
        specialistType: string;
        availableCount: number;
        currentWaitlist: number;
    }>;
}
