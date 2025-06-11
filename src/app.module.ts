import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController, AlbumService } from './album';
import { Album, Artist, Favorites, Track, User } from './entities';
import { typeOrmConfig } from './typeorm.config';
import { UserController, UserService } from './user';
import { ArtistController, ArtistService } from './artist';
import { TrackController, TrackService } from './track';
import { FavoritesController, FavoritesService } from './favorites';
import { LoggerMiddleware, AuthMiddleware } from './middleware';
import { TestErrorController } from './test-error.controller';
import { AuthController, AuthService } from './auth';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([User, Artist, Track, Album, Favorites])],
  controllers: [UserController, AlbumController, ArtistController, TrackController, FavoritesController, TestErrorController, AuthController],
  providers: [UserService, AlbumService, ArtistService, TrackService, FavoritesService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(AuthMiddleware)
      .exclude(
        '/',
        '/doc',
        '/test-errors/unhandled',
        '/test-errors/uncaught',
        '/auth/signup',
        '/auth/login',
        '/auth/refresh'
      )
      .forRoutes('*');
  }
}
