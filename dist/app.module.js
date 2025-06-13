"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const mongo_config_1 = require("./config/mongo.config");
const course_module_1 = require("./course/course.module");
const mail_module_1 = require("./mail/mail.module");
const user_module_1 = require("./user/user.module");
const instructor_module_1 = require("./instructor/instructor.module");
const file_module_1 = require("./file/file.module");
const section_module_1 = require("./section/section.module");
const lesson_module_1 = require("./lesson/lesson.module");
const admin_module_1 = require("./admin/admin.module");
const books_module_1 = require("./books/books.module");
const review_module_1 = require("./review/review.module");
const openai_module_1 = require("./openai/openai.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: mongo_config_1.getMongoDBConfig,
            }),
            auth_module_1.AuthModule,
            course_module_1.CourseModule,
            user_module_1.UserModule,
            mail_module_1.MailModule,
            instructor_module_1.InstructorModule,
            file_module_1.FileModule,
            section_module_1.SectionModule,
            lesson_module_1.LessonModule,
            admin_module_1.AdminModule,
            books_module_1.BooksModule,
            openai_module_1.OpenaiModule,
            review_module_1.ReviewModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map