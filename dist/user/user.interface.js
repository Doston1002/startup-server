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
exports.ChangeRoleDto = exports.UpdateUserDto = exports.InterfaceEmailAndPassword = void 0;
const class_validator_1 = require("class-validator");
class InterfaceEmailAndPassword {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InterfaceEmailAndPassword.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Parol bo\'sh bo\'lmasligi kerak' }),
    (0, class_validator_1.MinLength)(8, { message: 'Parol kamida 8 belgidan iborat bo\'lishi kerak' }),
    (0, class_validator_1.Matches)(/^(?=.*[A-Za-z])(?=.*\d)/, {
        message: 'Parol kamida 1 harf va 1 raqamdan iborat bo\'lishi kerak. Masalan: mypass123',
    }),
    __metadata("design:type", String)
], InterfaceEmailAndPassword.prototype, "password", void 0);
exports.InterfaceEmailAndPassword = InterfaceEmailAndPassword;
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
class ChangeRoleDto {
}
exports.ChangeRoleDto = ChangeRoleDto;
//# sourceMappingURL=user.interface.js.map