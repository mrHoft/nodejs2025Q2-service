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
import { CreateTrackDto } from '../shared/dtos';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly tracksService: TrackService) {}

  @Get()
  getAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const track = this.tracksService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: CreateTrackDto) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const track = this.tracksService.update(id, updateTrackDto);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const result = await this.tracksService.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }
}
