import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OneIdService } from './oneidtoken.service';
import { OneIdController } from './oneidtoken.controller';

@Module({
  imports: [HttpModule],
  providers: [OneIdService],
  controllers: [OneIdController],
})
export class OneIdTokenModule {}
