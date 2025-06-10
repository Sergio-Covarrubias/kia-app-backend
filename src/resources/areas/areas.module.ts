import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/areas');
  }
}
