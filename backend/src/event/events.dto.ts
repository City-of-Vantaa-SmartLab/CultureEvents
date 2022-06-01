import {
  IsString,
  IsArray,
  IsBoolean,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriceDto } from '../price/price.dto';
import { areas } from '../data/areas';

export class EventsDto {
  @IsOptional() id: number;

  @IsString()
  @MaxLength(300)
  readonly name: string;

  @IsString()
  @MaxLength(500)
  readonly location: string;

  @IsString()
  @MaxLength(3000)
  readonly description: string;

  @IsString()
  @MaxLength(500)
  readonly event_date: string;

  @IsString()
  @MaxLength(500)
  readonly event_time: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(_ => PriceDto)
  readonly ticket_catalog: PriceDto[];

  @IsString()
  @MaxLength(300)
  readonly contact_information: string;

  @IsString()
  @MaxLength(300)
  readonly event_type: string;

  @IsString()
  @IsIn(areas)
  readonly area: string;

  @IsArray()
  readonly age_group_limits: string[];

  @IsBoolean()
  readonly is_wordless: boolean;

  @IsBoolean()
  readonly is_bilingual: boolean;

  @IsString()
  @MaxLength(2000)
  readonly cover_image: string;

  @IsString()
  @MaxLength(300)
  readonly theme_color: string;

  @IsString()
  @MaxLength(300)
  readonly performer: string;
}
