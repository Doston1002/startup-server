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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const contact_service_1 = require("./contact.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const update_contact_dto_1 = require("./dto/update-contact.dto");
let ContactController = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    async sendMessage(createContactDto) {
        const contact = await this.contactService.create(createContactDto);
        return { message: 'Message sent successfully', data: contact };
    }
    async getMessages(limit = '10', page = '1', type) {
        return this.contactService.findAll(Number(limit), Number(page), type);
    }
    async getUnreadCount() {
        const count = await this.contactService.getUnreadCount();
        return { unreadCount: count };
    }
    async getMessage(id) {
        const message = await this.contactService.findOne(id);
        if (!message) {
            throw new common_1.NotFoundException('Contact message not found');
        }
        return { message: 'Contact message retrieved', data: message };
    }
    async markAsRead(id) {
        const message = await this.contactService.markAsRead(id);
        if (!message) {
            throw new common_1.NotFoundException('Contact message not found');
        }
        return { message: 'Contact message marked as read', data: message };
    }
    async updateStatus(id, updateContactDto) {
        const message = await this.contactService.updateStatus(id, updateContactDto.status);
        if (!message) {
            throw new common_1.NotFoundException('Contact message not found');
        }
        return { message: 'Contact message status updated', data: message };
    }
    async deleteMessage(id) {
        const message = await this.contactService.remove(id);
        if (!message) {
            throw new common_1.NotFoundException('Contact message not found');
        }
        return { message: 'Contact message deleted successfully' };
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('send-message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('messages'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getMessages", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('unread-count'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "getMessage", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(':id/read'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)(':id/status'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contact_dto_1.UpdateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "deleteMessage", null);
ContactController = __decorate([
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map