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
exports.DirectoryController = void 0;
const common_1 = require("@nestjs/common");
const directory_service_1 = require("./directory.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
let DirectoryController = class DirectoryController {
    directoryService;
    constructor(directoryService) {
        this.directoryService = directoryService;
    }
    async getFacilities() {
        return this.directoryService.getFacilities();
    }
    async getServices() {
        return this.directoryService.getServices();
    }
    async getClinicalServices() {
        return this.directoryService.getClinicalServices();
    }
    async createClinicalService(data) {
        return this.directoryService.createClinicalService(data);
    }
    async updateServiceStatus(id, status) {
        if (!Object.values(client_1.ServiceStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid status value');
        }
        return this.directoryService.updateServiceStatus(id, status);
    }
    async createFacility(data) {
        return this.directoryService.createFacility(data);
    }
    async updateFacility(id, data) {
        return this.directoryService.updateFacility(id, data);
    }
    async deleteFacility(id) {
        return this.directoryService.deleteFacility(id);
    }
    async addService(id, data) {
        return this.directoryService.addServiceToFacility(id, data);
    }
    async createEquipment(data) {
        return this.directoryService.createEquipment(data);
    }
    async linkEquipment(facilityServiceId, equipmentId, isMandatory = true) {
        return this.directoryService.linkEquipmentToFacilityService(facilityServiceId, equipmentId, isMandatory);
    }
    async updateEquipmentStatus(id, functional, status) {
        return this.directoryService.updateEquipmentStatus(id, functional, status);
    }
    async updateServiceCapacity(id, bedsTotal, bedsAvailable, waitlistCount, status, statusNote) {
        if (status && !Object.values(client_1.ServiceStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid ServiceStatus value');
        }
        return this.directoryService.updateServiceCapacity(id, bedsTotal, bedsAvailable, waitlistCount, status, statusNote);
    }
    async updateSpecialistQueue(id, availableCount, currentWaitlist) {
        return this.directoryService.updateSpecialistQueue(id, availableCount, currentWaitlist);
    }
};
exports.DirectoryController = DirectoryController;
__decorate([
    (0, common_1.Get)('facilities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "getFacilities", null);
__decorate([
    (0, common_1.Get)('services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)('clinical-services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "getClinicalServices", null);
__decorate([
    (0, common_1.Post)('clinical-services'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "createClinicalService", null);
__decorate([
    (0, common_1.Patch)('service/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "updateServiceStatus", null);
__decorate([
    (0, common_1.Post)('facilities'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "createFacility", null);
__decorate([
    (0, common_1.Patch)('facilities/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "updateFacility", null);
__decorate([
    (0, common_1.Delete)('facilities/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "deleteFacility", null);
__decorate([
    (0, common_1.Post)('facilities/:id/services'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "addService", null);
__decorate([
    (0, common_1.Post)('equipment'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "createEquipment", null);
__decorate([
    (0, common_1.Post)('service/:id/equipment'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('equipmentId')),
    __param(2, (0, common_1.Body)('isMandatory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "linkEquipment", null);
__decorate([
    (0, common_1.Patch)('equipment/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR, client_1.Role.LIAISON_OFFICER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('functional')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "updateEquipmentStatus", null);
__decorate([
    (0, common_1.Patch)('service/:id/capacity'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR, client_1.Role.LIAISON_OFFICER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('bedsTotal')),
    __param(2, (0, common_1.Body)('bedsAvailable')),
    __param(3, (0, common_1.Body)('waitlistCount')),
    __param(4, (0, common_1.Body)('status')),
    __param(5, (0, common_1.Body)('statusNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "updateServiceCapacity", null);
__decorate([
    (0, common_1.Patch)('queue/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMINISTRATOR, client_1.Role.LIAISON_OFFICER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('availableCount')),
    __param(2, (0, common_1.Body)('currentWaitlist')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], DirectoryController.prototype, "updateSpecialistQueue", null);
exports.DirectoryController = DirectoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/directory'),
    __metadata("design:paramtypes", [directory_service_1.DirectoryService])
], DirectoryController);
//# sourceMappingURL=directory.controller.js.map