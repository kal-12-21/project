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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriageController = exports.UpdatePriorityDto = exports.UpdateStatusDto = void 0;
const common_1 = require("@nestjs/common");
const triage_service_1 = require("./triage.service");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
class UpdateStatusDto {
    status;
    note;
}
exports.UpdateStatusDto = UpdateStatusDto;
class UpdatePriorityDto {
    priority;
}
exports.UpdatePriorityDto = UpdatePriorityDto;
let TriageController = class TriageController {
    triageService;
    constructor(triageService) {
        this.triageService = triageService;
    }
    async getPendingRequests(facilityId, req) {
        const effectiveFacilityId = req.user.role === client_1.Role.LIAISON_OFFICER
            ? req.user.facilityId
            : facilityId;
        return this.triageService.getPendingReferrals(effectiveFacilityId);
    }
    async updateStatus(id, body, req) {
        const updated = await this.triageService.updateReferralStatus(id, body.status, body.note, req.user.userId, req.ip);
        return {
            success: true,
            status: updated.status,
            message: `Referral correctly transitioned to ${updated.status}`,
        };
    }
    async updatePriority(id, body, req) {
        if (!Object.values(client_1.Priority).includes(body.priority)) {
            throw new common_1.BadRequestException(`Invalid priority value: ${body.priority}`);
        }
        const updated = await this.triageService.updateReferralPriority(id, body.priority, req.user.userId, req.ip);
        return {
            success: true,
            priority: updated.priority,
            message: `Referral priority updated to ${updated.priority}`,
        };
    }
};
exports.TriageController = TriageController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIAISON_OFFICER, client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Query)('facilityId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.Role.LIAISON_OFFICER, client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/priority'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.Role.LIAISON_OFFICER, client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePriorityDto, Object]),
    __metadata("design:returntype", Promise)
], TriageController.prototype, "updatePriority", null);
exports.TriageController = TriageController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/triage'),
    __metadata("design:paramtypes", [triage_service_1.TriageService])
], TriageController);
//# sourceMappingURL=triage.controller.js.map