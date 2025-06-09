import { Module, forwardRef } from '@nestjs/common';
import { AlbumsModule } from '../album/album.module';
import { ArtistsModule } from '../artist/artist.module';
import { TrackModule } from '../track/track.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [forwardRef(() => ArtistsModule), forwardRef(() => AlbumsModule), forwardRef(() => TrackModule)],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
