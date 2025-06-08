import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Album } from './album.entity';
import { Artist } from './artist.entity';
import type { CustomRelationOptions } from './types';

@Entity()
export class Track {
  @PrimaryColumn({
    type: 'uuid',
    primaryKeyConstraintName: 'PK_track_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  duration: number;

  @ManyToOne(() => Artist, artist => artist.tracks, {
    onDelete: 'SET NULL',
    foreignKeyConstraintName: 'FK_track_artist',
  } as CustomRelationOptions)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ type: 'uuid', nullable: true })
  artistId: string;

  @ManyToOne(() => Album, album => album.tracks, {
    onDelete: 'SET NULL',
    foreignKeyConstraintName: 'FK_track_album',
  } as CustomRelationOptions)
  @JoinColumn({ name: 'albumId' })
  album: Album;

  @Column({ type: 'uuid', nullable: true })
  albumId: string;
}
