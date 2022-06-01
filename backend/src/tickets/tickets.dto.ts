import { IsNumber } from 'class-validator';
export class TicketsDto {
  @IsNumber()
  readonly price_id: number;

  @IsNumber()
  readonly no_of_tickets: number;
}
