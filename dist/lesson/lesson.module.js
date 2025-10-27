"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const section_model_1 = require("../section/section.model");
const lesson_controller_1 = require("./lesson.controller");
const lesson_model_1 = require("./lesson.model");
const lesson_service_1 = require("./lesson.service");
let LessonModule = class LessonModule {
};
LessonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: section_model_1.Section.name, schema: section_model_1.SectionSchema },
                { name: lesson_model_1.Lesson.name, schema: lesson_model_1.LessonSchema },
            ]),
        ],
        controllers: [lesson_controller_1.LessonController],
        providers: [lesson_service_1.LessonService],
    })
], LessonModule);
exports.LessonModule = LessonModule;
//# sourceMappingURL=lesson.module.js.map