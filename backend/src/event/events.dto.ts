import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriceDto } from '../price/price.dto';
import { ApiModelProperty } from '@nestjs/swagger';
const areas = require('../data/areas.json');

export class EventsDto {
  @IsOptional() id: number;
  @IsString()
  @ApiModelProperty()
  readonly name: string;
  @IsString()
  @ApiModelProperty()
  readonly location: string;
  @IsString()
  @ApiModelProperty()
  readonly description: string;
  @IsString()
  @ApiModelProperty()
  readonly event_date: string;
  @IsString()
  @ApiModelProperty()
  readonly event_time: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(type => PriceDto)
  @ApiModelProperty({ type: PriceDto, isArray: true })
  readonly ticket_catalog: PriceDto[];

  @IsString()
  @ApiModelProperty()
  readonly contact_information: string;
  @IsString()
  @ApiModelProperty()
  readonly event_type: string;

  @IsString()
  @IsIn(areas)
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
  @ApiModelProperty()
  readonly cover_image: string;
  @IsString()
  @ApiModelProperty()
  readonly theme_color: string;
  @IsString()
  @ApiModelProperty()
  readonly performer: string;
}
