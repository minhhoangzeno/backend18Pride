import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Tag } from 'src/tag/schemas/tag.schemas';

export type VideoYoutubeDocument = VideoYoutube & Document;

@Schema()
export class VideoYoutube {
  @Prop()
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ unique: true, required: true })
  videoID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  tag: Tag

  @Prop({ required: true })
  metaDescription: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  photoURL: string;

  @Prop({ default: new Date() })
  createdAt: Date;

}

export const VideoYoutubeSchema = SchemaFactory.createForClass(VideoYoutube);