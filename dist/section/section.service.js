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
exports.SectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_model_1 = require("../course/course.model");
const section_model_1 = require("./section.model");
let SectionService = class SectionService {
    constructor(sectionModel, courseModel) {
        this.sectionModel = sectionModel;
        this.courseModel = courseModel;
    }
    async createSection({ title }, courseId) {
        const section = await this.sectionModel.create({ title });
        const course = await this.courseModel
            .findByIdAndUpdate(courseId, {
            $push: { sections: section._id },
        }, { new: true })
            .populate({ path: 'sections', populate: { path: 'lessons' } });
        return course.sections;
    }
    async deleteSection(sectionId, courseId) {
        await this.sectionModel.findByIdAndRemove(sectionId);
        const course = await this.courseModel
            .findByIdAndUpdate(courseId, {
            $pull: { sections: sectionId },
        }, { new: true })
            .populate({ path: 'sections', populate: { path: 'lessons' } });
        return course.sections;
    }
    async editSection(sectionId, { title, lessons }) {
        return await this.sectionModel
            .findByIdAndUpdate(sectionId, { $set: { title, lessons } }, { new: true })
            .populate('lessons');
    }
    async getSection(courseId) {
        const course = await this.courseModel
            .findById(courseId)
            .populate({ path: 'sections', populate: { path: 'lessons' } });
        return course.sections;
    }
};
SectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(section_model_1.Section.name)),
    __param(1, (0, mongoose_1.InjectModel)(course_model_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SectionService);
exports.SectionService = SectionService;
//# sourceMappingURL=section.service.js.map