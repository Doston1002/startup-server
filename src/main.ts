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
