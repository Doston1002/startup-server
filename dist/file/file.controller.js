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
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_service_1 = require("./file.service");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async saveFile(file, folder) {
        if (!file) {
            throw new common_1.BadRequestException('Fayl yuklanmadi');
        }
        return this.fileService.saveFile(file, folder);
    }
    async savePdfFile(file, folder) {
        if (!file) {
            throw new common_1.BadRequestException('Fayl yuklanmadi');
        }
        return this.fileService.saveFile(file, folder);
    }
};
__decorate([
    (0, common_1.Post)('save'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new common_1.BadRequestException('Faqat rasm fayllar ruxsat etilgan (jpg, jpeg, png, gif, webp)'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "saveFile", null);
__decorate([
    (0, common_1.Post)('save-pdf'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('pdf', {
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'application/pdf') {
                return cb(new common_1.BadRequestException('Faqat PDF fayllar ruxsat etilgan'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "savePdfFile", null);
FileController = __decorate([
    (0, common_1.Controller)('file'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map