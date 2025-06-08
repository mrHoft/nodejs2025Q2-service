import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.PG_PORT, 10) || 5432,
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB || 'music_library',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
