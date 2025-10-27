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
import { HydratedDocument, Schema as SchemaMS } from 'mongoose';
import { Section } from 'src/section/section.model';
import { User } from 'src/user/user.model';
export type CourseDocument = HydratedDocument<Course>;
export declare class Course {
    author: User;
    sections: Section[];
    slug: string;
    isActive: boolean;
    learn: string[];
    requirements: string[];
    tags: string[];
    description: string;
    level: string;
    category: string;
    previewImage: string;
    title: string;
    exerpt: string;
    language: string;
    updatedAt: string;
}
export declare const CourseSchema: SchemaMS<Course, import("mongoose").Model<Course, any, any, any, import("mongoose").Document<unknown, any, Course> & Course & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
}>;
