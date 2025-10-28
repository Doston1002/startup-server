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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcryptjs_1 = require("bcryptjs");
const mongoose_2 = require("mongoose");
const user_model_1 = require("./user.model");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async byId(id) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async editPassword(dto, userId) {
        const { email, password } = dto;
        const existUser = await this.userModel.findById(userId);
        if (!existUser)
            throw new common_1.UnauthorizedException('user_not_found');
        if (existUser.email !== email) {
            throw new common_1.UnauthorizedException('cannot_change_other_user_password');
        }
        const salt = await (0, bcryptjs_1.genSalt)(10);
        const hashPassword = await (0, bcryptjs_1.hash)(password, salt);
        await this.userModel.findByIdAndUpdate(existUser._id, { $set: { password: hashPassword } }, { new: true });
        return 'Success';
    }
    async updateUser(body, userID) {
        const { avatar, firstName, lastName, bio, birthday, job } = body;
        const user = await this.userModel.findByIdAndUpdate(userID, {
            $set: { fullName: `${firstName} ${lastName}`, avatar, bio, birthday, job },
        }, { new: true });
        return user;
    }
    async allTransactions(customerId) {
        return {};
    }
    async myCourses(userId) {
        const user = await this.userModel.findById(userId).populate('courses').exec();
        return user.courses;
    }
    async changeRole(dto) {
        const { userId, role } = dto;
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: { role } }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'Role updated successfully',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map