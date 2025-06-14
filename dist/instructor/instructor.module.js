"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const course_model_1 = require("../course/course.model");
const user_model_1 = require("../user/user.model");
const instructor_controller_1 = require("./instructor.controller");
const instructor_model_1 = require("./instructor.model");
const instructor_service_1 = require("./instructor.service");
let InstructorModule = class InstructorModule {
};
InstructorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_model_1.User.name, schema: user_model_1.UserSchema },
                { name: instructor_model_1.Instructor.name, schema: instructor_model_1.InstructorSchema },
                { name: course_model_1.Course.name, schema: course_model_1.CourseSchema },
            ]),
        ],
        providers: [instructor_service_1.InstructorService],
        controllers: [instructor_controller_1.InstructorController],
    })
], InstructorModule);
exports.InstructorModule = InstructorModule;
//# sourceMappingURL=instructor.module.js.map