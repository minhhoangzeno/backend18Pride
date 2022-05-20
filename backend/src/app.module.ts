import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { databaseUrl } from './enviroment';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { VideoYoutubeModule } from './video-youtube/video-youtube.module';

@Module({
  imports: [MongooseModule.forRoot(databaseUrl), UserModule, AuthModule, TagModule, VideoYoutubeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
