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
import { Tickets } from '../tickets/tickets.entity';
import { TicketsDto } from '../tickets/tickets.dto';
export class ReservationsDto {
  @IsOptional()
  readonly id: number;

  @IsNumber()
  readonly event_id: number;

  @IsString()
  @MaxLength(100)
  readonly customer_type: string;

  @IsString()
  @MaxLength(300)
  readonly name: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  readonly school_name: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  readonly class: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  readonly phone: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  readonly email: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(_ => TicketsDto)
  tickets: Tickets[];

  @IsOptional()
  @IsBoolean()
  confirmed: boolean;

  @IsOptional()
  @IsBoolean()
  sms_sent: boolean;

  @IsOptional()
  @IsBoolean()
  cancelled: boolean;

  @IsOptional()
  @IsBoolean()
  payment_completed: boolean;

  @IsOptional()
  @IsBoolean()
  payment_required: boolean;

  @IsOptional()
  @IsString()
  created_date: string;
}
