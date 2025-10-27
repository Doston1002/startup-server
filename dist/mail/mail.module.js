"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const books_model_1 = require("../books/books.model");
const user_model_1 = require("../user/user.model");
const mail_controller_1 = require("./mail.controller");
const mail_service_1 = require("./mail.service");
const otp_model_1 = require("./otp.model");
let MailModule = class MailModule {
};
MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: otp_model_1.Otp.name, schema: otp_model_1.OtpSchema },
                { name: user_model_1.User.name, schema: user_model_1.UserSchema },
                { name: books_model_1.Books.name, schema: books_model_1.BooksSchema },
            ]),
        ],
        controllers: [mail_controller_1.MailController],
        providers: [mail_service_1.MailService],
    })
], MailModule);
exports.MailModule = MailModule;
//# sourceMappingURL=mail.module.js.map