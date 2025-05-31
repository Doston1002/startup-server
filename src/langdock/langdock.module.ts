import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangdockService } from './langdock.service';
import { LangdockController } from './langdock.controller';

@Module({
  imports: [ConfigModule],
  providers: [LangdockService],
  controllers: [LangdockController],
  exports: [LangdockService],
})
export class LangdockModule {}
