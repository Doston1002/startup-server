"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../guards/admin.guard");
const instructor_guard_1 = require("../guards/instructor.guard");
const jwt_guard_1 = require("../guards/jwt.guard");
const Auth = (role = 'USER') => {
    return (0, common_1.applyDecorators)((role === 'ADMIN' && (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.OnlyAdminGuard)) ||
        (role === 'USER' && (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard)) ||
        (role === 'INSTRUCTOR' && (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, instructor_guard_1.OnlyInstructorGuard)));
};
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map