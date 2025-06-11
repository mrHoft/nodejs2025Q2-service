import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistService } from '../artist/artist.service';
import { Album } from '../entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly artistService: ArtistService,
  ) {}

  async findAll(): Promise<Album[]> {
    console.log('Get albums');
    return this.albumRepository.find({ relations: ['artist'] });
  }

  async findOne(id: string): Promise<Album> {
    console.log(`Get album ${id}`);
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  async create(createAlbumDto: { name: string; year: number; artistId?: string }): Promise<Album> {
    console.log(`Create album ${createAlbumDto.name}`);
    const album = this.albumRepository.create(createAlbumDto);

    if (createAlbumDto.artistId) {
      album.artist = await this.artistService.findOne(createAlbumDto.artistId);
    }

    return this.albumRepository.save(album);
  }

  async update(id: string, updateAlbumDto: { name?: string; year?: number; artistId?: string | null }): Promise<Album> {
    console.log(`Update album ${id}`);
    const album = await this.findOne(id);

    if (updateAlbumDto.artistId !== undefined) {
      album.artist = updateAlbumDto.artistId ? await this.artistService.findOne(updateAlbumDto.artistId) : null;
    }

    Object.assign(album, updateAlbumDto);
    return this.albumRepository.save(album);
  }

  async delete(id: string) {
    console.log(`Delete album ${id}`);
    return this.albumRepository.delete(id);
  }

  async findAllByIds(ids: string[]): Promise<Album[]> {
    return this.albumRepository.findByIds(ids);
  }
}
