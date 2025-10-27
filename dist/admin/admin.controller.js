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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const admin_dto_1 = require("./admin.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAllInstructors() {
        return this.adminService.getAllInstructors();
    }
    async aproveInstructor(body) {
        return this.adminService.aproveInstructor(body.instructorId);
    }
    async deleteInstructor(body) {
        return this.adminService.deleteIntructor(body.instructorId);
    }
    async getAllUsers(limit) {
        return this.adminService.getAllUsers(Number(limit));
    }
    async searchUser(email, limit) {
        return this.adminService.searchUser(email, Number(limit));
    }
    async deleteCourse(courseId) {
        return this.adminService.deleteCourse(courseId);
    }
    async updateUserRole(body) {
        return this.adminService.updateUserRole(body.userId, body.role);
    }
};
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('all-instructors'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllInstructors", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('approve-instructor'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.ApproveInstructorDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "aproveInstructor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('delete-instructor'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.ApproveInstructorDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteInstructor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('all-users'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('search-users'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "searchUser", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('delete-course'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Query)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCourse", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('update-user-role'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserRole", null);
AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map