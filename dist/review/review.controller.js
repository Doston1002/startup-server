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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const review_dto_1 = require("./dto/review.dto");
const review_service_1 = require("./review.service");
let ReviewController = class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    createReview(dto) {
        return this.reviewService.createReview(dto);
    }
    deleteReview(reviewId) {
        return this.reviewService.deleteReview(reviewId);
    }
    editReview(reviewId, dto) {
        return this.reviewService.editReview(reviewId, dto);
    }
    getReview(courseId) {
        return this.reviewService.getReview(courseId);
    }
    getByUser(dto) {
        return this.reviewService.getByUser(dto);
    }
};
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "createReview", null);
__decorate([
    (0, common_1.Delete)('delete/:reviewId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Put)('edit/:reviewId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_dto_1.EditReviewDto]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "editReview", null);
__decorate([
    (0, common_1.Get)('get/:courseId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "getReview", null);
__decorate([
    (0, common_1.Post)('get-by-user'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_dto_1.GetByUserDto]),
    __metadata("design:returntype", void 0)
], ReviewController.prototype, "getByUser", null);
ReviewController = __decorate([
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map