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
/// <reference types="mongoose/types/inferschematype" />
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { CustomerService } from 'src/customer/customer.service';
import { UserDocument } from 'src/user/user.model';
import { LoginAuthDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { OneIdUserData } from './oneid.service';
export declare class AuthService {
    private userModel;
    private readonly jwtService;
    private readonly customerService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, customerService: CustomerService);
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
    processOneIdUser(oneIdData: OneIdUserData): Promise<{
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
    private mapOneIdToUser;
    getNewTokens({ refreshToken }: TokenDto): Promise<{
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
    checkUser(email: string): Promise<"user" | "no-user">;
    isExistUser(email: string): Promise<UserDocument>;
    issueTokenPair(userId: string): Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
    getUserField(user: UserDocument): {
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
}
