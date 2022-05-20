import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassWordValidatorMiddleware } from './middleware/passwordValidator.middleware';
import { User, UserSchema } from './schemas/user.schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PassWordValidatorMiddleware)
      .forRoutes(
        { path: 'user/register', method: RequestMethod.POST },
        { path: 'user/change-password', method: RequestMethod.POST },
        { path: 'user/verify-password', method: RequestMethod.POST }
      )
  }
}
