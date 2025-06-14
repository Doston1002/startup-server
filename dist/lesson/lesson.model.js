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
exports.LessonSchema = exports.Lesson = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Lesson = class Lesson {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lesson.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lesson.prototype, "material", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Lesson.prototype, "embedVideo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Lesson.prototype, "hour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Lesson.prototype, "minute", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Lesson.prototype, "second", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Lesson.prototype, "completed", void 0);
Lesson = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lesson);
exports.Lesson = Lesson;
exports.LessonSchema = mongoose_1.SchemaFactory.createForClass(Lesson);
//# sourceMappingURL=lesson.model.js.map