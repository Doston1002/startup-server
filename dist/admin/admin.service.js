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
const bcryptjs_1 = require("bcryptjs");
const course_model_1 = require("../course/course.model");
const instructor_model_1 = require("../instructor/instructor.model");
const user_model_1 = require("../user/user.model");
let AdminService = class AdminService {
    constructor(instructorModel, userModel, courseModel, configService) {
        this.instructorModel = instructorModel;
        this.userModel = userModel;
        this.courseModel = courseModel;
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
        const emailData = {
            to: user.email,
            subject: 'Successfully approved',
            from: 'dilbarxudoyberdiyeva71@gmail.com',
            html: `
        <p>Hi dear ${user.fullName}, you approved to our platform like Instructor, follow the bellow steps.</p>
				<a href="${1111}">Full finish your instructor account</a>
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
    async updateUserRole(userId, role) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: { role } }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return this.getUserSpecificFiled(user);
    }
    async createUser(email, fullName, password, role) {
        const existUser = await this.userModel.findOne({ email });
        if (existUser) {
            throw new common_1.BadRequestException('Email allaqachon mavjud');
        }
        const salt = await (0, bcryptjs_1.genSalt)(10);
        const hashedPassword = await (0, bcryptjs_1.hash)(password, salt);
        const user = await this.userModel.create({
            email,
            fullName,
            password: hashedPassword,
            role: role || 'USER',
        });
        return this.getUserSpecificFiled(user);
    }
    async updateUser(userId, email, fullName, password, role) {
        const updateData = {};
        if (email) {
            const existUser = await this.userModel.findOne({
                email,
                _id: { $ne: userId }
            });
            if (existUser) {
                throw new common_1.BadRequestException('Email already exists');
            }
            updateData.email = email;
        }
        if (fullName)
            updateData.fullName = fullName;
        if (role)
            updateData.role = role;
        if (password) {
            const salt = await (0, bcryptjs_1.genSalt)(10);
            updateData.password = await (0, bcryptjs_1.hash)(password, salt);
        }
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.getUserSpecificFiled(user);
    }
    async deleteUser(userId) {
        const user = await this.userModel.findByIdAndDelete(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return { message: 'User deleted successfully' };
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
            id: user._id,
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
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map