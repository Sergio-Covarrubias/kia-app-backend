import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SctCodesService } from './sct-codes.service';
import { SctCodesController } from './sct-codes.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [SctCodesController],
  providers: [SctCodesService],
})
export class SctCodesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/sct-codes');
  }
}
