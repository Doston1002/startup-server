import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { CourseDocument } from 'src/course/course.model';
import { InstructorDocument } from 'src/instructor/instructor.model';
import { UserDocument } from 'src/user/user.model';
import Stripe from 'stripe';
export declare class AdminService {
    private instructorModel;
    private userModel;
    private courseModel;
    private readonly stripeClient;
    private readonly configService;
    constructor(instructorModel: Model<InstructorDocument>, userModel: Model<UserDocument>, courseModel: Model<CourseDocument>, stripeClient: Stripe, configService: ConfigService);
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
        _id: import("mongoose").Types.ObjectId;
        role: import("../user/user.interface").RoleUser;
        createdAt: string;
    }[]>;
    searchUser(email: string, limit: number): Promise<{
        email: string;
        fullName: string;
        _id: import("mongoose").Types.ObjectId;
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
        _id: import("mongoose").Types.ObjectId;
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
