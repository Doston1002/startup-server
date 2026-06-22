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
exports.CourseBodyDto = void 0;
const class_validator_1 = require("class-validator");
class CourseBodyDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kurs nomi bo\'sh bo\'lmasligi kerak' }),
    (0, class_validator_1.MinLength)(5, { message: 'Kurs nomi kamida 5 belgidan iborat bo\'lishi kerak' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Kurs nomi 200 belgidan oshmasligi kerak' }),
    __metadata("design:type", String)
], CourseBodyDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Qisqacha tavsif bo\'sh bo\'lmasligi kerak' }),
    (0, class_validator_1.MinLength)(10, { message: 'Qisqacha tavsif kamida 10 belgidan iborat bo\'lishi kerak' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Qisqacha tavsif 500 belgidan oshmasligi kerak' }),
    __metadata("design:type", String)
], CourseBodyDto.prototype, "exerpt", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'O\'rganish natijalari array bo\'lishi kerak' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Kamida 1 ta o\'rganish natijasi bo\'lishi kerak' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Har bir element string bo\'lishi kerak' }),
    __metadata("design:type", Array)
], CourseBodyDto.prototype, "learn", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Talablar array bo\'lishi kerak' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Kamida 1 ta talab bo\'lishi kerak' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CourseBodyDto.prototype, "requirements", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CourseBodyDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tavsif bo\'sh bo\'lmasligi kerak' }),
    (0, class_validator_1.MinLength)(20, { message: 'Tavsif kamida 20 belgidan iborat bo\'lishi kerak' }),
    __metadata("design:type", String)
], CourseBodyDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['Beginner', 'Intermediate', 'Advanced', 'All levels'], {
        message: 'Level faqat Beginner, Intermediate, Advanced yoki All levels bo\'lishi mumkin'
    }),
    __metadata("design:type", String)
], CourseBodyDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kategoriya bo\'sh bo\'lmasligi kerak' }),
    __metadata("design:type", String)
], CourseBodyDto.prototype, "category", void 0);
exports.CourseBodyDto = CourseBodyDto;
//# sourceMappingURL=coourse.dto.js.map