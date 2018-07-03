import { IsString, IsNumber } from 'class-validator';
export class PriceDto {
  @IsNumber() readonly price: number;

  @IsString() readonly ticket_description: string;

  @IsString() readonly available_seat_for_this_type: number;
}
