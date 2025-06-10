import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [ContainersController],
  providers: [ContainersService],
})
export class ContainersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/containers');
  }
}
