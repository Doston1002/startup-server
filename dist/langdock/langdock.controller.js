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
exports.LangdockController = void 0;
const common_1 = require("@nestjs/common");
const langdock_service_1 = require("./langdock.service");
let LangdockController = class LangdockController {
    constructor(langdockService) {
        this.langdockService = langdockService;
    }
    async generateChat(body) {
        const { messages, options } = body;
        return this.langdockService.chatCompletion(messages, options);
    }
    async generateText(body) {
        const { prompt, options } = body;
        return this.langdockService.generateCompletion(prompt, options);
    }
    async streamChat(body, res) {
        const { messages, options } = body;
        try {
            const stream = await this.langdockService.streamChatCompletion(messages, options);
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            stream.on('data', chunk => {
                const lines = chunk
                    .toString()
                    .split('\n')
                    .filter(line => line.trim() !== '');
                for (const line of lines) {
                    if (line.includes('[DONE]')) {
                        res.write('data: [DONE]\n\n');
                    }
                    else if (line.startsWith('data: ')) {
                        res.write(`${line}\n\n`);
                    }
                }
            });
            stream.on('end', () => {
                res.end();
            });
            stream.on('error', error => {
                console.error('Stream error:', error);
                res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).end();
            });
        }
        catch (error) {
            console.error('Error:', error);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
};
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LangdockController.prototype, "generateChat", null);
__decorate([
    (0, common_1.Post)('completion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LangdockController.prototype, "generateText", null);
__decorate([
    (0, common_1.Post)('stream'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LangdockController.prototype, "streamChat", null);
LangdockController = __decorate([
    (0, common_1.Controller)('langdock'),
    __metadata("design:paramtypes", [langdock_service_1.LangdockService])
], LangdockController);
exports.LangdockController = LangdockController;
//# sourceMappingURL=langdock.controller.js.map