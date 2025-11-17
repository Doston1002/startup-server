// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.setGlobalPrefix('api');
//   app.enableCors({
//     origin: [
//       'https://uyda-talim.uz',
//       'https://uyda-talim.uz',
//     ],
//     methods: ["GET", "POST"],
//     credentials: true,
//   });
//   await app.listen(parseInt(process.env.PORT) || 8000, "0.0.0.0");
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  // ✅ SECURITY FIX: Clickjacking protection - X-Frame-Options va CSP headerlarini qo'shish
  app.use((req, res, next) => {
    // X-Frame-Options header - clickjacking hujumlaridan himoya qilish
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Content Security Policy - frame-ancestors direktivasi
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors 'none'; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz;"
    );
    
    // X-Content-Type-Options - MIME type sniffing'ni oldini olish
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // X-XSS-Protection - Eski brauzerlar uchun qo'shimcha himoya
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    next();
  });
  
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://uydatalim.uzedu.uz',
        'http://localhost:3000'
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(parseInt(process.env.PORT) || 8001, '0.0.0.0');
}
bootstrap();