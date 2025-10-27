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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const user_decorator_1 = require("../user/decorators/user.decorator");
const coourse_dto_1 = require("./coourse.dto");
const course_service_1 = require("./course.service");
let CourseController = class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    async createCourse(dto, _id) {
        return this.courseService.createCourse(dto, _id);
    }
    async editCourse(dto, courseId) {
        return this.courseService.editCourse(dto, courseId);
    }
    async deleteCourse(courseId, _id) {
        return this.courseService.deleteCourse(courseId, _id);
    }
    async activateCourse(courseId) {
        return this.courseService.activateCourse(courseId);
    }
    async draftCourse(courseId) {
        return this.courseService.draftCourse(courseId);
    }
    async dragCourseSections(courseId, body) {
        return this.courseService.dragCourseSections(courseId, body.sections);
    }
    async getCourses(language, limit) {
        return this.courseService.getCourses(language, limit);
    }
    async getAllAdminCourses() {
        return this.courseService.getAdminCourses();
    }
    getDetailedCourse(slug) {
        return this.courseService.getDetailedCourse(slug);
    }
    enrollUser(_id, courseId) {
        return this.courseService.enrollUser(_id, courseId);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('create'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coourse_dto_1.CourseBodyDto, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "createCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Patch)('edit/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coourse_dto_1.CourseBodyDto, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "editCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('delete/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('activate/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "activateCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('draft/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "draftCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('drag/:courseId'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "dragCourseSections", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('language')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourses", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('admin-all-courses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAllAdminCourses", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('detailed-course/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "getDetailedCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('enroll-user/:courseId'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, user_decorator_1.User)('_id')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "enrollUser", null);
CourseController = __decorate([
    (0, common_1.Controller)('course'),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map