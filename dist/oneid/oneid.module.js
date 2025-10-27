"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneIdModule = void 0;
const common_1 = require("@nestjs/common");
const oneid_controller_1 = require("./oneid.controller");
const oneid_service_1 = require("./oneid.service");
const jwt_1 = require("@nestjs/jwt");
let OneIdModule = class OneIdModule {
};
OneIdModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'default_jwt_secret',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
            }),
        ],
        controllers: [oneid_controller_1.OneIdController],
        providers: [oneid_service_1.OneIdService],
    })
], OneIdModule);
exports.OneIdModule = OneIdModule;
//# sourceMappingURL=oneid.module.js.map