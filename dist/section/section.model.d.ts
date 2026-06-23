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
import { Lesson } from 'src/lesson/lesson.model';
export type SectionDocument = HydratedDocument<Section>;
export declare class Section {
    title: string;
    lessons: Lesson[];
}
export declare const SectionSchema: SchemaMS<Section, import("mongoose").Model<Section, any, any, any, import("mongoose").Document<unknown, any, Section> & Omit<Section & {
    _id: import("mongoose").Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Section, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Section>> & Omit<import("mongoose").FlatRecord<Section> & {
    _id: import("mongoose").Types.ObjectId;
}, never>>;
