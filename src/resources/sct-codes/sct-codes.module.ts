import { Module } from '@nestjs/common';
import { SctCodesService } from './sct-codes.service';
import { SctCodesController } from './sct-codes.controller';

@Module({
  controllers: [SctCodesController],
  providers: [SctCodesService],
})
export class SctCodesModule {}
