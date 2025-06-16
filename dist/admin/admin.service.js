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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const SendGrid = require("@sendgrid/mail");
const mongoose_2 = require("mongoose");
const nestjs_stripe_1 = require("nestjs-stripe");
const course_model_1 = require("../course/course.model");
const instructor_model_1 = require("../instructor/instructor.model");
const user_model_1 = require("../user/user.model");
const stripe_1 = require("stripe");
let AdminService = class AdminService {
    constructor(instructorModel, userModel, courseModel, stripeClient, configService) {
        this.instructorModel = instructorModel;
        this.userModel = userModel;
        this.courseModel = courseModel;
        this.stripeClient = stripeClient;
        this.configService = configService;
        SendGrid.setApiKey(this.configService.get('SEND_GRID_KEY'));
    }
    async getAllInstructors() {
        const instructors = await this.instructorModel.find().populate('author').exec();
        return instructors.map(instructor => this.getSpecificField(instructor));
    }
    async aproveInstructor(instructorId) {
        const instructor = await this.instructorModel.findByIdAndUpdate(instructorId, {
            $set: { approved: true },
        }, { new: true });
        const user = await this.userModel.findById(instructor.author);
        const account = await this.stripeClient.accounts.create({
            type: 'express',
            country: 'US',
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
        const accountLinks = await this.stripeClient.accountLinks.create({
            account: account.id,
            refresh_url: 'https://uyda-talim.uz',
            return_url: 'https://uyda-talim.uz',
            type: 'account_onboarding',
        });
        await this.userModel.findByIdAndUpdate(instructor.author, { $set: { role: 'INSTRUCTOR', instructorAccountId: account.id } }, { new: true });
        const emailData = {
            to: user.email,
            subject: 'Successfully approved',
            from: 'dilbarxudoyberdiyeva71@gmail.com',
            html: `
        <p>Hi dear ${user.fullName}, you approved to our platform like Instructor, follow the bellow steps.</p>
				<a href="${accountLinks.url}">Full finish your instructor account</a>
			`,
        };
        await SendGrid.send(emailData);
        return 'Success';
    }
    async deleteIntructor(instructorId) {
        const instructor = await this.instructorModel.findByIdAndUpdate(instructorId, {
            $set: { approved: false },
        }, { new: true });
        await this.userModel.findByIdAndUpdate(instructor.author, { $set: { role: 'USER' } }, { new: true });
        return 'Success';
    }
    async getAllUsers(limit) {
        const users = await this.userModel.find().limit(limit).sort({ createdAt: -1 }).exec();
        return users.map(user => this.getUserSpecificFiled(user));
    }
    async searchUser(email, limit) {
        let users;
        if (email) {
            users = await this.userModel.find({}).exec();
        }
        else {
            users = await this.userModel.find({}).limit(limit).exec();
        }
        const searchedUser = users.filter(user => user.email.toLowerCase().indexOf(email.toLowerCase()) !== -1);
        return searchedUser.map(user => this.getUserSpecificFiled(user));
    }
    async deleteCourse(courseId) {
        const courseAuthor = await this.courseModel.findById(courseId);
        await this.instructorModel.findOneAndUpdate({ author: courseAuthor.author }, { $pull: { courses: courseId } }, { new: true });
        await this.courseModel.findByIdAndRemove(courseId, { new: true }).exec();
        const courses = await this.courseModel.find().exec();
        return courses.map(course => this.getSpecificFieldCourse(course));
    }
    getSpecificField(instructor) {
        return {
            approved: instructor.approved,
            socialMedia: instructor.socialMedia,
            _id: instructor._id,
            author: {
                fullName: instructor.author.fullName,
                email: instructor.author.email,
                job: instructor.author.job,
            },
        };
    }
    getUserSpecificFiled(user) {
        return {
            email: user.email,
            fullName: user.fullName,
            _id: user._id,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    getSpecificFieldCourse(course) {
        return {
            title: course.title,
            previewImage: course.previewImage,
            isActive: course.isActive,
            language: course.language,
            _id: course._id,
        };
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(instructor_model_1.Instructor.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(course_model_1.Course.name)),
    __param(3, (0, nestjs_stripe_1.InjectStripe)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        stripe_1.default,
        config_1.ConfigService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map