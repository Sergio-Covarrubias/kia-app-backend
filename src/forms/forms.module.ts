import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';

import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { formsProviders } from './forms.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [FormsController],
  providers: [FormsService, ...formsProviders],
})
export class FormsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('api/form');
  }
}
