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
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { CourseDocument } from 'src/course/course.model';
import { InstructorDocument } from 'src/instructor/instructor.model';
import { UserDocument } from 'src/user/user.model';
export declare class AdminService {
    private instructorModel;
    private userModel;
    private courseModel;
    private readonly configService;
    constructor(instructorModel: Model<InstructorDocument>, userModel: Model<UserDocument>, courseModel: Model<CourseDocument>, configService: ConfigService);
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
    aproveInstructor(instructorId: string): Promise<string>;
    deleteIntructor(instructorId: string): Promise<string>;
    getAllUsers(limit: number): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }[]>;
    searchUser(email: string, limit: number): Promise<{
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
    updateUserRole(userId: string, role: 'ADMIN' | 'INSTRUCTOR' | 'USER'): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }>;
    getSpecificField(instructor: InstructorDocument): {
        approved: boolean;
        socialMedia: string;
        _id: import("mongoose").Types.ObjectId;
        author: {
            fullName: string;
            email: string;
            job: string;
        };
    };
    getUserSpecificFiled(user: UserDocument): {
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    };
    getSpecificFieldCourse(course: CourseDocument): {
        title: string;
        previewImage: string;
        isActive: boolean;
        language: string;
        _id: import("mongoose").Types.ObjectId;
    };
}
