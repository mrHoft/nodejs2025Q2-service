import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from '../shared/dtos';
import { validate as uuidValidate } from 'uuid';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) { }

  @Get()
  getAll() {
    return this.artistsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const artist = this.artistsService.getById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: CreateArtistDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const artist = this.artistsService.update(id, updateArtistDto);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = this.artistsService.delete(id);
    if (!result) {
      throw new NotFoundException('Artist not found');
    }
  }
}
