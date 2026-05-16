"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async validateUserById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (user) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id || user.userId,
            role: user.role,
            facilityId: user.facilityId,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async signup(name, email, pass, role) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(pass, 10);
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        const newUser = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                role,
            },
        });
        const { passwordHash: _, ...result } = newUser;
        return result;
    }
    async auditLoginSuccess(userId, email, ipAddress) {
        await this.prisma.auditEvent.create({
            data: {
                userId,
                action: 'LOGIN_SUCCESS',
                resource: 'Auth',
                resourceId: userId,
                details: `User ${email} signed in successfully.`,
                ipAddress: ipAddress ?? null,
            },
        });
    }
    async auditLoginFailure(email, ipAddress) {
        await this.prisma.auditEvent.create({
            data: {
                userId: null,
                action: 'LOGIN_FAILURE',
                resource: 'Auth',
                resourceId: null,
                details: `Failed login attempt for email: ${email}`,
                ipAddress: ipAddress ?? null,
            },
        });
    }
    async auditLogout(userId, email, ipAddress) {
        await this.prisma.auditEvent.create({
            data: {
                userId,
                action: 'LOGOUT',
                resource: 'Auth',
                resourceId: userId,
                details: `User ${email} signed out.`,
                ipAddress: ipAddress ?? null,
            },
        });
    }
    async auditSignup(userId, email, ipAddress) {
        await this.prisma.auditEvent.create({
            data: {
                userId,
                action: 'ADMIN_SELF_REGISTRATION',
                resource: 'Auth',
                resourceId: userId,
                details: `New administrator account registered: ${email}`,
                ipAddress: ipAddress ?? null,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map