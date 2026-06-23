"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDBConfig = void 0;
const getMongoDBConfig = async (configService) => {
    var _a, _b;
    const uri = ((_a = configService.get('MONGODB_URI')) === null || _a === void 0 ? void 0 : _a.trim()) ||
        ((_b = process.env.MONGODB_URI) === null || _b === void 0 ? void 0 : _b.trim());
    if (!uri) {
        throw new Error('MONGODB_URI .env faylida topilmadi');
    }
    return { uri };
};
exports.getMongoDBConfig = getMongoDBConfig;
//# sourceMappingURL=mongo.config.js.map