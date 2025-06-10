import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ResiduesService } from './residues.service';
import { ResiduesController } from './residues.controller';
import { AdminMiddleware } from '@middlewares/admin.middleware';

@Module({
  controllers: [ResiduesController],
  providers: [ResiduesService],
})
export class ResiduesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddleware)
      .forRoutes('api/residues');
  }
}
