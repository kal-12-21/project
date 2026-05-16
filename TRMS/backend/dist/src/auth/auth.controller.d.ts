import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: Record<string, string>, res: Response, req: Request): Promise<{
        message: string;
        user: any;
        token: string;
    }>;
    signup(body: Record<string, string>, res: Response, req: Request): Promise<{
        message: string;
        user: any;
        token: string;
    }>;
    getSession(req: any): Promise<{
        user: any;
        token: string;
    } | null>;
    logout(res: Response, req: any): Promise<{
        message: string;
    }>;
}
