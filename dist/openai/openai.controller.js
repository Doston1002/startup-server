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
exports.OpenaiController = void 0;
const common_1 = require("@nestjs/common");
const create_chat_completion_request_1 = require("./dto/create-chat-completion.request");
const openai_service_1 = require("./openai.service");
let OpenaiController = class OpenaiController {
    constructor(openaiService) {
        this.openaiService = openaiService;
    }
    async createChatCompletion(body) {
        try {
            return await this.openaiService.createChatCompletion(body.messages);
        }
        catch (error) {
            throw new common_1.HttpException('AI xizmatida muammo yuz berdi: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Post)('chatCompletion'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_completion_request_1.CreateChatCompletionRequest]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "createChatCompletion", null);
OpenaiController = __decorate([
    (0, common_1.Controller)('openai'),
    __metadata("design:paramtypes", [openai_service_1.OpenaiService])
], OpenaiController);
exports.OpenaiController = OpenaiController;
//# sourceMappingURL=openai.controller.js.map