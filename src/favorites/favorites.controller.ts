import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validate as uuidValidate } from 'uuid';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    try {
      const result = this.favoritesService.addArtist(id);
      return { message: result.message };
    } catch (error) {
      console.log('Error:', error.status, error.message)
      throw error;
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = this.favoritesService.removeArtist(id);
    if (!result) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    try {
      const result = this.favoritesService.addAlbum(id);
      return { message: result.message };
    } catch (error) {
      console.log('Error:', error.status, error.message)
      throw error;
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = this.favoritesService.removeAlbum(id);
    if (!result) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    try {
      const result = this.favoritesService.addTrack(id);
      return { message: result.message };
    } catch (error) {
      console.log('Error:', error.status, error.message)
      throw error;
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = this.favoritesService.removeTrack(id);
    if (!result) {
      throw new NotFoundException('Track not found in favorites');
    }
  }
}
