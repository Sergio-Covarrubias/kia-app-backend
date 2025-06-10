import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [ManagersController],
  providers: [ManagersService],
})
export class ManagersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/managers');
  }
}
