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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const SendGrid = require("@sendgrid/mail");
const bcryptjs_1 = require("bcryptjs");
const mongoose_2 = require("mongoose");
const books_model_1 = require("../books/books.model");
const user_model_1 = require("../user/user.model");
const otp_model_1 = require("./otp.model");
let MailService = class MailService {
    constructor(otpModel, userModel, booksModel, configService) {
        this.otpModel = otpModel;
        this.userModel = userModel;
        this.booksModel = booksModel;
        this.configService = configService;
        SendGrid.setApiKey(this.configService.get('SEND_GRID_KEY'));
    }
    async sendOtpVerification(email, isUser) {
        if (!email)
            throw new common_1.ForbiddenException('email_is_required');
        if (isUser) {
            const existUser = await this.userModel.findOne({ email });
            if (!existUser)
                throw new common_1.UnauthorizedException('user_not_found');
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const salt = await (0, bcryptjs_1.genSalt)(10);
        const hashedOtp = await (0, bcryptjs_1.hash)(String(otp), salt);
        const emailData = {
            to: email,
            subject: 'Verification email',
            from: 'dilbarxudoyberdiyeva71@gmail.com',
            html: `
				<h1>Verification Code: ${otp}</h1>
			`,
        };
        await this.otpModel.create({ email: email, otp: hashedOtp, expireAt: Date.now() + 3600000 });
        await SendGrid.send(emailData);
        return 'Success';
    }
    async verifyOtp(email, otpVerification) {
        if (!otpVerification)
            throw new common_1.BadRequestException('send_otp_verification');
        const userExistOtp = await this.otpModel.find({ email });
        const { expireAt, otp } = userExistOtp.slice(-1)[0];
        if (expireAt < new Date()) {
            await this.otpModel.deleteMany({ email });
            throw new common_1.BadRequestException('expired_code');
        }
        const validOtp = await (0, bcryptjs_1.compare)(otpVerification, otp);
        if (!validOtp)
            throw new common_1.BadRequestException('otp_is_incorrect');
        await this.otpModel.deleteMany({ email });
        return 'Success';
    }
    async recieveBooks(bookId, userId) {
        const user = await this.userModel.findById(userId);
        const book = await this.booksModel.findById(bookId);
        const emailData = {
            to: user.email,
            subject: 'Ordered book',
            from: 'dilbarxudoyberdiyeva71@gmail.com',
            html: `
				<a href="${book.pdf}">Your ordered book - ${book.title}</a>
			`,
        };
        await SendGrid.send(emailData);
        return 'Success';
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(otp_model_1.Otp.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(books_model_1.Books.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map