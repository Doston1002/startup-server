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
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const newsletter_model_1 = require("./newsletter.model");
let NewsletterService = class NewsletterService {
    constructor(newsletterModel) {
        this.newsletterModel = newsletterModel;
    }
    async subscribe(email) {
        try {
            const existingSubscriber = await this.newsletterModel.findOne({ email });
            if (existingSubscriber) {
                if (existingSubscriber.isActive) {
                    throw new Error('Bu email allaqachon obuna bo\'lgan');
                }
                else {
                    existingSubscriber.isActive = true;
                    existingSubscriber.subscribedAt = new Date();
                    return await existingSubscriber.save();
                }
            }
            const subscriber = new this.newsletterModel({
                email,
                isActive: true,
                subscribedAt: new Date(),
            });
            return await subscriber.save();
        }
        catch (error) {
            throw error;
        }
    }
    async getAllSubscribers() {
        return await this.newsletterModel.find({ isActive: true }).exec();
    }
    async unsubscribe(email) {
        return await this.newsletterModel.findOneAndUpdate({ email }, { isActive: false }, { new: true });
    }
};
NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(newsletter_model_1.Newsletter.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NewsletterService);
exports.NewsletterService = NewsletterService;
//# sourceMappingURL=newsletter.service.js.map