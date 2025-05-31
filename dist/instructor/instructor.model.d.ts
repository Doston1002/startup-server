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
import { Course } from 'src/course/course.model';
import { User } from 'src/user/user.model';
export type InstructorDocument = HydratedDocument<Instructor>;
export declare class Instructor {
    socialMedia: string;
    author: User;
    approved: boolean;
    language: string;
    courses: Course[];
}
export declare const InstructorSchema: SchemaMS<Instructor, import("mongoose").Model<Instructor, any, any, any, import("mongoose").Document<unknown, any, Instructor> & Omit<Instructor & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Instructor, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Instructor>> & Omit<import("mongoose").FlatRecord<Instructor> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
