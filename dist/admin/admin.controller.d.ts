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
import { ApproveInstructorDto, CreateUserDto, DeleteUserDto, UpdateUserDto, UpdateUserRoleDto } from './admin.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllInstructors(): Promise<{
        approved: boolean;
        socialMedia: string;
        _id: import("mongoose").Types.ObjectId;
        author: {
            fullName: string;
            email: string;
            job: string;
        };
    }[]>;
    aproveInstructor(body: ApproveInstructorDto): Promise<string>;
    deleteInstructor(body: ApproveInstructorDto): Promise<string>;
    getAllUsers(limit: string): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }[]>;
    searchUser(email: string, limit: string): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }[]>;
    deleteCourse(courseId: string): Promise<{
        title: string;
        previewImage: string;
        isActive: boolean;
        language: string;
        _id: import("mongoose").Types.ObjectId;
    }[]>;
    updateUserRole(body: UpdateUserRoleDto): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }>;
    createUser(body: CreateUserDto): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }>;
    updateUser(body: UpdateUserDto): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }>;
    deleteUser(body: DeleteUserDto): Promise<{
        message: string;
    }>;
}
