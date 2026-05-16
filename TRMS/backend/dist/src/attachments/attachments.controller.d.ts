import { AttachmentsService } from './attachments.service';
import type { Response } from 'express';
import { AuditService } from '../audit/audit.service';
export declare class AttachmentsController {
    private readonly attachmentsService;
    private readonly auditService;
    constructor(attachmentsService: AttachmentsService, auditService: AuditService);
    downloadAttachment(id: string, res: Response, req: any): Promise<void>;
}
