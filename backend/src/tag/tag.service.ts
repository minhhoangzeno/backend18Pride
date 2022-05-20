import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { messageNotFound, statusCodeErrorUser } from 'src/constant';
import { HttpExceptError } from 'src/helpers/error';
import { VideoYoutube, VideoYoutubeDocument } from 'src/video-youtube/schemas/video-youtube.schemas';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schemas';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectModel(VideoYoutube.name) private videoYoutubeModel: Model<VideoYoutubeDocument>
  ) { }

  async findAll(activePage: number, limit: number) {
    return this.tagModel.find().skip(limit * (activePage - 1)).limit(limit).exec().then((result: any) => {
      return this.tagModel.countDocuments().exec().then(countDocuments => {
        return {
          total: countDocuments,
          data: result
        }
      })
    });
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    let tag = new this.tagModel({ ...createTagDto });
    return tag.save();
  }

  async updateTag(id: string, updateTagDto: UpdateTagDto) {
    return this.tagModel.findByIdAndUpdate(id, updateTagDto).catch(() => {
      throw new HttpExceptError(messageNotFound, statusCodeErrorUser);
    })
  }

  async deleteTag(id: string) {
    return this.tagModel.findByIdAndDelete(id).then(result => {
      this.videoYoutubeModel.deleteMany({ tag: result._id }).then((videos) => {
        console.log(videos)
      }).catch(err => console.log("err", err))
    }).catch(() => {
      throw new HttpExceptError(messageNotFound, statusCodeErrorUser);
    })
  }

}
