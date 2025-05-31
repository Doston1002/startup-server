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
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/course/course.model';
import { UserDocument } from 'src/user/user.model';
import { InstructorApplyDto } from './dto/instructor.dto';
import { InstructorDocument } from './instructor.model';
export declare class InstructorService {
    private userModel;
    private instructorModel;
    private courseModel;
    constructor(userModel: Model<UserDocument>, instructorModel: Model<InstructorDocument>, courseModel: Model<CourseDocument>);
    applyAsInstructor(dto: InstructorApplyDto): Promise<string>;
    getAllCourses(author: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>)[]>;
    getDetailedCourse(slug: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    getInstructors(language: string, limit: string): Promise<{
        avatar: string;
        fullName: string;
        totalCourses: number;
        job: string;
    }[]>;
    getSpecificFieldInstructor(instructor: InstructorDocument): {
        avatar: string;
        fullName: string;
        totalCourses: number;
        job: string;
    };
}
