import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    syncReferrals(drafts: any[]): Promise<{
        success: boolean;
        message: string;
        syncedIds?: undefined;
    } | {
        success: boolean;
        message: string;
        syncedIds: string[];
    }>;
}
