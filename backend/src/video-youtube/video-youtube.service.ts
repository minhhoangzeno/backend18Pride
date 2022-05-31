import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { messageNotFound, messageVideoUnquie, messageVideoValid, statusCodeErrorUser } from 'src/constant';
import { deleteFileMulter } from 'src/helpers/deleteFileMulter';
import { HttpExceptError } from 'src/helpers/error';
import { uploadFileCloudfare } from 'src/helpers/uploadFileCloudfare';
import { getYoutubeVideoId } from 'src/helpers/videoUrlYoutube';
import { VideoYoutubeDto } from './dto/video-youtube.dto';
import { VideoYoutube, VideoYoutubeDocument } from './schemas/video-youtube.schemas';

@Injectable()
export class VideoYoutubeService {
  constructor(@InjectModel(VideoYoutube.name) private videoYoutubeModel: Model<VideoYoutubeDocument>) { }

  async findAll(activePage: number, limit: number) {
    return this.videoYoutubeModel.find().populate("tag", "name", "Tag").skip(limit * (activePage - 1)).limit(limit).exec().then(result => {
      return this.videoYoutubeModel.countDocuments().exec().then(countDocuments => {
        return {
          total: countDocuments,
          data: result
        }
      })
    });
  }

  async findByTag(activePage: number, limit: number, tag: string) {
    if (tag == "Tất cả") {
      return this.videoYoutubeModel.find().populate("tag", "name", "Tag").skip(limit * (activePage - 1)).limit(limit).exec().then(result => {
        return this.videoYoutubeModel.countDocuments().exec().then(countDocuments => {
          return {
            total: countDocuments,
            data: result
          }
        })
      });
    } else {
      return this.videoYoutubeModel.find({ tag }).populate("tag", "name", "Tag").skip(limit * (activePage - 1)).limit(limit).exec().then(result => {
        return this.videoYoutubeModel.find({ tag }).countDocuments().exec().then(countDocuments => {
          return {
            total: countDocuments,
            data: result
          }
        })
      });
    }

  }

  async createVideoYoutube(videoYoutubeDto: VideoYoutubeDto, file: any) {
    let photoURL = await uploadFileCloudfare(file);
    if (photoURL) {
      let videoYoutubeID = await this.videoYoutubeUnquie(videoYoutubeDto.videoID);
      if (videoYoutubeID) {
        return this.videoYoutubeModel.create({ photoURL, ...videoYoutubeDto, videoID: videoYoutubeID });
      }
    }
  }

  async updateVideoYoutube(id: string, videoYoutubeDto: VideoYoutubeDto, file?: any) {
    let video = await this.videoYoutubeModel.findById(id);
    let photoURL = video.photoURL;
    if (file) {
      photoURL = await uploadFileCloudfare(file);
    }
    if (video) {
      let videoYoutubeID = getYoutubeVideoId(videoYoutubeDto.videoID);
      if (videoYoutubeID) {
        if (videoYoutubeID == video.videoID) {
          await this.videoYoutubeModel.findByIdAndUpdate(id, { ...videoYoutubeDto, videoID: video.videoID, photoURL: photoURL })
        } else {
          let checkReturnVideoYoutube = await this.videoYoutubeUnquie(videoYoutubeDto.videoID);
          if (checkReturnVideoYoutube) {
            await this.videoYoutubeModel.findByIdAndUpdate(id, { ...videoYoutubeDto, videoID: checkReturnVideoYoutube, photoURL: photoURL })
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
