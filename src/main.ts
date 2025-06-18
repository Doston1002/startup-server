import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://uyda-talim.uz',
      'http://213.230.99.101:2246',
    ],
    methods: ["GET", "POST"],
    credentials: true,
  });
  await app.listen(parseInt(process.env.PORT) || 8000, "0.0.0.0");
}
bootstrap();
