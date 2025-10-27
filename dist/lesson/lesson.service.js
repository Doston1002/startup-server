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
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const section_model_1 = require("../section/section.model");
const lesson_model_1 = require("./lesson.model");
let LessonService = class LessonService {
    constructor(sectionModel, lessonModel) {
        this.sectionModel = sectionModel;
        this.lessonModel = lessonModel;
    }
    async createLesson(body, sectionId) {
        const lesson = await this.lessonModel.create(body);
        const section = await this.sectionModel
            .findByIdAndUpdate(sectionId, {
            $push: { lessons: lesson._id },
        }, { new: true })
            .populate('lessons');
        return section;
    }
    async editLesson(body, lessonId) {
        const lesson = await this.lessonModel.findByIdAndUpdate(lessonId, body, { new: true });
        return lesson;
    }
    async deleteLesson(sectionId, lessonId) {
        await this.lessonModel.findByIdAndRemove(lessonId);
        const section = this.sectionModel
            .findByIdAndUpdate(sectionId, { $pull: { lessons: lessonId } }, { new: true })
            .populate('lessons');
        return section;
    }
    async getLesson(sectionId) {
        const section = await this.sectionModel.findById(sectionId).populate('lessons');
        return section.lessons;
    }
    async completeLesson(userId, lessonId) {
        const lesson = await this.lessonModel.findByIdAndUpdate(lessonId, { $push: { completed: userId } }, { new: true });
        return lesson;
    }
    async uncompleteLesson(userId, lessonId) {
        const lesson = await this.lessonModel.findByIdAndUpdate(lessonId, { $pull: { completed: userId } }, { new: true });
        return lesson;
    }
};
LessonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(section_model_1.Section.name)),
    __param(1, (0, mongoose_1.InjectModel)(lesson_model_1.Lesson.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], LessonService);
exports.LessonService = LessonService;
//# sourceMappingURL=lesson.service.js.map