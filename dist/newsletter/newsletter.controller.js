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
exports.NewsletterController = void 0;
const common_1 = require("@nestjs/common");
const newsletter_service_1 = require("./newsletter.service");
let NewsletterController = class NewsletterController {
    constructor(newsletterService) {
        this.newsletterService = newsletterService;
    }
    async subscribe(body) {
        const { email } = body;
        if (!email || typeof email !== 'string') {
            return {
                success: false,
                error: 'Email talab qilinadi',
            };
        }
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            return {
                success: false,
                error: 'Email bo\'sh bo\'lishi mumkin emas',
            };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return {
                success: false,
                error: 'Email noto\'g\'ri formatda',
            };
        }
        try {
            await this.newsletterService.subscribe(trimmedEmail);
            return {
                success: true,
                message: 'Obunaga rahmat!',
                email: trimmedEmail,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Serverda xato yuz berdi',
            };
        }
    }
    async getAllSubscribers() {
        try {
            const subscribers = await this.newsletterService.getAllSubscribers();
            return {
                success: true,
                data: subscribers,
            };
        }
        catch (error) {
            return {
                success: false,
                error: 'Ma\'lumotlarni olishda xato',
            };
        }
    }
};
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Get)('subscribers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsletterController.prototype, "getAllSubscribers", null);
NewsletterController = __decorate([
    (0, common_1.Controller)('newsletter'),
    __metadata("design:paramtypes", [newsletter_service_1.NewsletterService])
], NewsletterController);
exports.NewsletterController = NewsletterController;
//# sourceMappingURL=newsletter.controller.js.map