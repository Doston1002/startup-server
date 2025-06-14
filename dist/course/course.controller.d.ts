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
import { CourseBodyDto } from './coourse.dto';
import { CourseService } from './course.service';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    createCourse(dto: CourseBodyDto, _id: string): Promise<string>;
    editCourse(dto: CourseBodyDto, courseId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    deleteCourse(courseId: string, _id: string): Promise<string>;
    activateCourse(courseId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    draftCourse(courseId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>>;
    dragCourseSections(courseId: string, body: {
        sections: string[];
    }): Promise<import("../section/section.model").Section[]>;
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
    getAllAdminCourses(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never>> & Omit<import("mongoose").Document<unknown, {}, import("./course.model").Course> & Omit<import("./course.model").Course & {
        _id: import("mongoose").Types.ObjectId;
    }, never> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>)[]>;
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
    enrollUser(_id: string, courseId: string): Promise<string>;
}
