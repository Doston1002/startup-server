/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
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
