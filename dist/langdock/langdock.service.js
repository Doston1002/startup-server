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
var LangdockService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangdockService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let LangdockService = LangdockService_1 = class LangdockService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(LangdockService_1.name);
        this.apiKey = this.configService.get('sk--wweAYkGmSNM0mRt_yDCVPddHHZKNAGopjwcZI2yCVJSDzUZlVu2XB5NDn3r8_zvVov18HwL53E9MnfWLv6Yjg');
        this.region = this.configService.get('eu') || 'eu';
        this.apiUrl = `https://api.langdock.com/openai/${this.region}/v1`;
    }
    async generateCompletion(prompt, options = {}) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/chat/completions`, Object.assign({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 1000 }, options), {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Langdock API xatosi: ${error.message}`);
            throw error;
        }
    }
    async chatCompletion(messages, options = {}) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/chat/completions`, Object.assign({ model: 'gpt-4o-mini', messages }, options), {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Langdock API xatosi: ${error.message}`);
            throw error;
        }
    }
    async streamChatCompletion(messages, options = {}) {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/chat/completions`, Object.assign({ model: 'gpt-4o-mini', messages, stream: true }, options), {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                responseType: 'stream',
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Langdock API xatosi: ${error.message}`);
            throw error;
        }
    }
};
LangdockService = LangdockService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LangdockService);
exports.LangdockService = LangdockService;
//# sourceMappingURL=langdock.service.js.map