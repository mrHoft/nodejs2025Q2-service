import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import type { CustomRelationOptions } from './types';
import { Album } from './album.entity';
import { Track } from './track.entity';

@Entity()
export class Artist {
  @PrimaryColumn({
    type: 'uuid',
    primaryKeyConstraintName: 'PK_artist_id',
    default: () => 'uuid_generate_v4()'
  })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean' })
  grammy: boolean;

  @OneToMany(() => Album, album => album.artist, {
    foreignKeyConstraintName: 'FK_album_artist'
  } as CustomRelationOptions)
  albums: Album[];

  @OneToMany(() => Track, track => track.artist)
  tracks: Track[];
}
