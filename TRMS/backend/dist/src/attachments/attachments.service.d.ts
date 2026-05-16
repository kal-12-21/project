import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
export declare class AttachmentsService {
    private readonly prisma;
    private readonly logger;
    private readonly storageDir;
    constructor(prisma: PrismaService);
    storeAttachmentBase64(serviceRequestId: string, file: {
        name: string;
        type: string;
        dataUrl: string;
        sizeKb: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        type: string;
        filePath: string;
        sizeKb: number;
        serviceRequestId: string;
    }>;
    getAttachmentStream(id: string): Promise<{
        stream: fs.ReadStream;
        attachment: {
            id: string;
            createdAt: Date;
            name: string;
            type: string;
            filePath: string;
            sizeKb: number;
            serviceRequestId: string;
        };
    }>;
}
