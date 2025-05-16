import { Module } from '@nestjs/common';
import { ResiduesService } from './residues.service';
import { ResiduesController } from './residues.controller';

@Module({
  controllers: [ResiduesController],
  providers: [ResiduesService],
})
export class ResiduesModule {}
