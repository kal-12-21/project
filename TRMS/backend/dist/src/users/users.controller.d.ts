import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, data: any): Promise<{
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
    updatePassword(req: any, data: any): Promise<{
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
    uploadPhoto(req: any, file: any): Promise<{
        url: string;
    }>;
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
    create(createUserDto: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        facilityId: string | null;
    }>;
    update(id: string, updateUserDto: any, req: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        facilityId: string | null;
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
