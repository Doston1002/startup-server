import { Request } from 'express';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';
import { OneIdLogoutDto } from './dto/oneid-logout.dto';
import { OneIdService } from './oneid.service';
import { UserActivityLogger } from 'src/logger/user-activity.logger';
export declare class AuthController {
    private readonly authService;
    private readonly oneIdService;
    private readonly userActivityLogger;
    constructor(authService: AuthService, oneIdService: OneIdService, userActivityLogger: UserActivityLogger);
    getNewTokens(dto: TokenDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            avatar: string;
            role: "ADMIN" | "INSTRUCTOR" | "USER";
            courses: import("../course/course.model").Course[];
            createdAt: string;
            birthday: string;
            bio: string;
            job: string;
        };
    }>;
    checkUser(dto: {
        email: string;
    }): Promise<{
        readonly status: "disabled";
    }>;
    checkInstructor(_id: string): Promise<boolean>;
    logout(req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    handleOneIdCallback(body: {
        code: string;
    }, req: Request): Promise<{
        oneIdAccessToken: string;
        refreshToken: string;
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            avatar: string;
            role: "ADMIN" | "INSTRUCTOR" | "USER";
            courses: import("../course/course.model").Course[];
            createdAt: string;
            birthday: string;
            bio: string;
            job: string;
        };
        success: boolean;
    }>;
    handleOneIdLogout(dto: OneIdLogoutDto, req: Request): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
