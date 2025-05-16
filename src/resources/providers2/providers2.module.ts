import { Module } from '@nestjs/common';
import { Providers2Service } from './providers2.service';
import { Providers2Controller } from './providers2.controller';

@Module({
  controllers: [Providers2Controller],
  providers: [Providers2Service],
})
export class Providers2Module {}
