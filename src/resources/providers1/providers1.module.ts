import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Providers1Service } from './providers1.service';
import { Providers1Controller } from './providers1.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [Providers1Controller],
  providers: [Providers1Service],
})
export class Providers1Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/providers1');
  }
}
