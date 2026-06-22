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
        isBlocked: boolean;
    }[]>;
    searchUser(email: string, limit: number): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
        isBlocked: boolean;
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
        isBlocked: boolean;
    }>;
    createUser(email: string, fullName: string, password: string, role?: 'ADMIN' | 'INSTRUCTOR' | 'USER'): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
        isBlocked: boolean;
    }>;
    updateUser(userId: string, email?: string, fullName?: string, password?: string, role?: 'ADMIN' | 'INSTRUCTOR' | 'USER'): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
        isBlocked: boolean;
    }>;
    deleteUser(userId: string): Promise<{
        message: string;
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
    blockUser(userId: string): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
        isBlocked: boolean;
    }>;
    unblockUser(userId: string): Promise<{
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
        isBlocked: boolean;
    }>;
    getUserSpecificFiled(user: UserDocument): {
        email: string;
        fullName: string;
        id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
        isBlocked: boolean;
    };
    getSpecificFieldCourse(course: CourseDocument): {
        title: string;
        previewImage: string;
        isActive: boolean;
        language: string;
        _id: import("mongoose").Types.ObjectId;
    };
}
