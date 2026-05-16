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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const audit_service_1 = require("../audit/audit.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                status: true,
                facilityId: true,
                department: true,
                phone: true,
                sex: true,
                age: true,
                occupationDate: true,
                createdAt: true,
                facility: {
                    select: { name: true },
                },
            },
        });
    }
    async create(data) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        if (!data.password)
            throw new common_1.BadRequestException('Password is required');
        if (!data.role)
            throw new common_1.BadRequestException('Role is required');
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new common_1.ConflictException('Email already in use');
        }
        let facilityId = data.facilityId || null;
        if (facilityId === '')
            facilityId = null;
        if ((data.role === client_1.Role.LIAISON_OFFICER || data.role === client_1.Role.NURSE) && !facilityId) {
            throw new common_1.BadRequestException(`${data.role === client_1.Role.NURSE ? 'Nurses' : 'Liaison Officers'} must be assigned to a facility`);
        }
        if (facilityId) {
            const facility = await this.prisma.facility.findUnique({ where: { id: facilityId } });
            if (!facility)
                throw new common_1.BadRequestException('Invalid facility ID');
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                department: data.department || null,
                facilityId,
                phone: data.phone || null,
                sex: data.sex || 'UNKNOWN',
                age: data.age ? parseInt(String(data.age)) : null,
                occupationDate: data.occupationDate ? new Date(data.occupationDate) : null,
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, facilityId: true },
        });
    }
    async update(id, data, adminId, ipAddress) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const allowedFields = [
            'firstName',
            'lastName',
            'email',
            'role',
            'status',
            'facilityId',
            'department',
            'phone',
            'sex',
            'age',
            'occupationDate',
        ];
        const updateData = {};
        for (const key of allowedFields) {
            if (data[key] !== undefined)
                updateData[key] = data[key];
        }
        if (data.password) {
            updateData.passwordHash = await bcrypt_1.default.hash(data.password, 10);
        }
        if (updateData.status === '')
            delete updateData.status;
        if (updateData.facilityId === '')
            updateData.facilityId = null;
        if (updateData.department === '')
            updateData.department = null;
        if (updateData.phone === '')
            updateData.phone = null;
        const finalRole = updateData.role || user.role;
        if (finalRole === client_1.Role.NURSE || finalRole === client_1.Role.LIAISON_OFFICER) {
            if (Object.keys(data).includes('facilityId') && !updateData.facilityId) {
                throw new common_1.BadRequestException(`${finalRole === client_1.Role.NURSE ? 'Nurses' : 'Liaison Officers'} must be assigned to a facility`);
            }
        }
        if (updateData.occupationDate) {
            updateData.occupationDate = new Date(updateData.occupationDate);
        }
        if (updateData.age) {
            updateData.age = parseInt(String(updateData.age));
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, email: true, status: true, role: true, facilityId: true },
        });
        if (adminId) {
            await this.auditService.log({
                userId: adminId,
                action: 'UPDATE_USER',
                resource: 'User',
                resourceId: id,
                details: `Updated user fields`,
                ipAddress,
            });
        }
        return updatedUser;
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { facility: { select: { name: true } } },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { passwordHash, ...result } = user;
        return result;
    }
    async updateProfile(id, data) {
        const allowedFields = ['firstName', 'lastName', 'phone', 'sex', 'age', 'department'];
        const updateData = {};
        for (const key of allowedFields) {
            if (data[key] !== undefined)
                updateData[key] = data[key];
        }
        if (updateData.age)
            updateData.age = parseInt(String(updateData.age));
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    async updatePassword(id, data) {
        const { currentPassword, newPassword } = data;
        if (!currentPassword || !newPassword) {
            throw new common_1.BadRequestException('Current and new passwords are required');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.ForbiddenException('Current password is incorrect');
        }
        this.validatePasswordPolicy(newPassword);
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        return this.prisma.user.update({
            where: { id },
            data: {
                passwordHash,
                lastPasswordChange: new Date()
            },
        });
    }
    async updatePhoto(id, filePath) {
        return this.prisma.user.update({
            where: { id },
            data: { profilePicture: filePath },
        });
    }
    async remove(id, adminId, ipAddress) {
        if (adminId && id === adminId) {
            throw new common_1.BadRequestException('Administrators cannot delete their own active account.');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.delete({ where: { id } });
        if (adminId) {
            await this.auditService.log({
                userId: adminId,
                action: 'DELETE_USER',
                resource: 'User',
                resourceId: id,
                details: `Permanently deleted user: ${user.email} (${user.role})`,
                ipAddress,
            });
        }
        return { success: true };
    }
    validatePasswordPolicy(password) {
        if (password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one special character');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map