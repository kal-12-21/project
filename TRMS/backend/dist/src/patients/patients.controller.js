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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PatientsController = class PatientsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrUpdatePatient(patientData) {
        if (!patientData.mrn)
            throw new Error('MRN required');
        return this.prisma.patient.upsert({
            where: { mrn: patientData.mrn },
            update: {
                firstName: patientData.firstName,
                lastName: patientData.lastName,
                phone: patientData.phone || null,
                age: patientData.age || null,
                sex: patientData.sex,
            },
            create: {
                mrn: patientData.mrn,
                firstName: patientData.firstName,
                lastName: patientData.lastName,
                phone: patientData.phone || null,
                age: patientData.age || null,
                sex: patientData.sex,
            },
        });
    }
    async search(q) {
        if (!q || q.trim().length < 2)
            return [];
        const term = q.trim();
        return this.prisma.patient.findMany({
            where: {
                OR: [
                    { mrn: { contains: term, mode: 'insensitive' } },
                    { firstName: { contains: term, mode: 'insensitive' } },
                    { lastName: { contains: term, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                mrn: true,
                firstName: true,
                lastName: true,
                sex: true,
                age: true,
                phone: true,
            },
            take: 8,
            orderBy: { mrn: 'asc' },
        });
    }
    async getPatientHistory(id) {
        const patient = await this.prisma.patient.findUnique({
            where: { id },
            include: {
                referrals: {
                    include: {
                        originFacility: { select: { name: true } },
                        destFacility: { select: { name: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!patient)
            return null;
        return {
            demographics: {
                id: patient.id,
                mrn: patient.mrn,
                firstName: patient.firstName,
                lastName: patient.lastName,
                phone: patient.phone,
                age: patient.age,
                sex: patient.sex,
            },
            allergies: patient.allergies || [],
            medications: patient.medications || [],
            diagnoses: patient.diagnoses || [],
            clinicalNotes: patient.clinicalNotes || '',
            referrals: patient.referrals.map((r) => ({
                id: r.id,
                originName: r.originFacility?.name || 'Unknown Origin',
                destName: r.destFacility?.name || 'Unknown Destination',
                status: r.status,
                clinicalSummary: r.clinicalSummary,
                createdAt: r.createdAt,
            })),
        };
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "createOrUpdatePatient", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPatientHistory", null);
exports.PatientsController = PatientsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/patients'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map