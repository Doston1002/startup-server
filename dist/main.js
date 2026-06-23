"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        const contentSecurityPolicy = [
            "frame-ancestors 'none'",
            "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz",
        ].join('; ');
        res.setHeader('Content-Security-Policy', contentSecurityPolicy);
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
    });
    app.enableCors({
        origin: (origin, callback) => {
            const fromEnv = (process.env.CORS_ORIGINS || '')
                .split(',')
                .map(o => o.trim())
                .filter(Boolean);
            const allowedOrigins = [
                'https://uydatalim.uzedu.uz',
                'https://www.uydatalim.uzedu.uz',
                'http://localhost:3000',
                'http://localhost:5173',
                ...fromEnv,
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
        credentials: true,
        optionsSuccessStatus: 204,
    });
    await app.listen(parseInt(process.env.PORT) || 8000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map