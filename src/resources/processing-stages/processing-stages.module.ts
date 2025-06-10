import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProcessingStagesService } from './processing-stages.service';
import { ProcessingStagesController } from './processing-stages.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [ProcessingStagesController],
  providers: [ProcessingStagesService],
})
export class ProcessingStagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/processing-stages');
  }
}
