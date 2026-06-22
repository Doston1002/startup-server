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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const passport_1 = require("@nestjs/passport");
const mongoose_2 = require("mongoose");
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = require("../../user/user.model");
const token_blacklist_service_1 = require("../token-blacklist.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, userModel, tokenBlacklistService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('SECRET_JWT'),
            passReqToCallback: true,
        });
        this.configService = configService;
        this.userModel = userModel;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async validate(request, payload) {
        var _a, _b;
        const authHeader = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization) || ((_b = request === null || request === void 0 ? void 0 : request.headers) === null || _b === void 0 ? void 0 : _b.Authorization);
        const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace('Bearer ', '')) || (authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace('bearer ', ''));
        if (token && this.tokenBlacklistService.isBlacklisted(token)) {
            throw new common_1.UnauthorizedException('Token invalid - logout qilingan');
        }
        const { _id, role: tokenRole } = payload;
        const user = await this.userModel.findById(_id);
        if (!user) {
            return null;
        }
        if (user.isBlocked) {
            return null;
        }
        const dbRole = user.role || 'USER';
        const payloadRole = tokenRole || 'USER';
        if (payloadRole !== dbRole) {
            return null;
        }
        return user;
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        token_blacklist_service_1.TokenBlacklistService])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map