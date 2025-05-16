import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { AuthMiddleware } from '../middlewares/auth.middleware';

import { AuthTokenService } from './auth-token.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [AuthTokenService, UsersService, ...usersProviders],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('api/validate');
  }
}
