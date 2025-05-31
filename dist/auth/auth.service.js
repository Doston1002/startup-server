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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const bcryptjs_1 = require("bcryptjs");
const mongoose_2 = require("mongoose");
const customer_service_1 = require("../customer/customer.service");
const user_model_1 = require("../user/user.model");
let AuthService = class AuthService {
    constructor(userModel, jwtService, customerService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.customerService = customerService;
    }
    async register(dto) {
        const existUser = await this.isExistUser(dto.email);
        if (existUser)
            throw new common_1.BadRequestException('already_exist');
        const salt = await (0, bcryptjs_1.genSalt)(10);
        const passwordHash = await (0, bcryptjs_1.hash)(dto.password, salt);
        const newUser = await this.userModel.create(Object.assign(Object.assign({}, dto), { password: dto.password.length ? passwordHash : '' }));
        await this.customerService.getCustomer(String(newUser._id));
        const token = await this.issueTokenPair(String(newUser._id));
        return Object.assign({ user: this.getUserField(newUser) }, token);
    }
    async login(dto) {
        const existUser = await this.isExistUser(dto.email);
        if (!existUser)
            throw new common_1.BadRequestException('user_not_found');
        if (dto.password.length) {
            const currentPassword = await (0, bcryptjs_1.compare)(dto.password, existUser.password);
            if (!currentPassword)
                throw new common_1.BadRequestException('incorrect_password');
        }
        await this.customerService.getCustomer(String(existUser._id));
        const token = await this.issueTokenPair(String(existUser._id));
        return Object.assign({ user: this.getUserField(existUser) }, token);
    }
    async getNewTokens({ refreshToken }) {
        if (!refreshToken)
            throw new common_1.UnauthorizedException('Please sign in!');
        const result = await this.jwtService.verifyAsync(refreshToken);
        if (!result)
            throw new common_1.UnauthorizedException('Invalid token or expired!');
        const user = await this.userModel.findById(result._id);
        const token = await this.issueTokenPair(String(user._id));
        return Object.assign({ user: this.getUserField(user) }, token);
    }
    async checkUser(email) {
        const user = await this.isExistUser(email);
        if (user) {
            return 'user';
        }
        else {
            return 'no-user';
        }
    }
    async isExistUser(email) {
        const existUser = await this.userModel.findOne({ email });
        return existUser;
    }
    async issueTokenPair(userId) {
        const data = { _id: userId };
        const refreshToken = await this.jwtService.signAsync(data, { expiresIn: '15d' });
        const accessToken = await this.jwtService.signAsync(data, { expiresIn: '1m' });
        return { refreshToken, accessToken };
    }
    getUserField(user) {
        return {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            role: user.role,
            courses: user.courses,
            createdAt: user.createdAt,
            birthday: user.birthday,
            bio: user.bio,
            job: user.job,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        customer_service_1.CustomerService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map