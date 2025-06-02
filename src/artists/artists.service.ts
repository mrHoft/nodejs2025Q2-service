import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from '../shared/interfaces';
import { CreateArtistDto } from '../shared/dtos';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  getAll(): Artist[] {
    return [...this.artists];
  }

  getById(id: string): Artist | null {
    return this.artists.find((artist) => artist.id === id) || null;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);
    return { ...newArtist };
  }

  update(id: string, updateArtistDto: CreateArtistDto): Artist | null {
    const artistIndex = this.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) return null;

    const updatedArtist: Artist = {
      ...this.artists[artistIndex],
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    this.artists[artistIndex] = updatedArtist;
    return { ...updatedArtist };
  }

  delete(id: string): boolean {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) return false;

    this.favoritesService.removeArtist(id);

    this.albumsService.removeArtistReference(id);
    this.tracksService.removeArtistReference(id);

    this.artists = this.artists.filter((a) => a.id !== id);
    return true;
  }
}
