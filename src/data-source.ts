import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB || 'music_library',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
