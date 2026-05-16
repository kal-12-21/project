import { PrismaService } from '../prisma.service';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(entry: {
        userId?: string;
        action: string;
        resource: string;
        resourceId?: string;
        details?: string;
        ipAddress?: string;
    }): Promise<{
        id: string;
        action: string;
        resource: string;
        resourceId: string | null;
        details: string | null;
        timestamp: Date;
        ipAddress: string | null;
        userId: string | null;
    }>;
    getAuditTrail(limit?: number, offset?: number): Promise<{
        events: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
            action: string;
            resource: string;
            resourceId: string | null;
            details: string | null;
            timestamp: Date;
            ipAddress: string | null;
            userId: string | null;
        })[];
        total: number;
        limit: number;
        offset: number;
    }>;
}
