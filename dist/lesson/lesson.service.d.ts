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
import { Section } from 'src/section/section.model';
import { LessonDto } from './lesson.dto';
import { Lesson } from './lesson.model';
export declare class LessonService {
    private sectionModel;
    private lessonModel;
    constructor(sectionModel: Model<Section>, lessonModel: Model<Lesson>);
    createLesson(body: LessonDto, sectionId: string): Promise<import("mongoose").Document<unknown, {}, Section> & Omit<Section & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    editLesson(body: LessonDto, lessonId: string): Promise<import("mongoose").Document<unknown, {}, Lesson> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    deleteLesson(sectionId: string, lessonId: string): Promise<import("mongoose").Document<unknown, {}, Section> & Omit<Section & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    getLesson(sectionId: string): Promise<Lesson[]>;
    completeLesson(userId: string, lessonId: string): Promise<import("mongoose").Document<unknown, {}, Lesson> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    uncompleteLesson(userId: string, lessonId: string): Promise<import("mongoose").Document<unknown, {}, Lesson> & Omit<Lesson & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
}
