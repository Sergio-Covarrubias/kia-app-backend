import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Providers2Service } from './providers2.service';
import { Providers2Controller } from './providers2.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [Providers2Controller],
  providers: [Providers2Service],
})
export class Providers2Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/providers2');
  }
}
