import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) { }

  @Get()
  async findAll(@Query('activePage') activePage: number, @Query('limit') limit: number) {
    return this.tagService.findAll(activePage, limit);
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Put(':id')
  async updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.updateTag(id, updateTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string){
    return this.tagService.deleteTag(id)
  }
}
