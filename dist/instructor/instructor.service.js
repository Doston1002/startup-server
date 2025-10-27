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
exports.InstructorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_model_1 = require("../course/course.model");
const user_model_1 = require("../user/user.model");
const instructor_model_1 = require("./instructor.model");
let InstructorService = class InstructorService {
    constructor(userModel, instructorModel, courseModel) {
        this.userModel = userModel;
        this.instructorModel = instructorModel;
        this.courseModel = courseModel;
    }
    async applyAsInstructor(dto) {
        const { email, firstName, lastName, socialMedia, job, language } = dto;
        let user;
        const existUser = await this.userModel.findOne({ email });
        user = existUser;
        if (user) {
            await this.userModel.findByIdAndUpdate(user._id, {
                $set: { job, fullName: `${firstName} ${lastName}` },
            });
        }
        if (!existUser) {
            const newUser = await this.userModel.create(Object.assign(Object.assign({}, dto), { fullName: `${firstName} ${lastName}` }));
            user = newUser;
        }
        const data = { socialMedia, author: user._id, language };
        const existInstructor = await this.instructorModel.findOne({ author: user._id });
        if (existInstructor)
            throw new common_1.BadRequestException('Instructor with that email already exist in our system');
        await this.instructorModel.create(data);
        return 'Success';
    }
    async getAllCourses(author) {
        return await this.courseModel.find({ author });
    }
    async getDetailedCourse(slug) {
        return await this.courseModel.findOne({ slug });
    }
    async getInstructors(language, limit) {
        const instructors = await this.instructorModel
            .find({ language, approved: true })
            .populate('author')
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .exec();
        return instructors.map(instructor => this.getSpecificFieldInstructor(instructor));
    }
    getSpecificFieldInstructor(instructor) {
        return {
            avatar: instructor.author.avatar,
            fullName: instructor.author.fullName,
            totalCourses: instructor.courses.length,
            job: instructor.author.job,
        };
    }
};
InstructorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(instructor_model_1.Instructor.name)),
    __param(2, (0, mongoose_1.InjectModel)(course_model_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InstructorService);
exports.InstructorService = InstructorService;
//# sourceMappingURL=instructor.service.js.map