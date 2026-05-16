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
exports.FhirController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const fhir_mapper_service_1 = require("./fhir-mapper.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const events_gateway_1 = require("../events/events.gateway");
let FhirController = class FhirController {
    prisma;
    fhir;
    events;
    constructor(prisma, fhir, events) {
        this.prisma = prisma;
        this.fhir = fhir;
        this.events = events;
    }
    async ingestBundle(bundle) {
        const { patientData, serviceRequestData } = this.fhir.parseFhirBundle(bundle);
        const result = await this.prisma.$transaction(async (tx) => {
            const patient = await tx.patient.upsert({
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
            const ensureFacility = async (id, name) => tx.facility.upsert({
                where: { code: id },
                update: {},
                create: { id, code: id, name, region: 'Tigray' },
            });
            await ensureFacility(serviceRequestData.originFacilityId, 'Origin Default');
            const destFacility = await ensureFacility(serviceRequestData.destFacilityId, 'Destination Default');
            const serviceRequest = await tx.serviceRequest.create({
                data: {
                    patientId: patient.id,
                    originId: serviceRequestData.originFacilityId,
                    destId: serviceRequestData.destFacilityId,
                    priority: serviceRequestData.priority,
                    clinicalSummary: serviceRequestData.clinicalSummary || null,
                    status: 'SUBMITTED',
                },
            });
            return { serviceRequest, patient, destFacility };
        });
        this.events.emitNewReferral({
            referralId: result.serviceRequest.id,
            patientMrn: result.patient.mrn,
            priority: result.serviceRequest.priority,
            destFacilityId: result.serviceRequest.destId,
            destFacilityName: result.destFacility.name,
        });
        return {
            success: true,
            message: 'Referral ingested successfully via FHIR Bundle',
            referralId: result.serviceRequest.id,
        };
    }
    async getPatient(id) {
        const patient = await this.prisma.patient.findUnique({ where: { id } });
        if (!patient)
            throw new common_1.NotFoundException(`Patient/${id} not found`);
        return this.fhir.toFhirPatient(patient);
    }
    async getServiceRequest(id) {
        const ref = await this.prisma.serviceRequest.findUnique({
            where: { id },
            include: { patient: true, originFacility: true, destFacility: true },
        });
        if (!ref)
            throw new common_1.NotFoundException(`ServiceRequest/${id} not found`);
        return this.fhir.toFhirServiceRequest(ref);
    }
    async getServiceRequestEverything(id) {
        const ref = await this.prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                patient: true,
                originFacility: true,
                destFacility: true,
                tasks: true,
            },
        });
        if (!ref)
            throw new common_1.NotFoundException(`ServiceRequest/${id} not found`);
        const resources = [
            this.fhir.toFhirPatient(ref.patient),
            this.fhir.toFhirServiceRequest(ref),
            ...ref.tasks.map((t) => this.fhir.toFhirTask(t, ref.id)),
        ];
        return this.fhir.toBundle(resources, 'collection');
    }
};
exports.FhirController = FhirController;
__decorate([
    (0, common_1.Post)('Bundle'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FhirController.prototype, "ingestBundle", null);
__decorate([
    (0, common_1.Get)('Patient/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FhirController.prototype, "getPatient", null);
__decorate([
    (0, common_1.Get)('ServiceRequest/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FhirController.prototype, "getServiceRequest", null);
__decorate([
    (0, common_1.Get)('ServiceRequest/:id/everything'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FhirController.prototype, "getServiceRequestEverything", null);
exports.FhirController = FhirController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/fhir'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fhir_mapper_service_1.FhirMapperService,
        events_gateway_1.EventsGateway])
], FhirController);
//# sourceMappingURL=fhir.controller.js.map