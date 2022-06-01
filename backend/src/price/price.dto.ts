import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PriceDto {

  @IsOptional() readonly id: number;
  @IsNumber()
  readonly price: number;

  @IsString()
  readonly ticket_description: string;

  @IsNumber()
  readonly max_seats: number;

  @IsNumber()
  readonly occupied_seats: number;
}
