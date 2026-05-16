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
exports.DirectoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let DirectoryService = class DirectoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getServices() {
        return this.prisma.facilityService.findMany({
            include: {
                equipmentLinks: { include: { equipment: true } },
                specialistQueues: true,
                facility: true,
                clinicalService: true,
            },
        });
    }
    async getClinicalServices() {
        const count = await this.prisma.clinicalServiceDirectory.count();
        if (count === 0) {
            await this.prisma.clinicalServiceDirectory.createMany({
                data: [
                    { name: 'Emergency Room (ER)', category: 'Emergency' },
                    { name: 'Intensive Care Unit (ICU)', category: 'Intensive Care' },
                    { name: 'Neonatal ICU (NICU)', category: 'Maternal/Child' },
                    { name: 'Pediatrics', category: 'Pediatrics' },
                    { name: 'Maternity/Labor & Delivery', category: 'Maternal/Child' },
                    { name: 'General Surgery', category: 'Surgical' },
                    { name: 'Orthopedics', category: 'Surgical' },
                    { name: 'Internal Medicine', category: 'General' },
                    { name: 'Cardiology', category: 'Specialized' },
                    { name: 'Neurology', category: 'Specialized' },
                    { name: 'Oncology', category: 'Specialized' },
                    { name: 'Psychiatry', category: 'Mental Health' },
                ]
            });
        }
        return this.prisma.clinicalServiceDirectory.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async createClinicalService(data) {
        return this.prisma.clinicalServiceDirectory.create({
            data: {
                name: data.name,
                category: data.category,
                description: data.description || '',
            }
        });
    }
    async getFacilities() {
        return this.prisma.facility.findMany({
            include: {
                equipments: true,
                services: {
                    include: {
                        clinicalService: true,
                        equipmentLinks: {
                            include: { equipment: true }
                        }
                    }
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async updateServiceStatus(id, status) {
        const service = await this.prisma.facilityService.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`FacilityService with ID ${id} not found`);
        }
        return this.prisma.facilityService.update({
            where: { id },
            data: { status },
            include: {
                equipmentLinks: true,
                specialistQueues: true,
            },
        });
    }
    async createFacility(data) {
        const existing = await this.prisma.facility.findUnique({ where: { code: data.code } });
        if (existing)
            throw new common_1.ConflictException('Facility code already exists');
        return this.prisma.facility.create({
            data: {
                name: data.name,
                code: data.code,
                region: data.region,
                zone: data.zone,
                woreda: data.woreda,
                levelOfCare: data.levelOfCare,
                status: data.status || client_1.FacilityStatus.OPERATIONAL,
                services: data.selectedServiceIds?.length > 0 ? {
                    create: data.selectedServiceIds.map((srvId) => ({
                        clinicalServiceId: srvId,
                        status: client_1.ServiceStatus.OPERATIONAL,
                        waitlistCount: 0,
                        bedsTotal: 0,
                        bedsAvailable: 0
                    }))
                } : undefined
            }
        });
    }
    async updateFacility(id, data) {
        const result = await this.prisma.facility.update({
            where: { id },
            data: {
                name: data.name,
                region: data.region,
                zone: data.zone,
                woreda: data.woreda,
                levelOfCare: data.levelOfCare,
                status: data.status,
            }
        });
        if (data.selectedServiceIds && Array.isArray(data.selectedServiceIds)) {
            const existing = await this.prisma.facilityService.findMany({ where: { facilityId: id } });
            const existingIds = existing.map(e => e.clinicalServiceId);
            const toRemove = existingIds.filter(eId => !data.selectedServiceIds.includes(eId));
            const toAdd = data.selectedServiceIds.filter((srvId) => !existingIds.includes(srvId));
            if (toRemove.length > 0) {
                await this.prisma.facilityService.deleteMany({
                    where: { facilityId: id, clinicalServiceId: { in: toRemove } }
                });
            }
            if (toAdd.length > 0) {
                await this.prisma.facilityService.createMany({
                    data: toAdd.map((cId) => ({
                        facilityId: id,
                        clinicalServiceId: cId,
                        status: client_1.ServiceStatus.OPERATIONAL,
                        waitlistCount: 0,
                        bedsTotal: 0,
                        bedsAvailable: 0
                    }))
                });
            }
        }
        return result;
    }
    async deleteFacility(id) {
        return this.prisma.facility.delete({ where: { id } });
    }
    async addServiceToFacility(facilityId, data) {
        return this.prisma.facilityService.create({
            data: {
                facilityId,
                clinicalServiceId: data.clinicalServiceId,
                status: data.status || client_1.ServiceStatus.OPERATIONAL,
                bedsTotal: data.bedsTotal ? parseInt(String(data.bedsTotal)) : 0,
                bedsAvailable: data.bedsAvailable ? parseInt(String(data.bedsAvailable)) : 0,
            }
        });
    }
    async evaluateServiceStatus(id) {
        const service = await this.prisma.facilityService.findUnique({
            where: { id },
            include: {
                equipmentLinks: {
                    include: { equipment: true }
                }
            }
        });
        if (!service)
            return;
        let status = service.bedsAvailable > 0 ? client_1.ServiceStatus.OPERATIONAL : client_1.ServiceStatus.FULL;
        let statusNote = service.bedsAvailable > 0 ? '' : 'Service is currently full.';
        const brokenMandatory = service.equipmentLinks.filter(l => l.isMandatory && !l.equipment.functional);
        if (brokenMandatory.length > 0) {
            status = client_1.ServiceStatus.UNAVAILABLE;
            statusNote = `Mandatory equipment offline: ${brokenMandatory.map(m => m.equipment.name).join(', ')}`;
        }
        await this.prisma.facilityService.update({
            where: { id },
            data: { status, statusNote }
        });
    }
    async createEquipment(data) {
        return this.prisma.equipment.create({
            data: {
                facilityId: data.facilityId,
                name: data.name,
                category: data.category,
                status: 'FUNCTIONAL',
                functional: true,
                lastChecked: new Date()
            }
        });
    }
    async updateEquipmentStatus(id, functional, status) {
        const eq = await this.prisma.equipment.update({
            where: { id },
            data: { functional, status, lastChecked: new Date() },
            include: {
                serviceLinks: true
            }
        });
        for (const link of eq.serviceLinks) {
            await this.evaluateServiceStatus(link.facilityServiceId);
        }
        return eq;
    }
    async linkEquipmentToFacilityService(facilityServiceId, equipmentId, isMandatory = true) {
        const link = await this.prisma.serviceEquipmentRequirement.create({
            data: {
                facilityServiceId,
                equipmentId,
                isMandatory
            }
        });
        await this.evaluateServiceStatus(facilityServiceId);
        return link;
    }
    async updateServiceCapacity(id, bedsTotal, bedsAvailable, waitlistCount, status, statusNote) {
        const service = await this.prisma.facilityService.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`FacilityService with ID ${id} not found`);
        }
        const data = {};
        if (bedsTotal !== undefined)
            data.bedsTotal = parseInt(String(bedsTotal), 10);
        if (bedsAvailable !== undefined)
            data.bedsAvailable = parseInt(String(bedsAvailable), 10);
        if (waitlistCount !== undefined)
            data.waitlistCount = parseInt(String(waitlistCount), 10);
        await this.prisma.facilityService.update({
            where: { id },
            data
        });
        await this.evaluateServiceStatus(id);
        return this.prisma.facilityService.findUnique({ where: { id } });
    }
    async updateSpecialistQueue(id, availableCount, currentWaitlist) {
        return this.prisma.specialistQueue.update({
            where: { id },
            data: { availableCount, currentWaitlist }
        });
    }
};
exports.DirectoryService = DirectoryService;
exports.DirectoryService = DirectoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DirectoryService);
//# sourceMappingURL=directory.service.js.map