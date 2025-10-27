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
import { Contact, ContactDocument } from './contact.model';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from 'src/contact/dto/update-contact.dto';
export declare class ContactService {
    private contactModel;
    constructor(contactModel: Model<ContactDocument>);
    create(createContactDto: CreateContactDto): Promise<import("mongoose").Document<unknown, {}, ContactDocument> & Contact & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(limit?: number, page?: number): Promise<{
        contacts: {
            id: any;
            fullName: string;
            phone: string;
            message: string;
            isRead: boolean;
            status: "pending" | "replied" | "closed";
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: any;
        fullName: string;
        phone: string;
        message: string;
        isRead: boolean;
        status: "pending" | "replied" | "closed";
        createdAt: Date;
    }>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<{
        id: any;
        fullName: string;
        phone: string;
        message: string;
        isRead: boolean;
        status: "pending" | "replied" | "closed";
        createdAt: Date;
    }>;
    markAsRead(id: string): Promise<{
        id: any;
        fullName: string;
        phone: string;
        message: string;
        isRead: boolean;
        status: "pending" | "replied" | "closed";
        createdAt: Date;
    }>;
    updateStatus(id: string, status: 'pending' | 'replied' | 'closed'): Promise<{
        id: any;
        fullName: string;
        phone: string;
        message: string;
        isRead: boolean;
        status: "pending" | "replied" | "closed";
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: any;
        fullName: string;
        phone: string;
        message: string;
        isRead: boolean;
        status: "pending" | "replied" | "closed";
        createdAt: Date;
    }>;
    getUnreadCount(): Promise<number>;
    private transformContact;
}
