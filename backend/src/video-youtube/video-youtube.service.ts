import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { messageNotFound, messageVideoUnquie, messageVideoValid, statusCodeErrorUser } from 'src/constant';
import { deleteFileMulter } from 'src/helpers/deleteFileMulter';
import { HttpExceptError } from 'src/helpers/error';
import { getYoutubeVideoId } from 'src/helpers/videoUrlYoutube';
import { VideoYoutubeDto } from './dto/video-youtube.dto';
import { VideoYoutube, VideoYoutubeDocument } from './schemas/video-youtube.schemas';

@Injectable()
export class VideoYoutubeService {
  constructor(@InjectModel(VideoYoutube.name) private videoYoutubeModel: Model<VideoYoutubeDocument>) { }

  async findAll(activePage: number, limit: number) {
    return this.videoYoutubeModel.find().skip(limit * (activePage - 1)).limit(limit).exec().then(result => {
      return this.videoYoutubeModel.countDocuments().exec().then(countDocuments => {
        return {
          total: countDocuments,
          data: result
        }
      })
    });
  }

  async findByTag(activePage: number, limit: number, tag: string) {
    return this.videoYoutubeModel.find({ tag }).skip(limit * (activePage - 1)).limit(limit).exec().then(result => {
      return this.videoYoutubeModel.countDocuments().exec().then(countDocuments => {
        return {
          total: countDocuments,
          data: result
        }
      })
    });
  }

  async createVideoYoutube(videoYoutubeDto: VideoYoutubeDto, photoURL: string) {
    let videoYoutubeID = await this.videoYoutubeUnquie(videoYoutubeDto.videoID);
    if (videoYoutubeID) {
      return this.videoYoutubeModel.create({ photoURL, ...videoYoutubeDto, videoID: videoYoutubeID });
    }
  }

  async updateVideoYoutube(id: string, videoYoutubeDto: VideoYoutubeDto, photoURL?: string) {
    let video = await this.videoYoutubeModel.findById(id);
    if (video) {
      let videoYoutubeID = getYoutubeVideoId(videoYoutubeDto.videoID);
      if (videoYoutubeID) {
        if (videoYoutubeID == video.videoID) {
          await this.videoYoutubeModel.findByIdAndUpdate(id, { ...videoYoutubeDto, videoID: video.videoID, photoURL: photoURL ? photoURL : video.photoURL }).then(async () => {
            if (photoURL) {
              await deleteFileMulter(video.photoURL)
            }
          })
        } else {
          let checkReturnVideoYoutube = await this.videoYoutubeUnquie(videoYoutubeDto.videoID);
          if (checkReturnVideoYoutube) {
            await this.videoYoutubeModel.findByIdAndUpdate(id, { ...videoYoutubeDto, videoID: checkReturnVideoYoutube, photoURL: photoURL ? photoURL : video.photoURL }).then(async () => {
              if (photoURL) {
                await deleteFileMulter(video.photoURL)
              }
            })
          }
        }
      } else {
        throw new HttpExceptError(messageVideoValid, statusCodeErrorUser)
      }
    } else {
      throw new HttpExceptError(messageNotFound, statusCodeErrorUser);
    }
  }

  async deleteVideoYoutube(id: string) {
    return this.videoYoutubeModel.findByIdAndDelete(id).catch(() => {
      throw new HttpExceptError(messageNotFound, statusCodeErrorUser);
    })
  }

  async videoYoutubeUnquie(videoID: string) {
    if (getYoutubeVideoId(videoID)) {
      const videos = await this.videoYoutubeModel.find({ videoID: getYoutubeVideoId(videoID) })
      if (videos.length == 0) {
        return getYoutubeVideoId(videoID);
      } else {
        throw new HttpExceptError(messageVideoUnquie, statusCodeErrorUser)
      }
    } else {
      throw new HttpExceptError(messageVideoValid, statusCodeErrorUser)
    }
  }

}
