import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController, AlbumService } from './album';
import { Album, Artist, Favorites, Track, User } from './entities';
import { typeOrmConfig } from './typeorm.config';
import { UserController, UserService } from './user';
import { ArtistController, ArtistService } from './artist';
import { TrackController, TrackService } from './track';
import { FavoritesController, FavoritesService } from './favorites';
import { LoggerMiddleware } from './middleware/logger';
import { TestErrorController } from './test-error.controller';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([User, Artist, Track, Album, Favorites])],
  controllers: [UserController, AlbumController, ArtistController, TrackController, FavoritesController, TestErrorController],
  providers: [UserService, AlbumService, ArtistService, TrackService, FavoritesService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
