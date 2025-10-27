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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const user_decorator_1 = require("../user/decorators/user.decorator");
const mail_service_1 = require("./mail.service");
let MailController = class MailController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async sendOtp(dto) {
        return this.mailService.sendOtpVerification(dto.email, dto.isUser);
    }
    async verifyOtp(dto) {
        return this.mailService.verifyOtp(dto.email, dto.otpVerification);
    }
    recieveBooks(bookId, _id) {
        return this.mailService.recieveBooks(bookId, _id);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('send-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('books/:bookId'),
    (0, auth_decorator_1.Auth)('USER'),
    __param(0, (0, common_1.Param)('bookId')),
    __param(1, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MailController.prototype, "recieveBooks", null);
MailController = __decorate([
    (0, common_1.Controller)('mail'),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map