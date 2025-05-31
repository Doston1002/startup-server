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
exports.InstructorController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const user_decorator_1 = require("../user/decorators/user.decorator");
const instructor_dto_1 = require("./dto/instructor.dto");
const instructor_service_1 = require("./instructor.service");
let InstructorController = class InstructorController {
    constructor(instructorService) {
        this.instructorService = instructorService;
    }
    async applyAsInstructor(dto) {
        return this.instructorService.applyAsInstructor(dto);
    }
    async getAllCourses(_id) {
        return this.instructorService.getAllCourses(_id);
    }
    async getDetailedCourse(slug) {
        return this.instructorService.getDetailedCourse(slug);
    }
    async getInstructors(language, limit) {
        return this.instructorService.getInstructors(language, limit);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('apply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [instructor_dto_1.InstructorApplyDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "applyAsInstructor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('course-all'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('course/:slug'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getDetailedCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('language')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getInstructors", null);
InstructorController = __decorate([
    (0, common_1.Controller)('instructor'),
    __metadata("design:paramtypes", [instructor_service_1.InstructorService])
], InstructorController);
exports.InstructorController = InstructorController;
//# sourceMappingURL=instructor.controller.js.map