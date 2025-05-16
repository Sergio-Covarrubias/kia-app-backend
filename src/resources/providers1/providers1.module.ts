import { Module } from '@nestjs/common';
import { Providers1Service } from './providers1.service';
import { Providers1Controller } from './providers1.controller';

@Module({
  controllers: [Providers1Controller],
  providers: [Providers1Service],
})
export class Providers1Module {}
