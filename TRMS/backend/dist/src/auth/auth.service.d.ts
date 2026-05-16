import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    validateUserById(id: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    signup(name: string, email: string, pass: string, role: Role): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        sex: import("@prisma/client").$Enums.Gender;
        age: number | null;
        role: import("@prisma/client").$Enums.Role;
        department: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        occupationDate: Date | null;
        facilityId: string | null;
        profilePicture: string | null;
        lastPasswordChange: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    auditLoginSuccess(userId: string, email: string, ipAddress?: string): Promise<void>;
    auditLoginFailure(email: string, ipAddress?: string): Promise<void>;
    auditLogout(userId: string, email: string, ipAddress?: string): Promise<void>;
    auditSignup(userId: string, email: string, ipAddress?: string): Promise<void>;
}
