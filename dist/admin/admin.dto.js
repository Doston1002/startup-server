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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserDto = exports.UpdateUserDto = exports.CreateUserDto = exports.UpdateUserRoleDto = exports.DeleteCourseDto = exports.ApproveInstructorDto = void 0;
const class_validator_1 = require("class-validator");
class ApproveInstructorDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ApproveInstructorDto.prototype, "instructorId", void 0);
exports.ApproveInstructorDto = ApproveInstructorDto;
class DeleteCourseDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], DeleteCourseDto.prototype, "courseId", void 0);
exports.DeleteCourseDto = DeleteCourseDto;
class UpdateUserRoleDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateUserRoleDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['ADMIN', 'INSTRUCTOR', 'USER']),
    __metadata("design:type", String)
], UpdateUserRoleDto.prototype, "role", void 0);
exports.UpdateUserRoleDto = UpdateUserRoleDto;
class CreateUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email kiritilishi shart' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Noto\'g\'ri email format' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Ism kiritilishi shart' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Parol kiritilishi shart' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Parol katta harf, kichik harf, raqam va maxsus belgi (@$!%*?&) dan iborat bo\'lishi kerak' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ADMIN', 'INSTRUCTOR', 'USER']),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Foydalanuvchi ID kiritilishi shart' }),
    (0, class_validator_1.IsMongoId)({ message: 'Noto\'g\'ri foydalanuvchi ID' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Noto\'g\'ri email format' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'Ism kamida 3 ta belgidan iborat bo\'lishi kerak' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Parol katta harf, kichik harf, raqam va maxsus belgi (@$!%*?&) dan iborat bo\'lishi kerak' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ADMIN', 'INSTRUCTOR', 'USER']),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
exports.UpdateUserDto = UpdateUserDto;
class DeleteUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Foydalanuvchi ID kiritilishi shart' }),
    (0, class_validator_1.IsMongoId)({ message: 'Noto\'g\'ri foydalanuvchi ID' }),
    __metadata("design:type", String)
], DeleteUserDto.prototype, "userId", void 0);
exports.DeleteUserDto = DeleteUserDto;
//# sourceMappingURL=admin.dto.js.map