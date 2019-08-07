import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';
import { Tickets } from '../tickets/tickets.entity';
import { TicketsDto } from '../tickets/tickets.dto';
export class ReservationsDto {
  @IsOptional()
  @ApiModelProperty()
  readonly id: number;

  @IsNumber()
  @ApiModelProperty()
  readonly event_id: number;

  @IsString()
  @MaxLength(100)
  @ApiModelProperty()
  readonly customer_type: string;

  @IsString()
  @MaxLength(300)
  @ApiModelProperty()
  readonly name: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiModelProperty()
  readonly school_name: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiModelProperty()
  readonly class: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiModelProperty()
  readonly phone: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiModelProperty()
  readonly email: string;

  @IsArray()
  @ArrayNotEmpty()
  @ApiModelProperty({ type: TicketsDto, isArray: true })
  @ValidateNested()
  @Type(_ => TicketsDto)
  tickets: Tickets[];

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  confirmed: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  sms_sent: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  cancelled: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  payment_completed: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty()
  payment_required: boolean;

  @IsString()
  @ApiModelProperty()
  created_date: string;
}
