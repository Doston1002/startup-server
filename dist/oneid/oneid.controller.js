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
var OneIdController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneIdController = void 0;
const common_1 = require("@nestjs/common");
const oneid_service_1 = require("./oneid.service");
let OneIdController = OneIdController_1 = class OneIdController {
    constructor(oneIdService) {
        this.oneIdService = oneIdService;
        this.logger = new common_1.Logger(OneIdController_1.name);
    }
    getLoginUrl(state) {
        return { url: this.oneIdService.getAuthorizationUrl(state || 'random_state') };
    }
    async callback(code, state, res) {
        try {
            if (!code) {
                return res.status(400).send("Code yo'q");
            }
            const tokenData = await this.oneIdService.exchangeCodeForToken(code);
            const accessToken = tokenData.access_token;
            const userInfo = await this.oneIdService.getUserInfo(accessToken);
            const jwt = this.oneIdService.signJwt({
                pin: userInfo.pin,
                full_name: userInfo.full_name,
                user_id: userInfo.user_id,
            });
            res.cookie('auth_token', jwt, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.redirect('/');
        }
        catch (err) {
            this.logger.error(err);
            return res.status(500).send('OneID xatolik');
        }
    }
    async userInfo(accessToken) {
        return await this.oneIdService.getUserInfo(accessToken);
    }
    async logout(accessToken, res) {
        const result = await this.oneIdService.logout(accessToken);
        res.clearCookie('auth_token');
        return res.json(result);
    }
};
__decorate([
    (0, common_1.Get)('login-url'),
    __param(0, (0, common_1.Query)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OneIdController.prototype, "getLoginUrl", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], OneIdController.prototype, "callback", null);
__decorate([
    (0, common_1.Post)('userinfo'),
    __param(0, (0, common_1.Body)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OneIdController.prototype, "userInfo", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)('access_token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OneIdController.prototype, "logout", null);
OneIdController = OneIdController_1 = __decorate([
    (0, common_1.Controller)('oneid'),
    __metadata("design:paramtypes", [oneid_service_1.OneIdService])
], OneIdController);
exports.OneIdController = OneIdController;
//# sourceMappingURL=oneid.controller.js.map