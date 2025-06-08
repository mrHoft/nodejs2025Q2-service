import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { Favorites } from '../entities//favorites.entity';
import { TrackService } from '../track/track.service';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) { }

  private async getFavorites(): Promise<Favorites> {
    let favorites = await this.favoritesRepository.findOne({ where: { id: 1 } });

    if (!favorites) {
      favorites = this.favoritesRepository.create({ id: 1 });
      await this.favoritesRepository.save(favorites);
    }

    return favorites;
  }

  async findAll() {
    console.log('Get favorites')
    const favorites = await this.getFavorites();
    return {
      artists: await this.artistService.findAllByIds(favorites.artists),
      albums: await this.albumService.findAllByIds(favorites.albums),
      tracks: await this.trackService.findAllByIds(favorites.tracks),
    };
  }

  async addArtist(id: string) {
    console.log('Add to favorites artist', id)
    const artist=await this.artistService.findOne(id).catch(()=>null);
    if(!artist){
      return new UnprocessableEntityException(`Artist ${id} was not found!`)
    }
    console.log(artist)
    const favorites = await this.getFavorites();

    if (!favorites.artists.includes(id)) {
      favorites.artists.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string) {
    console.log('Remove from favorites artist', id)
    const favorites = await this.getFavorites();
    favorites.artists = favorites.artists.filter(artistId => artistId !== id);
    return this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string) {
    console.log('Add to favorites album', id)
    const album=await this.albumService.findOne(id).catch(()=>null);
    if(!album){
      return new UnprocessableEntityException(`Album ${id} was not found!`)
    }
    const favorites = await this.getFavorites();

    if (!favorites.albums.includes(id)) {
      favorites.albums.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbum(id: string) {
    console.log('Remove from favorites album', id)
    const favorites = await this.getFavorites();
    favorites.albums = favorites.albums.filter(albumId => albumId !== id);
    return this.favoritesRepository.save(favorites);
  }

  async addTrack(id: string) {
    console.log('Add to favorites track', id)
    const track=await this.trackService.findOne(id).catch(()=>null);
    if(!track){
      return new UnprocessableEntityException(`Track ${id} was not found!`)
    }
    const favorites = await this.getFavorites();

    if (!favorites.tracks.includes(id)) {
      favorites.tracks.push(id);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrack(id: string) {
    console.log('Remove from favorites track', id)
    const favorites = await this.getFavorites();
    favorites.tracks = favorites.tracks.filter(trackId => trackId !== id);
    return this.favoritesRepository.save(favorites);
  }
}
