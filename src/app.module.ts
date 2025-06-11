import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController, AlbumService } from './album';
import { ArtistController, ArtistService } from './artist';
import { AuthController, AuthService } from './auth';
import { Album, Artist, Favorites, Track, User } from './entities';
import { FavoritesController, FavoritesService } from './favorites';
import { AuthMiddleware, LoggerMiddleware } from './middleware';
import { TestErrorController } from './test-error.controller';
import { TrackController, TrackService } from './track';
import { typeOrmConfig } from './typeorm.config';
import { UserController, UserService } from './user';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([User, Artist, Track, Album, Favorites])],
  controllers: [
    UserController,
    AlbumController,
    ArtistController,
    TrackController,
    FavoritesController,
    TestErrorController,
    AuthController,
  ],
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
        '/auth/refresh',
      )
      .forRoutes('*');
  }
}
