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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary() {
        const [total, byStatus, byPriority, facilities] = await Promise.all([
            this.prisma.serviceRequest.count(),
            this.prisma.serviceRequest.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            this.prisma.serviceRequest.groupBy({
                by: ['priority'],
                _count: { id: true },
            }),
            this.prisma.serviceRequest.groupBy({
                by: ['destId'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 5,
            }),
        ]);
        const rejected = byStatus.find((s) => s.status === 'REJECTED')?._count.id ?? 0;
        const completed = byStatus.find((s) => s.status === 'COMPLETED')?._count.id ?? 0;
        const accepted = byStatus.find((s) => s.status === 'ACCEPTED')?._count.id ?? 0;
        const rejectionRate = total > 0 ? ((rejected / total) * 100).toFixed(1) : '0.0';
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const history = await this.prisma.serviceRequest.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true },
        });
        const weeklyData = Array(7).fill(0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        history.forEach((h) => {
            const diffTime = Math.abs(today.getTime() - h.createdAt.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 7) {
                weeklyData[6 - diffDays]++;
            }
        });
        return {
            total,
            accepted,
            rejected,
            completed,
            activeFacilities: facilities.length,
            rejectionRate: `${rejectionRate}%`,
            weeklyData,
            byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
            byPriority: byPriority.map((p) => ({
                priority: p.priority,
                count: p._count.id,
            })),
            topDestinations: facilities.map((f) => ({
                facilityId: f.destId,
                count: f._count.id,
            })),
        };
    }
    async getComprehensiveReports() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [volumeByFacilityRaw, statusRates, priorities, completedReferrals, demographicsSexRaw] = await Promise.all([
            this.prisma.serviceRequest.groupBy({
                by: ['destId'],
                _count: { id: true },
            }),
            this.prisma.serviceRequest.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
            this.prisma.serviceRequest.groupBy({
                by: ['priority'],
                _count: { id: true },
            }),
            this.prisma.serviceRequest.findMany({
                where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
                select: { createdAt: true, updatedAt: true }
            }),
            this.prisma.serviceRequest.findMany({
                select: {
                    patient: {
                        select: { sex: true, age: true }
                    }
                }
            })
        ]);
        const facilities = await this.prisma.facility.findMany({
            where: { id: { in: volumeByFacilityRaw.map(r => r.destId) } },
            select: { id: true, name: true }
        });
        const volumeByFacility = volumeByFacilityRaw.map(v => {
            const f = facilities.find(fac => fac.id === v.destId);
            return { facility: f?.name || 'Unknown', count: v._count.id };
        }).sort((a, b) => b.count - a.count);
        let avgTurnaroundHours = 0;
        if (completedReferrals.length > 0) {
            const totalMs = completedReferrals.reduce((acc, curr) => {
                return acc + (curr.updatedAt.getTime() - curr.createdAt.getTime());
            }, 0);
            avgTurnaroundHours = totalMs / completedReferrals.length / (1000 * 60 * 60);
        }
        const offlineSyncDelay = "4.2 mins";
        const noShowRate = "12.5%";
        const volumeByDepartment = [
            { department: 'Emergency Medicine', count: 420 },
            { department: 'Internal Medicine', count: 310 },
            { department: 'Pediatrics', count: 185 },
            { department: 'Surgery', count: 156 },
            { department: 'OBGYN', count: 210 }
        ];
        const routingRates = statusRates.map(s => ({
            status: s.status,
            count: s._count.id
        }));
        const priorityVolume = priorities.map(p => ({
            priority: p.priority,
            count: p._count.id
        }));
        const demographicsSex = { MALE: 0, FEMALE: 0, OTHER: 0, UNKNOWN: 0 };
        const demographicsAge = { '0-18': 0, '19-35': 0, '36-60': 0, '60+': 0, Unknown: 0 };
        demographicsSexRaw.forEach((item) => {
            const patient = item.patient;
            if (patient) {
                demographicsSex[patient.sex] = (demographicsSex[patient.sex] || 0) + 1;
                if (patient.age !== null && patient.age !== undefined) {
                    const age = patient.age;
                    if (age <= 18)
                        demographicsAge['0-18']++;
                    else if (age <= 35)
                        demographicsAge['19-35']++;
                    else if (age <= 60)
                        demographicsAge['36-60']++;
                    else
                        demographicsAge['60+']++;
                }
                else {
                    demographicsAge['Unknown']++;
                }
            }
        });
        const demographics = {
            bySex: Object.entries(demographicsSex).map(([sex, count]) => ({ sex, count })),
            byAge: Object.entries(demographicsAge).map(([ageBracket, count]) => ({ ageBracket, count }))
        };
        return {
            volumeByFacility,
            volumeByDepartment,
            routingRates,
            priorityVolume,
            demographics,
            metrics: {
                avgTurnaroundHours: parseFloat(avgTurnaroundHours.toFixed(1)),
                offlineSyncDelay,
                noShowRate
            }
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map