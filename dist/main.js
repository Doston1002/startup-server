"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const isDevelopment = process.env.NODE_ENV !== 'production';
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                'https://uydatalim.uzedu.uz',
                'http://localhost:3000',
                'http://localhost:3001',
            ];
            if (isDevelopment && !origin) {
                callback(null, true);
            }
            else if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    await app.listen(parseInt(process.env.PORT) || 8000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map