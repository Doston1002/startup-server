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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../user/decorators/user.decorator");
const auth_service_1 = require("./auth.service");
const auth_decorator_1 = require("./decorators/auth.decorator");
const token_dto_1 = require("./dto/token.dto");
const oneid_logout_dto_1 = require("./dto/oneid-logout.dto");
const oneid_service_1 = require("./oneid.service");
const user_activity_logger_1 = require("../logger/user-activity.logger");
let AuthController = class AuthController {
    constructor(authService, oneIdService, userActivityLogger) {
        this.authService = authService;
        this.oneIdService = oneIdService;
        this.userActivityLogger = userActivityLogger;
    }
    async getNewTokens(dto) {
        return this.authService.getNewTokens(dto);
    }
    async checkUser(dto) {
        return { status: 'disabled' };
    }
    async checkInstructor(_id) {
        return _id ? true : false;
    }
    async logout(req) {
        var _a;
        try {
            const authHeader = req.headers.authorization;
            const accessToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace('Bearer ', '');
            const refreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh) || null;
            if (!accessToken) {
                throw new common_1.HttpException('Token topilmadi', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.authService.logout(accessToken, refreshToken);
            this.userActivityLogger.logUserActivity({
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'] || '-',
                referer: req.headers['referer'] || '-',
                statusCode: 200,
                action: 'LOGOUT',
                message: 'Foydalanuvchi tizimdan chiqdi',
            });
            return {
                success: true,
                message: 'Muvaffaqiyatli tizimdan chiqildi',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Logout xatolik yuz berdi', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleOneIdCallback(body, req) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const { code } = body;
            if (!code) {
                throw new common_1.HttpException('Authorization code is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const accessToken = await this.oneIdService.getAccessToken(code);
            console.log("FROM accessToken");
            const oneIdUserData = await this.oneIdService.getUserInfo(accessToken);
            console.log("FROM oneIdUserData");
            const result = await this.authService.processOneIdUser(oneIdUserData);
            this.userActivityLogger.logUserActivity({
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'] || '-',
                referer: req.headers['referer'] || '-',
                statusCode: 200,
                email: (_a = result.user) === null || _a === void 0 ? void 0 : _a.email,
                userId: (_d = (_c = (_b = result.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString) === null || _d === void 0 ? void 0 : _d.call(_c),
                fullName: ((_e = result.user) === null || _e === void 0 ? void 0 : _e.fullName) || oneIdUserData.full_name,
                role: (_f = result.user) === null || _f === void 0 ? void 0 : _f.role,
                action: 'ONEID_AUTH',
                message: `${((_g = result.user) === null || _g === void 0 ? void 0 : _g.fullName) || oneIdUserData.full_name} OneID orqali ro'yxatdan o'tdi`,
            });
            return Object.assign(Object.assign({ success: true }, result), { oneIdAccessToken: accessToken });
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'OneID authentication failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleOneIdLogout(dto, req) {
        try {
            const { access_token } = dto;
            if (!access_token) {
                throw new common_1.HttpException('Access token talab qilinadi', common_1.HttpStatus.BAD_REQUEST);
            }
            const logoutResult = await this.oneIdService.logout(access_token);
            this.userActivityLogger.logUserActivity({
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'] || '-',
                referer: req.headers['referer'] || '-',
                statusCode: 200,
                action: 'ONEID_LOGOUT',
                message: 'OneID orqali foydalanuvchi tizimdan chiqdi',
            });
            return {
                success: true,
                message: 'Muvaffaqiyatli tizimdan chiqildi',
                data: logoutResult,
            };
        }
        catch (error) {
            this.userActivityLogger.logUserActivity({
                ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                method: req.method,
                url: req.url,
                userAgent: req.headers['user-agent'] || '-',
                referer: req.headers['referer'] || '-',
                statusCode: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                action: 'ONEID_LOGOUT_ERROR',
                message: `OneID logout xatolik: ${error.message}`,
            });
            throw new common_1.HttpException(error.message || 'OneID logout xatolik yuz berdi', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('access'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_dto_1.TokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getNewTokens", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('check-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUser", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('check-instructor'),
    (0, auth_decorator_1.Auth)('INSTRUCTOR'),
    __param(0, (0, user_decorator_1.User)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkInstructor", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('oneid/callback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleOneIdCallback", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('oneid/logout'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oneid_logout_dto_1.OneIdLogoutDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleOneIdLogout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        oneid_service_1.OneIdService,
        user_activity_logger_1.UserActivityLogger])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map