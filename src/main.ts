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
  
  // ✅ SECURITY FIX: Clickjacking + CSP
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



// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.setGlobalPrefix('api');
  
//   // ✅ SECURITY FIX: Clickjacking + CSP
//   app.use((req, res, next) => {
//     // X-Frame-Options header - clickjacking hujumlaridan himoya qilish
//     res.setHeader('X-Frame-Options', 'DENY');
    
//     // Content Security Policy:
//     //  - frame-ancestors 'none'  -> bizning saytni boshqa saytlar iframe ichiga qo'ya olmaydi
//     //  - frame-src youtube       -> biz o'zimiz YouTube videolarini iframe orqali qo'ya olamiz
//     res.setHeader(
//       'Content-Security-Policy',
//       "frame-ancestors 'none'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz;"
//     );
    
//     // X-Content-Type-Options - MIME type sniffing'ni oldini olish
//     res.setHeader('X-Content-Type-Options', 'nosniff');
    
//     // X-XSS-Protection - Eski brauzerlar uchun qo'shimcha himoya
//     res.setHeader('X-XSS-Protection', '1; mode=block');
    
//     next();
//   });
  
//   app.enableCors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         'https://uydatalim.uzedu.uz',
//         'http://localhost:3000'
//       ];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     credentials: true,
//   });

//   await app.listen(parseInt(process.env.PORT) || 8001, '0.0.0.0');
// }
// bootstrap();