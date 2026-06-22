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
        var _a, _b, _c, _d, _e, _f;
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
            from: 'togaevn14@gmail.com',
            html: `
				<h1>Verification Code: ${otp}</h1>
			`,
        };
        try {
            await this.otpModel.create({ email: email, otp: hashedOtp, expireAt: Date.now() + 3600000 });
            await SendGrid.send(emailData);
            return 'Success';
        }
        catch (error) {
            console.error('SendGrid Error:', error);
            const statusCode = (error === null || error === void 0 ? void 0 : error.code) || ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.statusCode) || (error === null || error === void 0 ? void 0 : error.statusCode);
            const body = ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.body) || (error === null || error === void 0 ? void 0 : error.body);
            console.error('SendGrid Error Details:', { statusCode, body });
            if (statusCode === 401 || statusCode === 403) {
                const errorMessage = ((_d = (_c = body === null || body === void 0 ? void 0 : body.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Email xizmati sozlashda xatolik. API key noto\'g\'ri yoki muddati tugagan.';
                throw new common_1.UnauthorizedException(errorMessage);
            }
            const errorMessage = ((_f = (_e = body === null || body === void 0 ? void 0 : body.errors) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.message) || (body === null || body === void 0 ? void 0 : body.message) || 'Noma\'lum xatolik';
            throw new common_1.BadRequestException(`Email yuborishda xatolik: ${errorMessage}`);
        }
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
        var _a, _b, _c, _d, _e, _f;
        const user = await this.userModel.findById(userId);
        const book = await this.booksModel.findById(bookId);
        const emailData = {
            to: user.email,
            subject: 'Ordered book',
            from: 'togaevn14@gmail.com',
            html: `
				<a href="${book.pdf}">Your ordered book - ${book.title}</a>
			`,
        };
        try {
            await SendGrid.send(emailData);
            return 'Success';
        }
        catch (error) {
            console.error('SendGrid Error:', error);
            const statusCode = (error === null || error === void 0 ? void 0 : error.code) || ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.statusCode) || (error === null || error === void 0 ? void 0 : error.statusCode);
            const body = ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.body) || (error === null || error === void 0 ? void 0 : error.body);
            console.error('SendGrid Error Details:', { statusCode, body });
            if (statusCode === 401 || statusCode === 403) {
                const errorMessage = ((_d = (_c = body === null || body === void 0 ? void 0 : body.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Email xizmati sozlashda xatolik. API key noto\'g\'ri yoki muddati tugagan.';
                throw new common_1.UnauthorizedException(errorMessage);
            }
            const errorMessage = ((_f = (_e = body === null || body === void 0 ? void 0 : body.errors) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.message) || (body === null || body === void 0 ? void 0 : body.message) || 'Noma\'lum xatolik';
            throw new common_1.BadRequestException(`Email yuborishda xatolik: ${errorMessage}`);
        }
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