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
import { ApiModelProperty } from '@nestjs/swagger';
import { areas } from '../data/areas';

export class EventsDto {
  @IsOptional() id: number;

  @IsString()
  @MaxLength(300)
  @ApiModelProperty()
  readonly name: string;

  @IsString()
  @MaxLength(500)
  @ApiModelProperty()
  readonly location: string;

  @IsString()
  @MaxLength(3000)
  @ApiModelProperty()
  readonly description: string;

  @IsString()
  @MaxLength(500)
  @ApiModelProperty()
  readonly event_date: string;

  @IsString()
  @MaxLength(500)
  @ApiModelProperty()
  readonly event_time: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(_ => PriceDto)
  @ApiModelProperty({ type: PriceDto, isArray: true })
  readonly ticket_catalog: PriceDto[];

  @IsString()
  @MaxLength(300)
  @ApiModelProperty()
  readonly contact_information: string;

  @IsString()
  @MaxLength(300)
  @ApiModelProperty()
  readonly event_type: string;

  @IsString()
  @IsIn(areas)
  @ApiModelProperty()
  readonly area: string;

  @IsArray()
  @ApiModelProperty()
  readonly age_group_limits: string[];

  @IsBoolean()
  @ApiModelProperty()
  readonly is_wordless: boolean;

  @IsBoolean()
  @ApiModelProperty()
  readonly is_bilingual: boolean;

  @IsString()
  @MaxLength(2000)
  @ApiModelProperty()
  readonly cover_image: string;

  @IsString()
  @MaxLength(300)
  @ApiModelProperty()
  readonly theme_color: string;

  @IsString()
  @MaxLength(300)
  @ApiModelProperty()
  readonly performer: string;
}
