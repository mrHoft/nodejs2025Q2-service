import { MigrationInterface, QueryRunner } from "typeorm";

export default class InitialSchema1749281303512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("Running InitialSchema migration...");

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login" character varying NOT NULL,
        "password" character varying NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "createdAt" int8 NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        "updatedAt" int8 NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_login" UNIQUE ("login")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "artist" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "grammy" boolean NOT NULL,
        CONSTRAINT "PK_artist_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "album" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_album_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_album_artist" FOREIGN KEY ("artistId")
          REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);


    await queryRunner.query(`
      CREATE TABLE "track" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "duration" integer NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        CONSTRAINT "PK_track_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_track_artist" FOREIGN KEY ("artistId")
          REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT "FK_track_album" FOREIGN KEY ("albumId")
          REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" integer NOT NULL DEFAULT 1,
        "artists" text[] NOT NULL DEFAULT '{}',
        "albums" text[] NOT NULL DEFAULT '{}',
        "tracks" text[] NOT NULL DEFAULT '{}',
        CONSTRAINT "PK_favorites_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_favorites_single_row" CHECK (id = 1)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }

}
