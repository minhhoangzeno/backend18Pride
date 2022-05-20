import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoYoutube, VideoYoutubeSchema } from './schemas/video-youtube.schemas';
import { VideoYoutubeController } from './video-youtube.controller';
import { VideoYoutubeService } from './video-youtube.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: VideoYoutube.name, schema: VideoYoutubeSchema }])],
  controllers: [VideoYoutubeController],
  providers: [VideoYoutubeService]
})
export class VideoYoutubeModule {}
