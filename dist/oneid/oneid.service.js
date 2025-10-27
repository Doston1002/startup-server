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
var OneIdService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneIdService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const jwt_1 = require("@nestjs/jwt");
let OneIdService = OneIdService_1 = class OneIdService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(OneIdService_1.name);
        this.authUrl = process.env.ONEID_AUTH_URL;
    }
    getAuthorizationUrl(state) {
        const params = new URLSearchParams({
            response_type: 'one_code',
            client_id: process.env.ONEID_CLIENT_ID,
            redirect_uri: process.env.ONEID_REDIRECT_URI,
            scope: process.env.ONEID_SCOPE,
            state,
        });
        return `${this.authUrl}?${params.toString()}`;
    }
    async exchangeCodeForToken(code) {
        const params = new URLSearchParams({
            grant_type: 'one_authorization_code',
            client_id: process.env.ONEID_CLIENT_ID,
            client_secret: process.env.ONEID_CLIENT_SECRET,
            redirect_uri: process.env.ONEID_REDIRECT_URI,
            code,
        });
        const { data } = await axios_1.default.post(this.authUrl, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    }
    async getUserInfo(accessToken) {
        const params = new URLSearchParams({
            grant_type: 'one_access_token_identify',
            client_id: process.env.ONEID_CLIENT_ID,
            client_secret: process.env.ONEID_CLIENT_SECRET,
            access_token: accessToken,
            scope: process.env.ONEID_SCOPE,
        });
        const { data } = await axios_1.default.post(this.authUrl, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    }
    async logout(accessToken) {
        const params = new URLSearchParams({
            grant_type: 'one_log_out',
            client_id: process.env.ONEID_CLIENT_ID,
            client_secret: process.env.ONEID_CLIENT_SECRET,
            access_token: accessToken,
            scope: process.env.ONEID_SCOPE,
        });
        const { data } = await axios_1.default.post(this.authUrl, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    }
    signJwt(payload) {
        return this.jwtService.sign(payload);
    }
};
OneIdService = OneIdService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], OneIdService);
exports.OneIdService = OneIdService;
//# sourceMappingURL=oneid.service.js.map