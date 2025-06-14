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
const nestjs_stripe_1 = require("nestjs-stripe");
const stripe_1 = require("stripe");
const user_model_1 = require("./user.model");
let UserService = class UserService {
    constructor(userModel, stripeClient) {
        this.userModel = userModel;
        this.stripeClient = stripeClient;
    }
    async byId(id) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async editPassword(dto) {
        const { email, password } = dto;
        const existUser = await this.userModel.findOne({ email });
        if (!existUser)
            throw new common_1.UnauthorizedException('user_not_found');
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
        const transactions = await this.stripeClient.charges.list({
            customer: customerId,
            limit: 100,
        });
        return transactions.data;
    }
    async myCourses(userId) {
        const user = await this.userModel.findById(userId).populate('courses').exec();
        return user.courses;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, nestjs_stripe_1.InjectStripe)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        stripe_1.default])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map