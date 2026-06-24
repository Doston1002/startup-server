import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { CustomerService } from 'src/customer/customer.service';
import { UserDocument } from 'src/user/user.model';
import { TokenDto } from './dto/token.dto';
import { OneIdUserData } from './oneid.service';
import { TokenBlacklistService } from './token-blacklist.service';
export declare class AuthService {
    private userModel;
    private readonly jwtService;
    private readonly customerService;
    private readonly tokenBlacklistService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, customerService: CustomerService, tokenBlacklistService: TokenBlacklistService);
    processOneIdUser(oneIdData: OneIdUserData): Promise<{
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
    private mapOneIdToUser;
    getNewTokens({ refreshToken }: TokenDto): Promise<{
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
    isExistUser(email: string): Promise<UserDocument>;
    issueTokenPair(userId: string): Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
    logout(accessToken: string, refreshToken?: string): Promise<void>;
    getUserField(user: UserDocument): {
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
}
