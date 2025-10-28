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
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  // ✅ SECURITY FIX: Global validation pipe qo'shildi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da bo'lmagan propertylarni olib tashlaydi
      forbidNonWhitelisted: true, // DTO'da bo'lmagan propertylar xato beradi
      transform: true, // Typeni avtomatik convert qiladi
    })
  );
  
  // ✅ SECURITY FIX: CORS configuration yaxshilandi
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://uydatalim.uzedu.uz',
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      
      // Development'da origin bo'lmasa ham ruxsat (Postman uchun)
      // Production'da faqat allowed origins
      if (isDevelopment && !origin) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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
