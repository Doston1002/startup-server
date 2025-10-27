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
import { SectionDto } from './section.dto';
import { SectionService } from './section.service';
export declare class SectionController {
    private readonly sectionService;
    constructor(sectionService: SectionService);
    createSection(dto: SectionDto, courseId: string): Promise<import("./section.model").Section[]>;
    deleteSection(sectionId: string, courseId: string): Promise<import("./section.model").Section[]>;
    editSection(sectionId: string, dto: SectionDto): Promise<import("mongoose").Document<unknown, {}, import("./section.model").Section> & import("./section.model").Section & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getSection(courseId: string): Promise<import("./section.model").Section[]>;
}
