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
exports.SectionController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const section_dto_1 = require("./section.dto");
const section_service_1 = require("./section.service");
let SectionController = class SectionController {
    constructor(sectionService) {
        this.sectionService = sectionService;
    }
    async createSection(dto, courseId) {
        return this.sectionService.createSection(dto, courseId);
    }
    async deleteSection(sectionId, courseId) {
        return this.sectionService.deleteSection(sectionId, courseId);
    }
    async editSection(sectionId, dto) {
        return this.sectionService.editSection(sectionId, dto);
    }
    async getSection(courseId) {
        return this.sectionService.getSection(courseId);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('create/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [section_dto_1.SectionDto, String]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "createSection", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('delete/:sectionId/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('sectionId')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "deleteSection", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('edit/:sectionId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('sectionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, section_dto_1.SectionDto]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "editSection", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('get/:courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SectionController.prototype, "getSection", null);
SectionController = __decorate([
    (0, common_1.Controller)('section'),
    __metadata("design:paramtypes", [section_service_1.SectionService])
], SectionController);
exports.SectionController = SectionController;
//# sourceMappingURL=section.controller.js.map