import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique('UQ_user_login', ['login'])
export class User {
  @PrimaryColumn({
    type: 'uuid',
    primaryKeyConstraintName: 'PK_user_id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({
    type: 'int8',
    default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000)',
  })
  createdAt: number;

  @Column({
    type: 'int8',
    default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000)',
  })
  updatedAt: number;
}
