import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { getMongoDBConfig } from './config/mongo.config';

import { DatabaseModule } from './database.module';

import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { InstructorModule } from './instructor/instructor.module';
import { FileModule } from './file/file.module';
import { SectionModule } from './section/section.module';
import { LessonModule } from './lesson/lesson.module';
import { AdminModule } from './admin/admin.module';
import { BooksModule } from './books/books.module';
import { ReviewModule } from './review/review.module';
import { OpenaiModule } from './openai/openai.module';
import { OneIdModule } from './oneid/oneid.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContactModule } from './contact/contact.module';
import { QuestionModule } from './question/question.module';

import { AppController } from './app.controller';
import { StudentController } from './student.controller';
import { DirektorController } from './direktor.controller';
import { AuthController } from './auth.controller';

import { AppService } from './app.service';

import { UserActivityInterceptor } from './logger/user-activity.interceptor';
import { UserActivityLogger } from './logger/user-activity.logger';
import { TelegramService } from './telegram/telegram.service';
import { StudentExpiryService } from './student-expiry/student-expiry.service';
import { StudentExpiryScheduler } from './student-expiry/student-expiry.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDBConfig,
    }),

    DatabaseModule,

    AuthModule,
    CourseModule,
    UserModule,
    MailModule,
    InstructorModule,
    FileModule,
    SectionModule,
    LessonModule,
    AdminModule,
    BooksModule,
    OpenaiModule,
    ReviewModule,
    OneIdModule,
    NewsletterModule,
    ContactModule,
    QuestionModule,
  ],

  controllers: [
    AppController,
    StudentController,
    DirektorController,
    AuthController,
  ],

  providers: [
    AppService,
    UserActivityLogger,
    TelegramService,
    StudentExpiryService,
    StudentExpiryScheduler,

    {
      provide: APP_INTERCEPTOR,
      useClass: UserActivityInterceptor,
    },
  ],
})
export class AppModule {}