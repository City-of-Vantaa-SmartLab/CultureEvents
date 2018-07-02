import { IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { PriceDto } from '../price/price.dto';
import { ApiModelProperty } from '@nestjs/swagger';
export class EventsDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;
  @IsString()
  @ApiModelProperty()
  readonly location: string;
  @IsString()
  @ApiModelProperty()
  readonly desciption: string;
  @IsString()
  @ApiModelProperty()
  readonly event_date: string;
  @IsString()
  @ApiModelProperty()
  readonly event_time: string;
  @IsArray()
  @ApiModelProperty({ type: PriceDto, isArray: true })
  readonly ticket_catalog: PriceDto[];
  @IsString()
  @ApiModelProperty()
  readonly contact_information: string;
  @IsString()
  @ApiModelProperty()
  readonly event_type: string;
  @IsString()
  @ApiModelProperty()
  readonly age_group_limit: string;
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
