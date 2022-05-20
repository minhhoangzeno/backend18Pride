import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoYoutube, VideoYoutubeSchema } from 'src/video-youtube/schemas/video-youtube.schemas';
import { Tag, TagSchema } from './schemas/tag.schemas';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
  MongooseModule.forFeature([{ name: VideoYoutube.name, schema: VideoYoutubeSchema }])
  ],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule { }
