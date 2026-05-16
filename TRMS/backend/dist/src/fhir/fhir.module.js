"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhirModule = void 0;
const common_1 = require("@nestjs/common");
const fhir_controller_1 = require("./fhir.controller");
const fhir_mapper_service_1 = require("./fhir-mapper.service");
const prisma_service_1 = require("../prisma.service");
const events_module_1 = require("../events/events.module");
let FhirModule = class FhirModule {
};
exports.FhirModule = FhirModule;
exports.FhirModule = FhirModule = __decorate([
    (0, common_1.Module)({
        imports: [events_module_1.EventsModule],
        controllers: [fhir_controller_1.FhirController],
        providers: [fhir_mapper_service_1.FhirMapperService, prisma_service_1.PrismaService],
        exports: [fhir_mapper_service_1.FhirMapperService],
    })
], FhirModule);
//# sourceMappingURL=fhir.module.js.map