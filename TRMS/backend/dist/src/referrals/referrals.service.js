"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ReferralsService = class ReferralsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyReferrals(facilityId) {
        const where = {};
        if (facilityId)
            where.originId = facilityId;
        return this.prisma.serviceRequest.findMany({
            where,
            include: {
                patient: true,
                destFacility: true,
                originFacility: true,
                tasks: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getIncomingReferrals(facilityId) {
        return this.prisma.serviceRequest.findMany({
            where: { destId: facilityId },
            include: { patient: true, originFacility: true, destFacility: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateReferralStatus(id, status, clinicalNote) {
        const referral = await this.prisma.serviceRequest.findUnique({ where: { id } });
        if (!referral)
            throw new common_1.NotFoundException(`Referral ${id} not found`);
        const validStatuses = ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'REDIRECTED', 'PENDING_INFO', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }
        return this.prisma.serviceRequest.update({
            where: { id },
            data: { status: status },
            include: { patient: true, originFacility: true, destFacility: true },
        });
    }
    async getAllReferrals() {
        return this.prisma.serviceRequest.findMany({
            include: { patient: true, originFacility: true, destFacility: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReferralsService = ReferralsService;
exports.ReferralsService = ReferralsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReferralsService);
//# sourceMappingURL=referrals.service.js.map