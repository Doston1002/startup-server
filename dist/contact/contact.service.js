"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_model_1 = require("./contact.model");
let ContactService = class ContactService {
    constructor(contactModel) {
        this.contactModel = contactModel;
    }
    async create(createContactDto) {
        const contact = new this.contactModel(createContactDto);
        return contact.save();
    }
    async findAll(limit = 10, page = 1) {
        const skip = (page - 1) * limit;
        const contacts = await this.contactModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
        const total = await this.contactModel.countDocuments();
        return {
            contacts: contacts.map(contact => this.transformContact(contact)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const contact = await this.contactModel.findById(id).exec();
        return contact ? this.transformContact(contact) : null;
    }
    async update(id, updateContactDto) {
        const contact = await this.contactModel
            .findByIdAndUpdate(id, updateContactDto, { new: true })
            .exec();
        return contact ? this.transformContact(contact) : null;
    }
    async markAsRead(id) {
        const contact = await this.contactModel
            .findByIdAndUpdate(id, { isRead: true }, { new: true })
            .exec();
        return contact ? this.transformContact(contact) : null;
    }
    async updateStatus(id, status) {
        const contact = await this.contactModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
        return contact ? this.transformContact(contact) : null;
    }
    async remove(id) {
        const contact = await this.contactModel.findByIdAndDelete(id).exec();
        return contact ? this.transformContact(contact) : null;
    }
    async getUnreadCount() {
        return this.contactModel.countDocuments({ isRead: false });
    }
    transformContact(contact) {
        return {
            id: contact._id.toString(),
            fullName: contact.fullName,
            phone: contact.phone,
            message: contact.message,
            isRead: contact.isRead,
            status: contact.status,
            createdAt: contact.createdAt || new Date(),
        };
    }
};
ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_model_1.Contact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContactService);
exports.ContactService = ContactService;
//# sourceMappingURL=contact.service.js.map