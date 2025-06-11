import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { CreateAlbumDto } from '../shared/dtos';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  getAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const album = this.albumsService.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const album = await this.albumsService.create(createAlbumDto);
    return album;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: CreateAlbumDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const album = this.albumsService.update(id, updateAlbumDto);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = await this.albumsService.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
  }
}
