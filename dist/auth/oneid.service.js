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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneIdService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const axios_2 = require("axios");
let OneIdService = class OneIdService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.oneIdBaseUrl = this.configService.get('ONEID_BASE_URL');
        this.clientId = this.configService.get('ONEID_CLIENT_ID');
        this.clientSecret = this.configService.get('ONEID_CLIENT_SECRET');
        this.redirectUri = this.configService.get('ONEID_REDIRECT_URI');
    }
    async getAccessToken(code) {
        try {
            const tokenUrl = `${this.oneIdBaseUrl}`;
            console.log("FROM tokenUrl");
            const params = new URLSearchParams({
                grant_type: 'one_authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
                redirect_uri: this.redirectUri,
            });
            console.log("FROM params");
            const response = await axios_2.default.post(tokenUrl, undefined, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
                params
            });
            console.log(response.data);
            if (!response.data.access_token) {
                throw new Error('Access token not received from OneID');
            }
            return response.data.access_token;
        }
        catch (error) {
            console.error('OneID token exchange error:', error);
            throw new common_1.HttpException('Failed to exchange code for access token', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserInfo(accessToken) {
        try {
            const userInfoUrl = `${this.oneIdBaseUrl}`;
            console.log("FROM userInfoUrl");
            const params = new URLSearchParams({
                grant_type: 'one_access_token_identify',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                access_token: accessToken,
                scope: 'uydatalim_uzedu_uz',
            });
            console.log("FROM params");
            const response = await axios_2.default.post(userInfoUrl, undefined, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                params
            });
            console.log(response.data);
            if (response.data.ret_cd !== '0') {
                throw new Error('Invalid response from OneID user info endpoint');
            }
            return response.data;
        }
        catch (error) {
            console.error('OneID user info error:', error);
            throw new common_1.HttpException('Failed to get user information from OneID', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
OneIdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], OneIdService);
exports.OneIdService = OneIdService;
//# sourceMappingURL=oneid.service.js.map