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
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: LoginAuthDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            avatar: string;
            role: import("../user/user.interface").RoleUser;
            courses: import("../course/course.model").Course[];
            createdAt: string;
            birthday: string;
            bio: string;
            job: string;
        };
    }>;
    login(dto: LoginAuthDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            avatar: string;
            role: import("../user/user.interface").RoleUser;
            courses: import("../course/course.model").Course[];
            createdAt: string;
            birthday: string;
            bio: string;
            job: string;
        };
    }>;
    getNewTokens(dto: TokenDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            avatar: string;
            role: import("../user/user.interface").RoleUser;
            courses: import("../course/course.model").Course[];
            createdAt: string;
            birthday: string;
            bio: string;
            job: string;
        };
    }>;
    checkUser(dto: {
        email: string;
    }): Promise<"user" | "no-user">;
    checkInstructo(_id: string): Promise<boolean>;
}
