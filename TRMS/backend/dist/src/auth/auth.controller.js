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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("./optional-jwt-auth.guard");
const client_1 = require("@prisma/client");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(body, res, req) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            await this.authService.auditLoginFailure(body.email, req.ip);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { access_token, user: userData } = await this.authService.login(user);
        await this.authService.auditLoginSuccess(user.id, user.email, req.ip);
        res.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        });
        return { message: 'Logged in successfully', user: userData, token: access_token };
    }
    async signup(body, res, req) {
        const { name, email, password, role, authCode } = body;
        if (!name || !email || !password || !authCode) {
            throw new common_1.BadRequestException('Name, email, password, and authorization code are required.');
        }
        if (!email.toLowerCase().endsWith('@trms.gov.et')) {
            throw new common_1.BadRequestException('Security Policy: Administrator accounts must use an official @trms.gov.et address.');
        }
        const expectedCode = process.env.NODE_ENV === 'production'
            ? process.env.ADMIN_ACCESS_CODE
            : (process.env.ADMIN_ACCESS_CODE || 'TRMS-ADMIN-2026');
        if (!expectedCode || authCode !== expectedCode) {
            throw new common_1.BadRequestException('Invalid authorization code.');
        }
        if (role !== client_1.Role.ADMINISTRATOR) {
            throw new common_1.ForbiddenException('Public registration is restricted to Administrator accounts. ' +
                'Other user accounts must be created by an Administrator from the Users panel.');
        }
        const user = await this.authService.signup(name, email, password, client_1.Role.ADMINISTRATOR);
        await this.authService.auditSignup(user.id, email, req.ip);
        const { access_token, user: userData } = await this.authService.login(user);
        res.cookie('Authentication', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        });
        return { message: 'Administrator account created successfully', user: userData, token: access_token };
    }
    async getSession(req) {
        if (!req.user)
            return null;
        const fullUser = await this.authService.validateUserById(req.user.userId);
        if (!fullUser)
            return null;
        const { access_token } = await this.authService.login(fullUser);
        return { user: fullUser, token: access_token };
    }
    async logout(res, req) {
        if (req.user?.userId) {
            await this.authService.auditLogout(req.user.userId, req.user.email, req.ip);
        }
        res.clearCookie('Authentication');
        return { message: 'Logged out successfully' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)('session'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map