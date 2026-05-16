import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditTrail(limit: number, offset: number): Promise<{
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
