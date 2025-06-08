import { Module, forwardRef } from '@nestjs/common';
import { AlbumsModule } from '../album/album.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../track/track.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

@Module({
  imports: [forwardRef(() => AlbumsModule), forwardRef(() => TrackModule), forwardRef(() => FavoritesModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistsModule {}
