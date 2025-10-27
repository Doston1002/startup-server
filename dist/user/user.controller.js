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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const user_decorator_1 = require("./decorators/user.decorator");
const user_interface_1 = require("./user.interface");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(_id) {
        return this.userService.byId(_id);
    }
    async editPassword(dto) {
        return this.userService.editPassword(dto);
    }
    updateUser(dto, _id) {
        return this.userService.updateUser(dto, _id);
    }
    allTransactions(customerId) {
        return this.userService.allTransactions(customerId);
    }
    myCourses(_id) {
        return this.userService.myCourses(_id);
    }
    changeRole(dto) {
        return this.userService.changeRole(dto);
    }
};
__decorate([
    (0, common_1.Get)('profile'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('edit-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editPassword", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('update'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_interface_1.UpdateUserDto, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('transactions'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, user_decorator_1.User)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "allTransactions", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('my-courses'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "myCourses", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('change-role'),
    (0, auth_decorator_1.Auth)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_interface_1.ChangeRoleDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "changeRole", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map