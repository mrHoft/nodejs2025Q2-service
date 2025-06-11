import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const response = await this.favoritesService.addArtist(id);
    if (response instanceof Error) {
      throw response;
    }
    return response;
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = await this.favoritesService.removeArtist(id);
    if (!result) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const response = await this.favoritesService.addAlbum(id);
    if (response instanceof Error) {
      throw response;
    }
    return response;
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = await this.favoritesService.removeAlbum(id);
    if (!result) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  @Post('track/:id')
  async addTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const response = await this.favoritesService.addTrack(id);
    if (response instanceof Error) {
      throw response;
    }
    return response;
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = await this.favoritesService.removeTrack(id);
    if (!result) {
      throw new NotFoundException('Track not found in favorites');
    }
  }
}
