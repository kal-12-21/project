import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
export declare class UsersService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    findAll(): Promise<{
        facility: {
            name: string;
        } | null;
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
        createdAt: Date;
    }[]>;
    create(data: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        facilityId: string | null;
    }>;
    update(id: string, data: any, adminId?: string, ipAddress?: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        facilityId: string | null;
    }>;
    findOne(id: string): Promise<{
        facility: {
            name: string;
        } | null;
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
    updateProfile(id: string, data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string;
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
    updatePassword(id: string, data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string;
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
    updatePhoto(id: string, filePath: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
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
    remove(id: string, adminId?: string, ipAddress?: string): Promise<{
        success: boolean;
    }>;
    private validatePasswordPolicy;
}
