import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Track } from '../entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  async findAll(): Promise<Track[]> {
    console.log('Get tracks');
    return this.trackRepository.find({
      relations: ['artist', 'album'],
    });
  }

  async findOne(id: string): Promise<Track> {
    console.log(`Get track ${id}`);
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  async create(createTrackDto: {
    name: string;
    duration: number;
    artistId?: string;
    albumId?: string;
  }): Promise<Track> {
    console.log(`Create track ${createTrackDto.name}`);
    const track = this.trackRepository.create(createTrackDto);

    if (createTrackDto.artistId) {
      track.artist = await this.artistService.findOne(createTrackDto.artistId);
    }

    if (createTrackDto.albumId) {
      track.album = await this.albumService.findOne(createTrackDto.albumId);
    }

    return this.trackRepository.save(track);
  }

  async update(
    id: string,
    updateTrackDto: { name?: string; duration?: number; artistId?: string | null; albumId?: string | null },
  ): Promise<Track> {
    console.log(`Update track ${id}`);
    const track = await this.findOne(id);

    if (updateTrackDto.artistId !== undefined) {
      track.artist = updateTrackDto.artistId ? await this.artistService.findOne(updateTrackDto.artistId) : null;
    }

    if (updateTrackDto.albumId !== undefined) {
      track.album = updateTrackDto.albumId ? await this.albumService.findOne(updateTrackDto.albumId) : null;
    }

    Object.assign(track, updateTrackDto);
    return this.trackRepository.save(track);
  }

  delete(id: string) {
    console.log(`Delete track ${id}`);
    return this.trackRepository.delete(id);
  }

  async findAllByIds(ids: string[]): Promise<Track[]> {
    return this.trackRepository.findByIds(ids);
  }
}
