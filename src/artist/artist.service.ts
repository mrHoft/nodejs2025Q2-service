import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    console.log('Get artists')
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    console.log(`Get artist ${id}`)
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  async create(createArtistDto: { name: string; grammy: boolean }): Promise<Artist> {
    console.log(`Create artist ${createArtistDto.name}`)
    const artist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(artist);
  }

  async update(id: string, updateArtistDto: { name?: string; grammy?: boolean }): Promise<Artist> {
    console.log(`Update artist ${id}`)
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  async delete(id: string) {
    console.log(`Delete artist ${id}`)
    return this.artistRepository.delete(id);
  }

  async findAllByIds(ids: string[]): Promise<Artist[]> {
    return this.artistRepository.findByIds(ids);
  }
}
