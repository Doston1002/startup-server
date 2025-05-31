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
exports.LessonController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const user_decorator_1 = require("../user/decorators/user.decorator");
const lesson_dto_1 = require("./lesson.dto");
const lesson_service_1 = require("./lesson.service");
let LessonController = class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }
    async createLesson(dto, sectionId) {
        return this.lessonService.createLesson(dto, sectionId);
    }
    async editLesson(dto, lessonId) {
        return this.lessonService.editLesson(dto, lessonId);
    }
    async deleteLesson(lessonId, sectionId) {
        return this.lessonService.deleteLesson(sectionId, lessonId);
    }
    async getLesson(sectionId) {
        return this.lessonService.getLesson(sectionId);
    }
    async completeLesson(_id, lessonId) {
        return this.lessonService.completeLesson(_id, lessonId);
    }
    async uncompleteLesson(_id, lessonId) {
        return this.lessonService.uncompleteLesson(_id, lessonId);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('create/:sectionId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lesson_dto_1.LessonDto, String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "createLesson", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('edit/:lessonId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lesson_dto_1.LessonDto, String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "editLesson", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('delete/:lessonId/:sectionId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Param)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "deleteLesson", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('get/:sectionId'),
    __param(0, (0, common_1.Param)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "getLesson", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('complete/:lessonId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, user_decorator_1.User)('_id')),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "completeLesson", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('uncomplete/:lessonId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, user_decorator_1.User)('_id')),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "uncompleteLesson", null);
LessonController = __decorate([
    (0, common_1.Controller)('lesson'),
    __metadata("design:paramtypes", [lesson_service_1.LessonService])
], LessonController);
exports.LessonController = LessonController;
//# sourceMappingURL=lesson.controller.js.map