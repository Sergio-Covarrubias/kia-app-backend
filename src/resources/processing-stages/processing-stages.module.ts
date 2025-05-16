import { Module } from '@nestjs/common';
import { ProcessingStagesService } from './processing-stages.service';
import { ProcessingStagesController } from './processing-stages.controller';

@Module({
  controllers: [ProcessingStagesController],
  providers: [ProcessingStagesService],
})
export class ProcessingStagesModule {}
