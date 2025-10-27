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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_model_1 = require("./review.model");
let ReviewService = class ReviewService {
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    async createReview(dto) {
        const review = await this.reviewModel.create(dto);
        return review._id;
    }
    async deleteReview(reviewId) {
        const isReview = await this.reviewModel.findById(reviewId);
        if (!isReview)
            throw new common_1.NotFoundException('Review with id not found');
        const review = await this.reviewModel.findByIdAndRemove(reviewId);
        return review._id;
    }
    async editReview(reviewId, dto) {
        console.log(reviewId);
        const review = await this.reviewModel.findByIdAndUpdate(reviewId, {
            $set: { rating: dto.rating, summary: dto.summary },
        }, { new: true });
        return review._id;
    }
    async getReview(courseId) {
        const reviews = await this.reviewModel.find({ course: courseId }).populate('author').exec();
        return reviews;
    }
    async getByUser({ course, user }) {
        const reviews = await this.reviewModel.find({ course }).exec();
        const isExist = reviews.find(c => String(c.author) === user);
        return isExist;
    }
};
ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_model_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReviewService);
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map