import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { Track } from './track.entity';
import type { CustomRelationOptions } from './types';

@Entity()
export class Album {
  @PrimaryColumn({
    type: 'uuid',
    primaryKeyConstraintName: 'PK_album_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  year: number;

  @ManyToOne(() => Artist, artist => artist.albums, {
    onDelete: 'SET NULL',
    foreignKeyConstraintName: 'FK_album_artist',
  } as CustomRelationOptions)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ type: 'uuid', nullable: true })
  artistId: string;

  @OneToMany(() => Track, track => track.album)
  tracks: Track[];
}
