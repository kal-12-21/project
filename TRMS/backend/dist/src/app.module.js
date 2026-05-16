"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const sync_module_1 = require("./sync/sync.module");
const triage_module_1 = require("./triage/triage.module");
const notifications_module_1 = require("./notifications/notifications.module");
const analytics_module_1 = require("./analytics/analytics.module");
const audit_module_1 = require("./audit/audit.module");
const patients_module_1 = require("./patients/patients.module");
const events_module_1 = require("./events/events.module");
const fhir_module_1 = require("./fhir/fhir.module");
const health_controller_1 = require("./health.controller");
const directory_module_1 = require("./directory/directory.module");
const attachments_module_1 = require("./attachments/attachments.module");
const users_module_1 = require("./users/users.module");
const referrals_module_1 = require("./referrals/referrals.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'storage'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            sync_module_1.SyncModule,
            triage_module_1.TriageModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            audit_module_1.AuditModule,
            patients_module_1.PatientsModule,
            events_module_1.EventsModule,
            fhir_module_1.FhirModule,
            directory_module_1.DirectoryModule,
            attachments_module_1.AttachmentsModule,
            users_module_1.UsersModule,
            referrals_module_1.ReferralsModule,
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map