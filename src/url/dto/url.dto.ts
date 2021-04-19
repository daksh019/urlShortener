import {
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UrlDto {
  @IsDefined()
  @IsUrl({
    allow_underscores: true,
  })
  longUrl: string;

  @IsString()
  @Length(7, 7)
  @IsOptional()
  shortUrl: string;

  @IsString()
  @IsOptional()
  hash: string;
}
