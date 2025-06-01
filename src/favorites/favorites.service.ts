import { Injectable, Inject, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Favorites, FavoritesResponse } from '../shared/interfaces';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) { }

  getAll(): FavoritesResponse {
    return {
      artists: this.favorites.artists
        .map((id) => this.artistsService.getById(id))
        .filter(Boolean),
      albums: this.favorites.albums
        .map((id) => this.albumsService.getById(id))
        .filter(Boolean),
      tracks: this.favorites.tracks
        .map((id) => this.tracksService.getById(id))
        .filter(Boolean),
    };
  }

  addArtist(id: string): { status: HttpStatus; message: string } {
    console.log('Request: Add artist to favorites', id)
    if (!uuidValidate(id)) {
      throw new HttpException(
        'Artist ID is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const artist = this.artistsService.getById(id);
    if (!artist) {
      throw new HttpException(
        'Artist with this ID does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Artist successfully added to favorites',
    };
  }

  addAlbum(id: string): { status: HttpStatus; message: string } {
    console.log('Request: Add album to favorites', id)
    if (!uuidValidate(id)) {
      throw new HttpException(
        'Artist ID is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const album = this.albumsService.getById(id);
    if (!album) {
      throw new HttpException(
        'Artist with this ID does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Album successfully added to favorites',
    };
  }

  addTrack(id: string): { status: HttpStatus; message: string } {
    console.log('Request: Add album to favorites', id)
    if (!uuidValidate(id)) {
      throw new HttpException(
        'Artist ID is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const album = this.tracksService.getById(id);
    if (!album) {
      throw new HttpException(
        'Artist with this ID does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Track successfully added to favorites',
    };
  }

  removeArtist(id: string): boolean {
    const initialLength = this.favorites.artists.length;
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    return this.favorites.artists.length !== initialLength;
  }

  removeAlbum(id: string): boolean {
    const initialLength = this.favorites.albums.length;
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    return this.favorites.albums.length !== initialLength;
  }

  removeTrack(id: string): boolean {
    const initialLength = this.favorites.tracks.length;
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
    return this.favorites.tracks.length !== initialLength;
  }
}
