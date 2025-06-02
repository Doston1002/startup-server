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
import { InstructorDocument } from 'src/instructor/instructor.model';
import { ReviewDocument } from 'src/review/review.model';
import { UserDocument } from 'src/user/user.model';
import { CourseBodyDto } from './coourse.dto';
import { Course, CourseDocument } from './course.model';
export declare class CourseService {
    private courseModel;
    private instructorModel;
    private userModel;
    private reviewModel;
    constructor(courseModel: Model<CourseDocument>, instructorModel: Model<InstructorDocument>, userModel: Model<UserDocument>, reviewModel: Model<ReviewDocument>);
    createCourse(dto: CourseBodyDto, id: string): Promise<string>;
    editCourse(dto: CourseBodyDto, courseId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    deleteCourse(courseId: string, userId: string): Promise<string>;
    activateCourse(courseId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    draftCourse(courseId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    dragCourseSections(courseId: string, sections: string[]): Promise<import("../section/section.model").Section[]>;
    getCourses(language: string, limit: string): Promise<{
        title: string;
        previewImage: string;
        level: string;
        category: string;
        _id: import("mongoose").Types.ObjectId;
        author: {
            fullName: string;
            avatar: string;
            job: string;
        };
        lessonCount: number;
        totalHour: string;
        updatedAt: string;
        learn: string[];
        requirements: string[];
        description: string;
        language: string;
        exerpt: string;
        slug: string;
        reviewCount: number;
        reviewAvg: number;
    }[]>;
    getDetailedCourse(slug: string): Promise<{
        reviewCount: number;
        reviewAvg: number;
        allStudents: number;
        title: string;
        previewImage: string;
        level: string;
        category: string;
        _id: import("mongoose").Types.ObjectId;
        author: {
            fullName: string;
            avatar: string;
            job: string;
        };
        lessonCount: number;
        totalHour: string;
        updatedAt: string;
        learn: string[];
        requirements: string[];
        description: string;
        language: string;
        exerpt: string;
        slug: string;
    }>;
    getReviewAvarage(ratingArr: number[]): number;
    getSpecificFieldCourse(course: CourseDocument & {
        reviewCount: number;
        reviewAvg: number;
    }): {
        title: string;
        previewImage: string;
        level: string;
        category: string;
        _id: import("mongoose").Types.ObjectId;
        author: {
            fullName: string;
            avatar: string;
            job: string;
        };
        lessonCount: number;
        totalHour: string;
        updatedAt: string;
        learn: string[];
        requirements: string[];
        description: string;
        language: string;
        exerpt: string;
        slug: string;
        reviewCount: number;
        reviewAvg: number;
    };
    getTotalHours(course: CourseDocument): string;
    getAdminCourses(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, Course> & Omit<Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>)[]>;
    enrollUser(userID: string, courseId: string): Promise<string>;
}
