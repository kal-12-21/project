"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AttachmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const buffer_1 = require("buffer");
let AttachmentsService = AttachmentsService_1 = class AttachmentsService {
    prisma;
    logger = new common_1.Logger(AttachmentsService_1.name);
    storageDir = path.join(process.cwd(), 'storage', 'attachments');
    constructor(prisma) {
        this.prisma = prisma;
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
        }
    }
    async storeAttachmentBase64(serviceRequestId, file) {
        try {
            const matches = file.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let buffer;
            if (matches && matches.length === 3) {
                buffer = buffer_1.Buffer.from(matches[2], 'base64');
            }
            else {
                buffer = buffer_1.Buffer.from(file.dataUrl, 'base64');
            }
            const ext = path.extname(file.name) || (file.type.includes('pdf') ? '.pdf' : '.jpg');
            const filename = `${(0, uuid_1.v4)()}${ext}`;
            const filePath = path.join(this.storageDir, filename);
            fs.writeFileSync(filePath, buffer);
            const attachment = await this.prisma.attachment.create({
                data: {
                    serviceRequestId,
                    name: file.name,
                    type: file.type,
                    filePath: filename,
                    sizeKb: file.sizeKb,
                },
            });
            return attachment;
        }
        catch (e) {
            this.logger.error(`Failed to store attachment ${file.name}`, e);
            throw e;
        }
    }
    async getAttachmentStream(id) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('Attachment not found');
        }
        const filePath = path.join(this.storageDir, attachment.filePath);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('File not found on disk');
        }
        return {
            stream: fs.createReadStream(filePath),
            attachment,
        };
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = AttachmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map