import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @IsUUID()
  @IsOptional()
  albumId: string | null;

  @IsNumber()
  duration: number;
}

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;
}
