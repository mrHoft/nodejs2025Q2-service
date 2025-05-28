import { Module } from '@nestjs/common';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  providers: [ArtistsService, AlbumsService, TracksService, FavoritesService],
  exports: [ArtistsService, AlbumsService, TracksService, FavoritesService],
})
export class SharedModule { }
