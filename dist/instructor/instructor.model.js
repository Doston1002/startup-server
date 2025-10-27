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
exports.InstructorSchema = exports.Instructor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("../user/user.model");
let Instructor = class Instructor {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Instructor.prototype, "socialMedia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", user_model_1.User)
], Instructor.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Instructor.prototype, "approved", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Instructor.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Course' }]),
    __metadata("design:type", Array)
], Instructor.prototype, "courses", void 0);
Instructor = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Instructor);
exports.Instructor = Instructor;
exports.InstructorSchema = mongoose_1.SchemaFactory.createForClass(Instructor);
//# sourceMappingURL=instructor.model.js.map