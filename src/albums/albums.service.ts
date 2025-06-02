import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from '../shared/interfaces';
import { CreateAlbumDto } from '../shared/dtos';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  getAll(): Album[] {
    return [...this.albums];
  }

  getById(id: string): Album | null {
    console.log('Request: Get album', id);
    return this.albums.find((album) => album.id === id) || null;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    this.albums.push(newAlbum);

    console.log('Request: Create album', newAlbum.id);
    return { ...newAlbum };
  }

  update(id: string, updateAlbumDto: CreateAlbumDto): Album | null {
    const albumIndex = this.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) return null;

    const updatedAlbum: Album = {
      ...this.albums[albumIndex],
      name: updateAlbumDto.name,
      year: updateAlbumDto.year,
      artistId: updateAlbumDto.artistId || null,
    };

    this.albums[albumIndex] = updatedAlbum;
    return { ...updatedAlbum };
  }

  delete(id: string): boolean {
    console.log('Request: Delete album', id);

    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      console.log('Error: No album', id);
      return false;
    }

    this.favoritesService.removeAlbum(id);

    this.tracksService.removeAlbumReference(id);

    this.albums = this.albums.filter((a) => a.id !== id);
    return true;
  }

  removeArtistReference(artistId: string): void {
    this.albums = this.albums.map((album) => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
