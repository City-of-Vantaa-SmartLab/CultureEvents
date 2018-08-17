import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';
import { Tickets } from 'tickets/tickets.entity';
import { TicketsDto } from 'tickets/tickets.dto';
export class ReservationsDto {
  @IsOptional()
  @ApiModelProperty()
  readonly id: number;
  @IsNumber()
  @ApiModelProperty()
  readonly event_id: number;
  @IsString()
  @ApiModelProperty()
  readonly customer_type: string;
  @IsString()
  @ApiModelProperty()
  readonly name: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly school_name: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly class: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly phone: string;
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly email: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(type => TicketsDto)
  tickets: Tickets[];

  @IsOptional()
  @IsBoolean()
  payment_completed: boolean;

  @IsOptional()
  @IsBoolean()
  sms_sent: boolean;

  @IsOptional()
  @IsBoolean()
  cancelled: boolean;
}
