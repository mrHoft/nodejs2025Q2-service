import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from '../shared/interfaces';
import { CreateTrackDto } from '../shared/dtos';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  getAll(): Track[] {
    return [...this.tracks];
  }

  getById(id: string): Track | null {
    console.log('Request: Get track', id);
    return this.tracks.find((track) => track.id === id) || null;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    this.tracks.push(newTrack);

    console.log('Request: Create track', newTrack.id);
    return { ...newTrack };
  }

  update(id: string, updateTrackDto: CreateTrackDto): Track | null {
    const trackIndex = this.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) return null;

    const updatedTrack: Track = {
      ...this.tracks[trackIndex],
      name: updateTrackDto.name,
      artistId: updateTrackDto.artistId || null,
      albumId: updateTrackDto.albumId || null,
      duration: updateTrackDto.duration,
    };

    this.tracks[trackIndex] = updatedTrack;
    return { ...updatedTrack };
  }

  delete(id: string): boolean {
    console.log('Request: Delete track', id);
    const track = this.tracks.find((t) => t.id === id);
    if (!track) return false;

    this.favoritesService.removeTrack(id);

    this.tracks = this.tracks.filter((t) => t.id !== id);
    return true;
  }

  removeArtistReference(artistId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }

  removeAlbumReference(albumId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }

      return track;
    });
  }
}
