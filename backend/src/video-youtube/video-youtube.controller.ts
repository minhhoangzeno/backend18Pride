import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideoYoutubeDto } from './dto/video-youtube.dto';
import { VideoYoutubeService } from './video-youtube.service';

@Controller('video-youtube')
export class VideoYoutubeController {
  constructor(private videoYoutubeService: VideoYoutubeService) { }

  @Get()
  async findAll(@Query('activePage') activePage: number, @Query('limit') limit: number) {
    return this.videoYoutubeService.findAll(activePage, limit);
  }

  @Get('list')
  async findByTag(@Query('activePage') activePage: number, @Query('limit') limit: number, @Query('tag') tag: string) {
    return this.videoYoutubeService.findByTag(activePage, limit, tag);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createVideoYoutube(@UploadedFile() file: Express.Multer.File, @Body() body: VideoYoutubeDto) {
    return this.videoYoutubeService.createVideoYoutube(body, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateVideoYoutube(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() body: VideoYoutubeDto) {
    if (file) {
      return this.videoYoutubeService.updateVideoYoutube(id, body, file)
    } else {
      return this.videoYoutubeService.updateVideoYoutube(id, body)
    }
  }

  @Delete(':id')
  async deleteVideoYoutube(@Param('id') id: string) {
    return this.videoYoutubeService.deleteVideoYoutube(id);
  }

}
