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
import { Course } from 'src/course/course.model';
import { SectionDto } from './section.dto';
import { Section } from './section.model';
export declare class SectionService {
    private sectionModel;
    private courseModel;
    constructor(sectionModel: Model<Section>, courseModel: Model<Course>);
    createSection({ title }: SectionDto, courseId: string): Promise<Section[]>;
    deleteSection(sectionId: string, courseId: string): Promise<Section[]>;
    editSection(sectionId: string, { title, lessons }: SectionDto): Promise<import("mongoose").Document<unknown, {}, Section> & Omit<Section & {
        _id: import("mongoose").Types.ObjectId;
    }, never>>;
    getSection(courseId: string): Promise<Section[]>;
}
