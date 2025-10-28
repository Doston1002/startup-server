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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    sendMessage(createContactDto: CreateContactDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./contact.model").ContactDocument> & import("./contact.model").Contact & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getMessages(limit?: string, page?: string, type?: 'contact' | 'attendance'): Promise<{
        contacts: {
            id: any;
            fullName: string;
            phone: string;
            message: string;
            teacherName: string;
            region: string;
            district: string;
            school: string;
            schoolClass: string;
            subject: string;
            teachingMethod: string;
            isAbsent: boolean;
            type: "contact" | "attendance";
            isRead: boolean;
            status: "pending" | "replied" | "closed";
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUnreadCount(): Promise<{
        unreadCount: number;
    }>;
    getMessage(id: string): Promise<{
        message: string;
        data: {
            id: any;
            fullName: string;
            phone: string;
            message: string;
            teacherName: string;
            region: string;
            district: string;
            school: string;
            schoolClass: string;
            subject: string;
            teachingMethod: string;
            isAbsent: boolean;
            type: "contact" | "attendance";
            isRead: boolean;
            status: "pending" | "replied" | "closed";
            createdAt: Date;
        };
    }>;
    markAsRead(id: string): Promise<{
        message: string;
        data: {
            id: any;
            fullName: string;
            phone: string;
            message: string;
            teacherName: string;
            region: string;
            district: string;
            school: string;
            schoolClass: string;
            subject: string;
            teachingMethod: string;
            isAbsent: boolean;
            type: "contact" | "attendance";
            isRead: boolean;
            status: "pending" | "replied" | "closed";
            createdAt: Date;
        };
    }>;
    updateStatus(id: string, updateContactDto: UpdateContactDto): Promise<{
        message: string;
        data: {
            id: any;
            fullName: string;
            phone: string;
            message: string;
            teacherName: string;
            region: string;
            district: string;
            school: string;
            schoolClass: string;
            subject: string;
            teachingMethod: string;
            isAbsent: boolean;
            type: "contact" | "attendance";
            isRead: boolean;
            status: "pending" | "replied" | "closed";
            createdAt: Date;
        };
    }>;
    deleteMessage(id: string): Promise<{
        message: string;
    }>;
}
