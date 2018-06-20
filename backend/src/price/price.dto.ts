import { IsString, IsNumber } from 'class-validator';
export class PriceDto {
  @IsString() readonly price: number;

  @IsString() readonly;
  type: string;

  @IsString() readonly description: string;

  @IsString() readonly seats: number;
}
