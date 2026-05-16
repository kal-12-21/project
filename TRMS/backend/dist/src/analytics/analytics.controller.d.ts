import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSummary(): Promise<{
        total: number;
        accepted: number;
        rejected: number;
        completed: number;
        activeFacilities: number;
        rejectionRate: string;
        weeklyData: any[];
        byStatus: {
            status: import("@prisma/client").$Enums.ReferralStatus;
            count: number;
        }[];
        byPriority: {
            priority: import("@prisma/client").$Enums.Priority;
            count: number;
        }[];
        topDestinations: {
            facilityId: string;
            count: number;
        }[];
    }>;
    getComprehensiveReports(): Promise<{
        volumeByFacility: {
            facility: string;
            count: number;
        }[];
        volumeByDepartment: {
            department: string;
            count: number;
        }[];
        routingRates: {
            status: import("@prisma/client").$Enums.ReferralStatus;
            count: number;
        }[];
        priorityVolume: {
            priority: import("@prisma/client").$Enums.Priority;
            count: number;
        }[];
        demographics: {
            bySex: {
                sex: string;
                count: number;
            }[];
            byAge: {
                ageBracket: string;
                count: number;
            }[];
        };
        metrics: {
            avgTurnaroundHours: number;
            offlineSyncDelay: string;
            noShowRate: string;
        };
    }>;
}
