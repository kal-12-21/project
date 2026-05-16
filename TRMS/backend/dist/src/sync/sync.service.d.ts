import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { AttachmentsService } from '../attachments/attachments.service';
export declare class SyncService {
    private prisma;
    private readonly events;
    private readonly attachmentsService;
    private readonly logger;
    constructor(prisma: PrismaService, events: EventsGateway, attachmentsService: AttachmentsService);
    processSyncBatch(drafts: any[]): Promise<string[]>;
}
